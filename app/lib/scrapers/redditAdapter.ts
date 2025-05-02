export async function getRedditReviews(product: string) {
    const encoded = encodeURIComponent(`${product} review`);
    const url = `https://www.reddit.com/search.json?q=${encoded}&limit=5`;
  
    const res = await fetch(url);
    const json = await res.json();
  
    return json.data.children.map((post: any) => ({
      title: post.data.title,
      content: post.data.selftext,
      upvotes: post.data.ups,
      url: `https://reddit.com${post.data.permalink}`,
    }));
  }
  