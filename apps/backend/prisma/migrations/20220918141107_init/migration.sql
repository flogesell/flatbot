-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "ownerOfId" TEXT,
    "flatId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "flats" (
    "flatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flats_pkey" PRIMARY KEY ("flatId")
);

-- CreateTable
CREATE TABLE "expenses" (
    "expenseId" TEXT NOT NULL,
    "flatId" TEXT NOT NULL,
    "expenseById" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("expenseId")
);

-- CreateTable
CREATE TABLE "_ExpenseToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_ownerOfId_key" ON "users"("ownerOfId");

-- CreateIndex
CREATE UNIQUE INDEX "flats_ownerId_key" ON "flats"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "_ExpenseToUser_AB_unique" ON "_ExpenseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpenseToUser_B_index" ON "_ExpenseToUser"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "flats"("flatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "flats"("flatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_expenseById_fkey" FOREIGN KEY ("expenseById") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToUser" ADD CONSTRAINT "_ExpenseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "expenses"("expenseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToUser" ADD CONSTRAINT "_ExpenseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
