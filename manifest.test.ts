import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Asserts the shape of the generated manifest.json after `npm run build`.
 * Run `npm run build` first, then this test reads `.output/chrome-mv3/manifest.json`.
 *
 * These tests will fail until the build output exists AND the wxt.config.ts
 * manifest block is fully fleshed out.
 */
describe("Generated manifest.json shape", () => {
  let manifest: Record<string, unknown>;

  try {
    const raw = readFileSync(
      resolve(__dirname, ".output/chrome-mv3/manifest.json"),
      "utf-8"
    );
    manifest = JSON.parse(raw);
  } catch {
    // Build output doesn't exist yet — tests will fail with a clear message
    manifest = {};
  }

  it("has name", () => {
    expect(manifest.name).toBe("Chrome Notes");
  });

  it("has description", () => {
    expect(manifest.description).toBe("Quick notes in your browser");
  });

  it("has version derived from package.json", () => {
    expect(manifest.version).toBe("0.0.1");
  });

  it("has manifest_version 3", () => {
    expect(manifest.manifest_version).toBe(3);
  });

  it("has all four icon sizes", () => {
    const icons = manifest.icons as Record<string, string> | undefined;
    expect(icons).toBeDefined();
    expect(icons?.["16"]).toMatch(/16\.png$/);
    expect(icons?.["32"]).toMatch(/32\.png$/);
    expect(icons?.["48"]).toMatch(/48\.png$/);
    expect(icons?.["128"]).toMatch(/128\.png$/);
  });

  it("has action block with default_title and default_icon", () => {
    const action = manifest.action as Record<string, unknown> | undefined;
    expect(action).toBeDefined();
    expect(action?.default_title).toBe("Chrome Notes");
    const defaultIcon = action?.default_icon as Record<string, string> | undefined;
    expect(defaultIcon).toBeDefined();
    expect(defaultIcon?.["16"]).toMatch(/16\.png$/);
    expect(defaultIcon?.["128"]).toMatch(/128\.png$/);
  });

  it("has _execute_action command with Ctrl+Shift+Y shortcut", () => {
    const commands = manifest.commands as Record<string, unknown> | undefined;
    expect(commands).toBeDefined();
    const executeAction = commands?.["_execute_action"] as Record<string, unknown> | undefined;
    expect(executeAction).toBeDefined();
    const suggested = executeAction?.suggested_key as Record<string, string> | undefined;
    expect(suggested?.default).toBe("Ctrl+Shift+Y");
    expect(suggested?.mac).toBe("Command+Shift+Y");
  });

  it("has storage and sidePanel permissions", () => {
    expect(manifest.permissions).toContain("storage");
    expect(manifest.permissions).toContain("sidePanel");
  });

  it("has side_panel with default_path", () => {
    const sidePanel = manifest.side_panel as Record<string, unknown> | undefined;
    expect(sidePanel).toBeDefined();
    expect(sidePanel?.default_path).toBe("sidepanel.html");
  });

  it("has minimum_chrome_version", () => {
    expect(manifest.minimum_chrome_version).toBe("116");
  });

  it("has homepage_url", () => {
    expect(manifest.homepage_url).toBe("https://github.com/sarpavci/chrome-notes");
  });

  it("does not have host_permissions", () => {
    expect(manifest.host_permissions).toBeUndefined();
  });
});
