import mongoose from "mongoose";
import getDate from "./get-date.js";

export default async function generateSlug(
  name: string,
  model: mongoose.Model<any>
): Promise<string> {
  const formattedName = name
    .toLowerCase()
    .replace(/[^a-z0-9_ ]/g, "")
    .replace(/\s+/g, "-");
  const slug = formattedName + "-" + Math.floor(Math.random() * 1000);

  try {
    // check if slug already exists
    const existingSlug = await model.findOne({ slug: slug });
    if (existingSlug) {
      return generateSlug(name, model);
    }

    return slug;
  } catch (err) {
    console.log("Error generating slug - ", getDate(), "\n---\n", err);
    throw err;
  }
}
