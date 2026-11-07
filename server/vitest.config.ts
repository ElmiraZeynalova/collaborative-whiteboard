import { defineConfig } from "vitest/config";
import { config } from "dotenv";

config({ path: ".env.test" });

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    setupFiles: ["src/tests/setup.ts"],
    globalSetup: ["src/tests/global-setup.ts"],
    fileParallelism: false, 
    testTimeout: 15000,
    env: {
      NODE_ENV: "test",
    },
  },
});