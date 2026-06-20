export function deSlugify(
  slug: string,
  hasAdditionalText: boolean = true,
): string {
  // Remove the random suffix (last 7 chars: -xxxxxx)
  const base = hasAdditionalText ? slug.slice(0, -7) : slug;
  // Replace hyphens with spaces and capitalize words
  return base
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
