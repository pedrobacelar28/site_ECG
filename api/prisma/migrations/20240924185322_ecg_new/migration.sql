-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "tokenRecPass" TEXT,
    "dateRecPass" DATETIME
);

-- CreateTable
CREATE TABLE "ECG" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "oldClassification" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "noise" BOOLEAN NOT NULL,
    "imagem" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
