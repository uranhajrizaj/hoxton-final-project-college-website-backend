-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mark" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "Mark_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mark_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Mark" ("id", "mark", "studentId", "subjectId", "teacherId") SELECT "id", "mark", "studentId", "subjectId", "teacherId" FROM "Mark";
DROP TABLE "Mark";
ALTER TABLE "new_Mark" RENAME TO "Mark";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "teacherId" INTEGER,
    "parentId" INTEGER,
    "classId" INTEGER,
    CONSTRAINT "User_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("classId", "email", "fullname", "id", "image", "parentId", "password", "role", "teacherId") SELECT "classId", "email", "fullname", "id", "image", "parentId", "password", "role", "teacherId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_News" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "userId" INTEGER,
    CONSTRAINT "News_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_News" ("content", "id", "image", "title", "userId") SELECT "content", "id", "image", "title", "userId" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
