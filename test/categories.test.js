import npmPackages from "all-the-package-names";
import Ajv from "ajv";

import categories from "../index.js";

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    slug: { type: "string" },
    packages: {
      type: "array",
      minItems: 1,
      items: { type: "string" },
    },
  },
  required: ["name", "description", "slug", "packages"],
  additionalProperties: false,
};
const ajv = new Ajv();
const validate = ajv.compile(schema);

it("defines packages only once", () => {
  const packages = categories.flatMap((category) => category.packages);
  const duplicates = packages.filter((packageName, index) => {
    return packages.includes(packageName, index + 1);
  });

  expect(duplicates).toHaveLength(0);
});

describe.each(categories)('Category "$name"', (category) => {
  it("validates against JSON schema", () => {
    const valid = validate(category);
    expect(valid).toBe(true);
  });

  it("defines packages in alphabetical order", () => {
    const sorted = Array.from(category.packages).sort();
    expect(category.packages).toStrictEqual(sorted);
  });

  describe.each(category.packages)('Package "%s"', (packageName) => {
    it("is an existing NPM package", () => {
      expect(npmPackages).toContain(packageName);
    });
  });
});
