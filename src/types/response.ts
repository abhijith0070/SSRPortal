export type TeamImportResponse = {
  imported: number;
  existing: number;
  importedTeams: { code: string, reason: string }[];
  existingTeams: { code: string, reason: string }[];
};