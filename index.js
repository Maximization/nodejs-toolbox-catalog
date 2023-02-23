import fs from "node:fs/promises";
import path from "node:path";
import debug from "debug";

const errorLog = debug("nodejs-toolbox-catalog:error");

const CATEGORIES_DIRECTORY = "./src/categories";
const categories = [];

try {
  const categoryFiles = await fs.readdir(
    new URL(CATEGORIES_DIRECTORY, import.meta.url)
  );

  for (const categoryFile of categoryFiles) {
    const contents = await fs.readFile(
      new URL(`${CATEGORIES_DIRECTORY}/${categoryFile}`, import.meta.url),
      { encoding: "utf-8" }
    );

    const category = JSON.parse(contents);

    category.slug = path.parse(categoryFile).name;
    categories.push(category);
  }
} catch (error) {
  errorLog("Failed to parse categories %O", error);
  throw error;
}

export default categories;
