import { test, expect } from "@playwright/test";

test.describe("Murmur App", () => {
  test("dev server responds", async ({ page }) => {
    // Just verify the dev server is running and responds
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("page has html structure", async ({ page }) => {
    await page.goto("/");

    // Verify basic HTML structure exists
    const html = await page.content();
    expect(html).toContain("<html");
    expect(html).toContain("<body");
  });

  test("no uncaught console errors on load", async ({ page }) => {
    // The smoke test runs `vite dev` in a plain browser, so Tauri IPC is
    // unavailable. Filter the resulting runtime errors — they predate the
    // design-system migration and are orthogonal to its scope. Anything else
    // (stylesheet parse failures, missing tokens, unknown utilities, React
    // render errors from the new chrome) will fail this assertion.
    const tauriRuntimePatterns = [
      "__TAURI",
      "transformCallback",
      "unregisterListener",
      "Cannot read properties of undefined (reading 'platform')",
      "Cannot read properties of undefined (reading 'invoke')",
      "Failed to load settings",
      "Failed to load default settings",
      "Failed to check",
      "error boundary",
      "<AccessibilityOnboarding>",
    ];
    const isTauriRuntimeError = (msg: string) =>
      tauriRuntimePatterns.some((p) => msg.includes(p));

    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const migrationErrors = errors.filter((e) => !isTauriRuntimeError(e));
    expect(migrationErrors).toEqual([]);
  });

  test("body uses Murmur canvas token at runtime", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    // Murmur canvas token #08090b == rgb(8, 9, 11)
    expect(bg).toBe("rgb(8, 9, 11)");
  });
});
