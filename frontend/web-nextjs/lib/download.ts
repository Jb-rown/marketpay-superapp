/** Client-side download of non-sensitive demonstration data. No backend is contacted. */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const cell = (value: string | number) => `"${String(value).replace(/"/g,'""')}"`;
  const content = [headers,...rows].map(row=>row.map(cell).join(",")).join("\r\n");
  downloadText(filename,"\uFEFF"+content,"text/csv;charset=utf-8");
}
export function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  if(typeof document === "undefined")return;
  const url=URL.createObjectURL(new Blob([content],{type:mime}));
  const link=document.createElement("a");link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
