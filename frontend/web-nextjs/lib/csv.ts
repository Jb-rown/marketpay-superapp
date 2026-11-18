/** Lightweight RFC4180-like CSV parser supporting quoted fields and escaped quotes. */
export function parseCsv(text:string):string[][] {
  const rows:string[][]=[];let cells:string[]=[],value="",quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"') { if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted; }
    else if(c===','&&!quoted){cells.push(value.trim());value="";}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;cells.push(value.trim());if(cells.some(Boolean))rows.push(cells);cells=[];value="";}
    else value+=c;
  }
  if(quoted)throw new Error("The CSV has an unclosed quoted field.");
  cells.push(value.trim());if(cells.some(Boolean))rows.push(cells);
  if(rows[0]?.[0])rows[0][0]=rows[0][0].replace(/^\uFEFF/,"");
  return rows;
}
