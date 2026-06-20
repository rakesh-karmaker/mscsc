export default function capitalize(word: string): string {
  if (word.length === 0) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
