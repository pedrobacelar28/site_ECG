/*
  Warnings:

  - Added the required column `exam_id` to the `ECG` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ECG" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exam_id" TEXT NOT NULL,
    "oldClassification" TEXT NOT NULL,
    "classification" TEXT,
    "noise" BOOLEAN,
    "imagem" TEXT NOT NULL
);
INSERT INTO "new_ECG" ("classification", "id", "imagem", "noise", "oldClassification") SELECT "classification", "id", "imagem", "noise", "oldClassification" FROM "ECG";
DROP TABLE "ECG";
ALTER TABLE "new_ECG" RENAME TO "ECG";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
