-- CreateEnum
CREATE TYPE "NotifChannel" AS ENUM ('sms', 'mail');

-- CreateEnum
CREATE TYPE "NotifStatus" AS ENUM ('sent', 'failed', 'dead');

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" TEXT NOT NULL,
    "channel" "NotifChannel" NOT NULL,
    "type" VARCHAR(60) NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "status" "NotifStatus" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "provider_ref" VARCHAR(255),
    "error" TEXT,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_logs_channel_status_idx" ON "notification_logs"("channel", "status");

-- CreateIndex
CREATE INDEX "notification_logs_recipient_idx" ON "notification_logs"("recipient");
