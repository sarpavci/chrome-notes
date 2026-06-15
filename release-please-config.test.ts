import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(__dirname);

describe("release-please-config.json", () => {
  it("is valid JSON with required fields", () => {
    const raw = readFileSync(resolve(root, "release-please-config.json"), "utf-8");
    const config = JSON.parse(raw);
    expect(config).toHaveProperty("release-type", "node");
    expect(config).toHaveProperty("packages");
    expect(config.packages).toHaveProperty(".");
  });

  it("does not include manifest.json as a tracked file", () => {
    const raw = readFileSync(resolve(root, "release-please-config.json"), "utf-8");
    expect(raw).not.toContain("manifest.json");
  });
});

describe(".release-please-manifest.json", () => {
  it("is valid JSON seeded at 0.0.1 for the root package", () => {
    const raw = readFileSync(resolve(root, ".release-please-manifest.json"), "utf-8");
    const manifest = JSON.parse(raw);
    expect(manifest).toHaveProperty(".", "0.0.1");
  });
});
