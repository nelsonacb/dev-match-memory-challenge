import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// * GET /api/games/stats - Get game statistics
export async function GET() {
  try {
    const [wonGames, allGames] = await Promise.all([
      prisma.game.findMany({
        where: { won: true },
      }),
      prisma.game.findMany(),
    ]);

    if (wonGames.length === 0) {
      return NextResponse.json({
        totalGames: allGames.length,
        wonGames: 0,
        avgTime: 0,
        avgAttempts: 0,
        avgScore: 0,
        bestTime: 0,
        bestScore: 0,
        bestStreak: 0,
      });
    }

    const totalTime = wonGames.reduce((sum, g) => sum + g.timeSeconds, 0);
    const totalAttempts = wonGames.reduce((sum, g) => sum + g.attempts, 0);
    const totalScore = wonGames.reduce((sum, g) => sum + g.score, 0);

    const bestTime = Math.min(...wonGames.map((g) => g.timeSeconds));
    const bestScore = Math.max(...wonGames.map((g) => g.score));
    const bestStreak = Math.max(...wonGames.map((g) => g.maxStreak));

    return NextResponse.json({
      totalGames: allGames.length,
      wonGames: wonGames.length,
      avgTime: Math.round(totalTime / wonGames.length),
      avgAttempts: Math.round(totalAttempts / wonGames.length),
      avgScore: Math.round(totalScore / wonGames.length),
      bestTime,
      bestScore,
      bestStreak,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 },
    );
  }
}
