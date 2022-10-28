-- CreateTable
CREATE TABLE "User" (
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "TodoItem" (
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TodoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "TodoItem" ADD CONSTRAINT "TodoItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
