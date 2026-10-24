import "dotenv/config";
import { defineConfig } from "prisma/config";

declare const process: {
  env: Record<string, string | undefined>;
};

const env = process.env;

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env["DIRECT_URL"]!,
  },
});