const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa el texto y convierte `**así**` en <strong>, para los logros escritos en sitio.ts. */
export function conNegritas(texto: string): string {
  const seguro = texto.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
  return seguro.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink">$1</strong>');
}
