/*
  Warnings:

  - Made the column `studentId` on table `Mark` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subjectId` on table `Mark` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teacherId` on table `Mark` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mark" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "Mark_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mark_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mark" ("id", "mark", "studentId", "subjectId", "teacherId") SELECT "id", "mark", "studentId", "subjectId", "teacherId" FROM "Mark";
DROP TABLE "Mark";
ALTER TABLE "new_Mark" RENAME TO "Mark";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
