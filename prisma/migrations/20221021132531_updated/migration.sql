/*
  Warnings:

  - Made the column `userId` on table `News` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "News_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_News" ("content", "id", "image", "title", "userId") SELECT "content", "id", "image", "title", "userId" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
