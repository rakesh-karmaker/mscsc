export default function urlChanger(
  prevSlug: string,
  newSlug: string,
  url: string,
): string {
  if (prevSlug === newSlug) {
    return url;
  }

  const regex = new RegExp(prevSlug, "g");
  return url.replace(regex, newSlug);
}
