export const TAU = Math.PI * 2, QUARTER = Math.PI / 2, BRAIN_SCALE = .82;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function brainTransform(yaw, pitch) {
    const cy = Math.cos(yaw - .28), sy = Math.sin(yaw - .28), cx = Math.cos(pitch + .12), sx = Math.sin(pitch + .12);
    return new Float32Array([cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy]);
}
export function projectBrainPoint(point, matrix, aspect) {
    const [x, y, z] = point;
    const vx = matrix[0] * x + matrix[3] * y + matrix[6] * z;
    const vy = matrix[1] * x + matrix[4] * y + matrix[7] * z;
    const vz = matrix[2] * x + matrix[5] * y + matrix[8] * z;
    return { x: 500 + vx * 2.8 / aspect / (3.65 - vz) * 500 * BRAIN_SCALE, y: 500 - vy * 2.8 / (3.65 - vz) * 500 * BRAIN_SCALE, depth: vz };
}
// Crossfade adjacent areas using orientation, so dragging backwards also
// reverses the sequence. The four weights always sum to one.
export function flowWeight(yaw, index) {
    const distance = Math.abs(Math.atan2(Math.sin(yaw - index * QUARTER), Math.cos(yaw - index * QUARTER)));
    return distance >= QUARTER ? 0 : (1 + Math.cos(distance * 2)) / 2;
}
export function corticalAnchors(folds) {
    const targets = [[-.38, .46, .65], [.48, .14, .65], [-.38, -.32, .65], [.35, -.48, .6]];
    return targets.map((target, i) => {
        // Put each attachment on the visible cortex at its own featured angle,
        // then snap it to an actual fold rather than a floating screen coordinate.
        const matrix = brainTransform(i * QUARTER, .18);
        const local = target.map((_, axis) => matrix[axis * 3] * target[0] + matrix[axis * 3 + 1] * target[1] + matrix[axis * 3 + 2] * target[2]);
        let nearest = target, distance = Infinity;
        for (let k = 0; k < folds.length; k += 6) {
            const d = (folds[k] - local[0]) ** 2 + (folds[k + 1] - local[1]) ** 2 + (folds[k + 2] - local[2]) ** 2;
            if (d < distance) {
                distance = d;
                nearest = [folds[k], folds[k + 1], folds[k + 2]];
            }
        }
        return nearest;
    });
}
export function flowRails(boxes) {
    const padding = 12, gap = 16, maxScale = 1.06;
    const totalHeight = boxes.reduce((sum, box) => sum + box.height * maxScale, 0);
    const travelY = clamp((1000 - totalHeight - padding * 2 - gap * (boxes.length - 1)) / (boxes.length * 2), 0, 16);
    const rails = boxes.map((box, i) => {
        const travelX = 500 - box.width * maxScale / 2 - padding;
        const initialX = clamp((box.x + box.width / 2 - 500) / travelX, -.9, .9);
        return { box, centerY: box.y + box.height / 2, travelY, initialX, initialZ: Math.sqrt(1 - initialX ** 2) * [1, -1, -1, 1][i] };
    });
    // Keep the approved upper/middle/lower distribution. Separate the vertical
    // lanes before animating so labels can cross horizontally without colliding.
    let bottom = padding;
    for (const rail of rails) {
        const half = rail.box.height * maxScale / 2 + travelY;
        rail.centerY = Math.max(rail.centerY, bottom + half);
        bottom = rail.centerY + half + gap;
    }
    let top = 1000 - padding;
    for (const rail of [...rails].reverse()) {
        const half = rail.box.height * maxScale / 2 + travelY;
        rail.centerY = Math.min(rail.centerY, top - half);
        top = rail.centerY - half - gap;
    }
    return rails;
}
export function flowLabel(rail, yaw, pitch, weight) {
    const { box, initialX, initialZ, centerY, travelY } = rail;
    // Billboard text stays upright while its orbit turns around the same Y axis
    // as the brain. Reserve space for the largest scale at every orientation.
    const x = initialX * Math.cos(yaw) + initialZ * Math.sin(yaw);
    const z = -initialX * Math.sin(yaw) + initialZ * Math.cos(yaw);
    const scale = .88 + weight * .18;
    const cx = 500 + x * (500 - box.width * 1.06 / 2 - 12);
    const cy = centerY + travelY * (z * .7 + Math.sin(pitch - .18) * .3);
    return { x: cx - box.width * scale / 2, y: cy - box.height * scale / 2, width: box.width * scale, height: box.height * scale, cx, cy, scale };
}
export function connectionDock(anchor, box) {
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    const dx = anchor.x - cx, dy = anchor.y - cy;
    const distance = Math.max(Math.abs(dx) / (box.width / 2), Math.abs(dy) / (box.height / 2), .001);
    return { x: cx + dx / distance, y: cy + dy / distance };
}
