export default function generateSlug(
  title: string,
  addAdditionalText: boolean = true,
): string {
  return (
    title.toLowerCase().replace(/\s+/g, "-") +
    (addAdditionalText ? "-" + Math.floor(Math.random() * 1000) : "")
  );
}
