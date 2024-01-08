-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "style" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    CONSTRAINT "Avatar_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" INTEGER NOT NULL,
    "firstQuestion" TEXT,
    "secondQuestion" TEXT,
    "thirdQuestion" TEXT,
    "fourthQuestion" TEXT,
    "fifthQuestion" TEXT,
    "sixthQuestion" TEXT,
    "seventhQuestion" TEXT,
    "comentaries" TEXT,
    "chatId" INTEGER NOT NULL,
    CONSTRAINT "Survey_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_key" ON "User"("firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userID_key" ON "Avatar"("userID");
