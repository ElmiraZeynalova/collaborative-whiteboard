import { execSync } from "node:child_process";

export default function setup() {
  if (process.env.DATABASE_URL?.includes("amazonaws.com")) {
    throw new Error("Tests must not run against the production database");
  }
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
}

//docker compose up -d db-test, затем npm test