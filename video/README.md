# Videos de los proyectos (Hyperframes)

`index.html` es una composición de [Hyperframes](https://github.com/heygen-com/hyperframes). Toma una captura de escritorio y una de celular de cada proyecto y arma un recorrido de 9 segundos sin texto. Como no tiene texto, el mismo video sirve para las dos versiones del sitio. El primer y el último cuadro coinciden, así el loop no salta.

El sitio usa estos videos en dos lugares:

- como textura del panel del frente en el carrusel 3D;
- en el detalle de cada proyecto y en su caso de estudio.

## Requisitos

- Node.js 22 o superior.
- FFmpeg.
- Chrome. Si `npx hyperframes doctor` no lo encuentra, ejecutá `npx hyperframes browser ensure` o apuntá a uno instalado:

```bash
export HYPERFRAMES_BROWSER_PATH=/ruta/a/chrome
```

## Renderizar

Desde esta carpeta:

```bash
npx hyperframes lint .
npx hyperframes preview          # vista previa con recarga
npx hyperframes render . -o renders/fracxion.mp4 \
  --variables '{"desk":"assets/fracxion-overview.png","phone":"assets/fracxion-mobile.png"}'
npx hyperframes render . -o renders/ragnar-suplementos.mp4 \
  --variables '{"desk":"assets/ragnar.webp","phone":"assets/ragnar-mobile.webp"}'
npx hyperframes render . -o renders/roadledger.mp4 \
  --variables '{"desk":"assets/roadledger.webp","phone":"assets/roadledger-mobile.webp"}'
```

## Comprimir y publicar

El render sale con mucha calidad (unos 4 MB). Para el sitio, comprimilo y generá el póster con FFmpeg:

```bash
for id in fracxion ragnar-suplementos roadledger; do
  ffmpeg -y -i renders/$id.mp4 -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p \
    -movflags +faststart ../public/video/$id.mp4
  ffmpeg -y -i ../public/video/$id.mp4 -frames:v 1 -q:v 4 ../public/video/$id.jpg
done
```

El build detecta solo `public/video/<id>.mp4`. Si un proyecto no tiene video, el sitio usa la captura.

## Pendiente

Estos videos recorren capturas estáticas. Cuando tengas grabaciones reales de cada app (un flujo de compra, la emisión de una factura), reemplazá las capturas por esos videos dentro de la composición. La skill `media-use` de Hyperframes explica cómo usar video como fuente.
