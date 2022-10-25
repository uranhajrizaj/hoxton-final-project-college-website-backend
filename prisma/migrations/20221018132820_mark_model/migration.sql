-- CreateTable
CREATE TABLE "Mark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mark" INTEGER NOT NULL,
    "subjectId" INTEGER,
    "teacherId" INTEGER,
    "studentId" INTEGER,
    CONSTRAINT "Mark_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mark_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
