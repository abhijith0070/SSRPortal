/*
  Warnings:

  - Added the required column `batch` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamNumber` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "projectPillar" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "statusMessage" TEXT,
    "mentorId" TEXT,
    "leadId" TEXT,
    "teamNumber" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Team_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Team_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("createdAt", "id", "leadId", "mentorId", "name", "projectPillar", "projectTitle", "status", "statusMessage", "updatedAt") SELECT "createdAt", "id", "leadId", "mentorId", "name", "projectPillar", "projectTitle", "status", "statusMessage", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_leadId_key" ON "Team"("leadId");
CREATE UNIQUE INDEX "Team_teamNumber_key" ON "Team"("teamNumber");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
