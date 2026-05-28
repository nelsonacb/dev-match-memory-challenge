import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// * GET /api/games - Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'time';
    const difficulty = searchParams.get('difficulty');
    const mode = searchParams.get('mode');

    const where: Record<string, unknown> = { won: true };
    if (difficulty) where.difficulty = difficulty;
    if (mode) where.mode = mode;

    let orderBy: Record<string, string>[];
    switch (sortBy) {
      case 'score':
        orderBy = [{ score: 'desc' }, { timeSeconds: 'asc' }];
        break;
      case 'streak':
        orderBy = [{ maxStreak: 'desc' }, { score: 'desc' }];
        break;
      case 'time':
      default:
        orderBy = [{ timeSeconds: 'asc' }, { attempts: 'asc' }];
        break;
    }

    const games = await prisma.game.findMany({
      where,
      orderBy,
      take: limit,
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 },
    );
  }
}

// * POST /api/games - Save a game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      playerName,
      timeSeconds,
      attempts,
      score = 0,
      maxStreak = 0,
      difficulty = 'easy',
      mode = 'normal',
      won,
    } = body;

    if (typeof timeSeconds !== 'number' || typeof attempts !== 'number') {
      return NextResponse.json({ error: 'Invalid game data' }, { status: 400 });
    }

    const game = await prisma.game.create({
      data: {
        playerName: playerName || 'Anonymous',
        timeSeconds,
        attempts,
        score,
        maxStreak,
        difficulty,
        mode,
        won: won ?? true,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Failed to save game:', error);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}
