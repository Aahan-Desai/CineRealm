export function similarity(a: string, b: string): number {
  const aWords = a.toLowerCase().split(" ");
  const bWords = b.toLowerCase().split(" ");

  const common = aWords.filter(word => bWords.includes(word));

  return common.length / Math.max(aWords.length, bWords.length);
}