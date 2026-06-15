import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { parse } from "yaml";

const root = resolve(__dirname);
const workflowPath = resolve(root, ".github/workflows/upload-release-zip.yml");

describe("upload-release-zip workflow", () => {
  it("exists as a YAML file", () => {
    const raw = readFileSync(workflowPath, "utf-8");
    expect(raw.length).toBeGreaterThan(0);
  });

  it("triggers only on release published events", () => {
    const raw = readFileSync(workflowPath, "utf-8");
    const workflow = parse(raw);
    expect(workflow.on).toHaveProperty("release");
    expect(workflow.on.release.types).toContain("published");
  });

  it("has contents: write permission", () => {
    const raw = readFileSync(workflowPath, "utf-8");
    const workflow = parse(raw);
    expect(workflow.permissions?.contents).toBe("write");
  });

  it("runs npm ci and npm run zip steps", () => {
    const raw = readFileSync(workflowPath, "utf-8");
    const workflow = parse(raw);
    const steps: { run?: string; uses?: string }[] = Object.values(
      workflow.jobs
    ).flatMap((job: { steps?: { run?: string; uses?: string }[] }) => job.steps ?? []);
    const runs = steps.map((s) => s.run ?? "").filter(Boolean);
    expect(runs.some((r) => r.includes("npm ci"))).toBe(true);
    expect(runs.some((r) => r.includes("npm run zip"))).toBe(true);
  });

  it("uploads artifact using the *-chrome.zip glob", () => {
    const raw = readFileSync(workflowPath, "utf-8");
    const workflow = parse(raw);
    const steps: { run?: string }[] = Object.values(workflow.jobs).flatMap(
      (job: { steps?: { run?: string }[] }) => job.steps ?? []
    );
    const uploadStep = steps.find((s) => s.run?.includes("gh release upload"));
    expect(uploadStep).toBeDefined();
    expect(uploadStep!.run).toContain("*-chrome.zip");
  });
});
