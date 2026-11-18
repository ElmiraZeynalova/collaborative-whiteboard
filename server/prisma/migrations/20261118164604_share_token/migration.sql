/*
  Warnings:

  - A unique constraint covering the columns `[share_token]` on the table `boards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "boards_share_token_key" ON "boards"("share_token");
