-- CreateTable
CREATE TABLE "PinCode2FA" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinCode2FA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PinCode2FA_code_key" ON "PinCode2FA"("code");
