// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRedditReviews } from "@/app/lib/scrapers/redditAdapter";
import { getYoutubeReviewVideo } from "@/app/lib/scrapers/youtubeAdapter";
import { analyzeReviewsWithGemini } from "@/app/lib/scrapers/geminiAdapter";
import { getReview, insertReview } from "@/lib/DB/review";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const query = searchParams.get("query");

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }


  try {
    const review = await getReview(query);
    if (review ) {
      return NextResponse.json({ review }, { status: 200 });
    }

    const [redditReviews, youtubeReview] = await Promise.all([
      getRedditReviews(query),
      getYoutubeReviewVideo(query),
    ]);

    const youtube = youtubeReview
      ? {
          video_title: youtubeReview.title,
          thumbnail_url: youtubeReview.thumbnail,
          video_id: youtubeReview.videoId,
          channel_title: youtubeReview.channelTitle,
        }
      : null;

    const geminiSummary = await analyzeReviewsWithGemini({
      product: query,
      reddit: redditReviews,
    });

     if (
      geminiSummary &&
      redditReviews?.length > 0 &&
      youtube &&
      userId
    ) {
      const insertedReview = await insertReview(query, userId, redditReviews, geminiSummary, youtube);
      return NextResponse.json({ review: insertedReview }, { status: 201 });
    }


   
    return NextResponse.json({
      review:{
        product: query,
        redditReviews,
        youtubeReview: youtube,
        geminiSummary,
      }},
      { status: 200 }
    );
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}