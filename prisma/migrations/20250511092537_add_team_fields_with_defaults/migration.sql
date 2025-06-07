-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT DEFAULT 'Untitled Team',
    "projectTitle" TEXT DEFAULT 'Untitled Project',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "mentorId" TEXT,
    "leadId" TEXT,
    "members" TEXT NOT NULL,
    CONSTRAINT "Team_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Team_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("code", "leadId", "members", "mentorId", "name", "projectTitle", "status") SELECT "code", "leadId", "members", "mentorId", "name", "projectTitle", "status" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");
CREATE UNIQUE INDEX "Team_leadId_key" ON "Team"("leadId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
