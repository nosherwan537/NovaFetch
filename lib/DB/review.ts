import { supabase } from "@/lib/DB/db";

type Review = {
  search_query: string;
  user_id: number;
};
type RedditReview = {
  title: string;
  content: string;
  upvotes: number;
  url: String;
};
type AiReview = {
  sentiment: string;
  opinion: string;
  specs: string;
};
type YoutubeReview = {
  video_title: string;
  thumbnail_url: string;
  video_id: string;
  channel_title: string;
};
export async function insertReview(
  search_query: string,
  user_id: number | null,
  redditReviews: RedditReview[],
  ai: AiReview,
  youtube: YoutubeReview
) {
  const { data, error } = user_id
    ? await supabase
        .from("review")
        .select("*")
        .eq("user_id", user_id)
        .eq("search_query", search_query)
    : await supabase
        .from("review")
        .select("*")
        .eq("search_query", search_query);

  if (data && data.length > 0) {
    return;
  }

  const { data: review_data, error: insertError } = await supabase
    .from("reviews")
    .insert([{ search_query: search_query, user_id: user_id }])
    .select();

  if (insertError || !review_data) {
    console.error("Error inserting review:", insertError);
    return;
  }

  const review_id = review_data?.[0]?.id;
  if (!review_id) {
    console.error("Review ID not found after insertion.");
    return;
  }

  const redditPayload = redditReviews.map((r) => ({
    review_id: review_id,
    reddit_title: r.title,
    reddit_content: r.content,
    reddit_upvotes: r.upvotes,
    reddit_url: r.url,
  }));

  const { data: reddit_data, error: redditError } = await supabase
    .from("redditreviews")
    .insert(redditPayload).select();

    // console.log("ai review", ai)
  const { data: ai_data, error: aiError } = await supabase
    .from("aireviews")
    .insert([
      {
        review_id: review_id,
        sentiment: ai.sentiment,
        opinion: ai.opinion,
        specs: ai.specs,
      },
    ]).select();

  const { data: youtube_data, error: youtubeError } = await supabase
    .from("youtubereviews")
    .insert([
      {
        review_id: review_id,
        video_title: youtube.video_title,
        thumbnail_url: youtube.thumbnail_url,
        video_id: youtube.video_id,
        channel_title: youtube.channel_title,
      },
    ]).select();

  if (redditError || aiError || youtubeError) {
    console.error(
      "Error inserting reviews:",
      redditError,
      aiError,
      youtubeError
    );
    return;
  }

  

  return { reddit_data, ai_data, youtube_data };
}

export async function getReview(search_query: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
            *,
            redditreviews (*),
            aireviews (*),
            youtubereviews (*)
        `
    )
    .eq("search_query", search_query);

  if (error) {
    console.error("Error fetching joined reviews:", error);
    return;
  }
  if(!data||data?.length===0){
    return null;
  }

  return     {
    product: search_query,
    redditReviews: data?.[0]?.redditreviews,
    youtubeReview: data?.[0]?.youtubereviews,
    geminiSummary: data?.[0]?.aireviews,
  };
}

export async function getReviewByUser(search_query: string, user_id: string) {
  const { data, error } = await supabase
    .from("review")
    .select(
      `
            *,
            redditreviews (*),
            aireviews (*),
            youtubereviews (*)
        `
    )
    .eq("search_query", search_query)
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching joined reviews:", error);
    return;
  }

  return data;
}
