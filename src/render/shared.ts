export const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const ext = (url: string) => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;
export const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
