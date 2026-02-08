export default function generateSlug(title: string): string {
  return (
    title.toLowerCase().replace(/\s+/g, "-") +
    "-" +
    Math.random().toString(36).substring(2, 8)
  );
}
