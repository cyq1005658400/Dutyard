export function formatDate(d: Date): string {
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
export function daysBetween(a:Date,b:Date): number {
  return Math.floor((b.getTime()-a.getTime())/86400000);
}


