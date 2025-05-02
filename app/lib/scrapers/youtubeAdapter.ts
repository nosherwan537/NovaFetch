const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

export async function getYoutubeReviewVideo(product: string) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(product + ' review')}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  const video = json.items?.[0];
  if (!video) return null;

  return {
    title: video.snippet.title,
    videoId: video.id.videoId,
    thumbnail: video.snippet.thumbnails.medium.url,
    channelTitle: video.snippet.channelTitle,
  };
}
