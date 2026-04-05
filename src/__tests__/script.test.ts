import { describe, it, expect } from "vitest";
import { getThemeScript } from "../script.js";

describe("getThemeScript", () => {
  it("returns a non-empty string", () => {
    const script = getThemeScript();
    expect(script).toBeTruthy();
    expect(typeof script).toBe("string");
  });

  it("is a self-executing function", () => {
    const script = getThemeScript();
    expect(script).toMatch(/^\(function\(\)\{/);
    expect(script).toMatch(/\}\)\(\)$/);
  });

  it("includes the default storage key", () => {
    const script = getThemeScript();
    expect(script).toContain('"theme"');
  });

  it("uses a custom storage key", () => {
    const script = getThemeScript({ storageKey: "my-theme" });
    expect(script).toContain('"my-theme"');
  });

  it("includes the default theme", () => {
    const script = getThemeScript();
    expect(script).toContain('"system"');
  });

  it("uses a custom default theme", () => {
    const script = getThemeScript({ defaultTheme: "dark" });
    expect(script).toContain('"dark"');
  });

  it("includes the default attribute", () => {
    const script = getThemeScript();
    expect(script).toContain('"data-theme"');
  });

  it("uses a custom attribute", () => {
    const script = getThemeScript({ attribute: "class" });
    expect(script).toContain('"class"');
  });

  it("handles array attributes", () => {
    const script = getThemeScript({ attribute: ["data-theme", "class"] });
    expect(script).toContain('"data-theme"');
    expect(script).toContain('"class"');
  });

  it("includes value mapping when provided", () => {
    const script = getThemeScript({
      value: { dark: "theme-dark", light: "theme-light" },
    });
    expect(script).toContain("theme-dark");
    expect(script).toContain("theme-light");
  });

  it("includes media query for system theme detection", () => {
    const script = getThemeScript();
    expect(script).toContain("prefers-color-scheme: dark");
  });

  it("reads from localStorage", () => {
    const script = getThemeScript();
    expect(script).toContain("localStorage.getItem");
  });

  it("sets attribute on document.documentElement", () => {
    const script = getThemeScript();
    expect(script).toContain("document.documentElement");
  });
});
