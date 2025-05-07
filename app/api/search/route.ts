// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRedditReviews } from '@/app/lib/scrapers/redditAdapter';
import { getYoutubeReviewVideo } from '@/app/lib/scrapers/youtubeAdapter';
import { analyzeReviewsWithGemini } from '@/app/lib/scrapers/geminiAdapter';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const [redditReviews, youtubeVideo] = await Promise.all([
      getRedditReviews(query),
      getYoutubeReviewVideo(query),
    ]);

    const geminiSummary = await analyzeReviewsWithGemini({
        product: query,
        reddit: redditReviews,
      });

    return NextResponse.json({
      product: query,
      redditReviews,
      youtubeVideo,
      gemini: geminiSummary,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
