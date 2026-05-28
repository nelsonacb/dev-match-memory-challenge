-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL DEFAULT 'Anonymous',
    "timeSeconds" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL DEFAULT 'easy',
    "mode" TEXT NOT NULL DEFAULT 'normal',
    "won" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Game_won_timeSeconds_idx" ON "Game"("won", "timeSeconds");

-- CreateIndex
CREATE INDEX "Game_won_score_idx" ON "Game"("won", "score");

-- CreateIndex
CREATE INDEX "Game_won_maxStreak_idx" ON "Game"("won", "maxStreak");
