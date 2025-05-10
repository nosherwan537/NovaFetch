"use client";
import {
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaApple,
  FaGamepad,
  FaClock,
  FaHome,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaReddit,
  FaYoutube,
  FaRobot,
  FaCheckCircle,
  FaArrowUp,
  FaThumbsUp,
  FaUserAlt,
  FaBolt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sankofa_Display } from "next/font/google";
import Link from 'next/link';

const featuredReviews = [
  {
    title: "iPhone 15 Pro Max",
    icon: FaMobileAlt,
    score: 4.8,
    sources: 12,
    category: "Smartphones",
  },
  {
    title: "MacBook Pro M3",
    icon: FaApple,
    score: 4.7,
    sources: 9,
    category: "Laptops",
  },
  {
    title: "Sony WH-1000XM5",
    icon: FaHeadphones,
    score: 4.9,
    sources: 15,
    category: "Audio",
  },
];

const categories = [
  { name: "Smartphones", icon: FaMobileAlt },
  { name: "Laptops", icon: FaLaptop },
  { name: "Audio", icon: FaHeadphones },
  { name: "Gaming", icon: FaGamepad },
  { name: "Wearables", icon: FaClock },
  { name: "TVs", icon: FaApple },
];

interface HeroSectionProps {
  onSearch: (e: React.FormEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface SearchResultsProps {
  results: {
    product: string;
    redditReviews: Array<{
      reddit_title: string;
      reddit_content: string;
      reddit_upvotes: number;
      reddit_url: string;
    }>;
    youtubeReview?: Array<{
      video_title: string;
      video_id: string;
      channel_title: string;
    }>;
    geminiSummary?: Array<{
      opinion: string;
      specs: string;
      sentiment: string;
    }>;
  };
}

interface Recommendation {
  product: string;
  specs: string;
  reason: string;
}

type SectionType = "reddit" | "youtube" | "gemini";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.id) return;
      
      setIsLoadingRecommendations(true);
      try {
        const response = await fetch(`/api/recommend?userId=${encodeURIComponent(user.id)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    if (user?.id) {
      fetchRecommendations();
    }
  }, [user?.id]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !user?.id) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(
          searchQuery
        )}&userId=${encodeURIComponent(user.id)}`
      );
      const data = await response.json();
      setSearchResults(data?.review);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };
   

  const triggerSearch = async (query: string) => {
  if (!query.trim() || !user?.id) return;
  setSearchQuery(query);
  setIsSearching(true);
  try {
    const response = await fetch(
      `/api/search?query=${encodeURIComponent(query)}&userId=${encodeURIComponent(user.id)}`
    );
    const data = await response.json();
    setSearchResults(data?.review);
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    setIsSearching(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Checking session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <HeroSection
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {isSearching ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : searchResults ? (
          <SearchResults results={searchResults} />
        ) : null}
        <>
         <PersonalizedRecommendations 
  recommendations={recommendations}
  isLoading={isLoadingRecommendations}
  error={null}
  setSearchQuery={setSearchQuery}
  triggerSearch={triggerSearch}
/>

          <FeaturedReviews />
          <Categories />
          <LatestReviews />
        </>
      </main>
      <Footer />
    </div>
  );
}

function getIconForProduct(product: string) {
  const name = product.toLowerCase();
  if (name.includes("mobile") || name.includes("phone")) return FaMobileAlt;
  if (name.includes("laptop") || name.includes("notebook") || name.includes("macbook")) return FaLaptop;
  if (name.includes("headphone") || name.includes("earbud") || name.includes("audio")) return FaHeadphones;
  return FaGamepad;
}

function PersonalizedRecommendations({
  recommendations,
  isLoading,
  error,
  setSearchQuery,
  triggerSearch,
}: {
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  triggerSearch: (query: string) => void;
}) {
  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="container mx-auto px-6 text-center animate-pulse">
          <h3 className="text-5xl font-extrabold text-gray-800 mb-6">Your Recommendations</h3>
          <p className="text-xl text-gray-500 mb-8">Loading personalized magic just for you...</p>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-8 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-5xl font-extrabold text-gray-800 mb-6">Your Recommendations</h3>
          <p className="text-lg text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-300 shadow-lg"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (recommendations && recommendations.length > 0) {
    return (
      <section id="recommendations" className="py-24 bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-sm">
              ✨ Recommended For You
            </h3>
            <p className="text-xl text-gray-600">
              Crafted with AI based on your interests and search history
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {recommendations.map((recommendation, index) => {
              const Icon = getIconForProduct(recommendation.product);
              return (
                <div
                  key={index}
                  className="relative bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-gray-200 transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 hover:ring-2 hover:ring-purple-400 flex flex-col"
                >
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent hover:border-purple-400 transition pointer-events-none" />

                  {/* Top Section */}
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-purple-100 rounded-full mr-4 shadow-inner">
                      <Icon className="text-purple-600 text-3xl" />
                    </div>
                    <h4 className="text-2xl font-semibold text-gray-800">{recommendation.product}</h4>
                  </div>

                  {/* Growing Body Section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-4 pl-4 border-l-4 border-purple-300">
                      <p className="text-base text-gray-700 whitespace-pre-line">{recommendation.specs}</p>
                    </div>

                    <div className="flex items-start space-x-2 mb-6">
                      <FaThumbsUp className="text-green-500 mt-1" />
                      <p className="text-sm text-gray-700">{recommendation.reason}</p>
                    </div>
                  </div>

                  {/* Button Section - Always Bottom */}
                  <button
                    onClick={() => {
                      setSearchQuery(recommendation.product);
                      triggerSearch(recommendation.product);
                    }}
                    className="w-full py-2.5 mt-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-sm tracking-wide shadow-lg hover:brightness-110 transition duration-300"
                  >
                    🔍 Search It
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return null;
}

function Header() {
  const { user, loading, signOut } = useAuth();
  return (
    <header className="bg-gray-900 text-white py-4 px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">NovaFetch</h1>
        <nav className="flex space-x-6 items-center">
          <a href="#" className="hover:text-gray-300">
            <FaHome />
          </a>
          <a href="#featured" className="hover:text-gray-300">
            <FaApple />
          </a>
          <a href="#categories" className="hover:text-gray-300">
            <FaCog />
          </a>
          <a href="#latest" className="hover:text-gray-300">
            <FaGamepad />
          </a>
          <button
            onClick={signOut}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded hover:from-blue-600 hover:to-purple-700 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}

function HeroSection({
  onSearch,
  searchQuery,
  setSearchQuery,
}: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-16">
      <h2 className="text-4xl font-semibold mb-4">
        Tech Reviews You Can Trust
      </h2>
      <p className="text-xl mb-8">
        Get the latest and most reliable tech reviews from all the top sources.
      </p>
      <form onSubmit={onSearch} className="max-w-2xl mx-auto px-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a product..."
            className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}

function FeaturedReviews() {
  return (
    <section id="featured" className="py-24 bg-gray-100">
      <div className="text-center mb-16">
     <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
  Featured Reviews
</h3>



        <p className="text-lg text-gray-600">Check out our top reviews from the world of technology!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
        {featuredReviews?.map((review, index) => (
          <div
            key={index}
            className="bg-white shadow-xl rounded-3xl p-8 text-center transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 hover:ring-2 hover:ring-purple-400"
          >
            <div className="mb-4">
              <review.icon size={50} className="text-blue-600 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">{review.category}</p>
            <h4 className="text-2xl font-semibold mb-2 text-gray-800">{review.title}</h4>
            <div className="flex justify-center mb-4">
              <span className="text-primary font-medium">{review.score}/5</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {review.sources} sources
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="py-24 bg-gray-100">
      <div className="text-center mb-16">
     <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
  Categories
</h3>



        <p className="text-lg text-gray-600">Browse through different tech categories to find the right product for you!</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 px-8">
        {categories?.map((category, index) => (
          <Link href={`/${category.name.toLowerCase()}`} key={index}>
            <div className="cursor-pointer bg-white shadow-xl rounded-3xl p-8 text-center transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 hover:ring-2 hover:ring-teal-400">
             <category.icon className="text-6xl mb-4 text-blue-600 mx-auto" />
             <p className="text-sm text-gray-600">{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const latestReviews = [
  {
    title: "Samsung Galaxy S23 Ultra",
    excerpt:
      "The latest flagship from Samsung impresses with its camera capabilities and performance...",
    date: "May 1, 2024",
    sources: ["TechRadar", "CNET", "The Verge"],
    category: "Smartphones",
  },
  {
    title: "Dell XPS 13 (2024)",
    excerpt:
      "Dell's latest XPS 13 brings significant improvements to an already excellent ultrabook...",
    date: "April 28, 2024",
    sources: ["Wired", "Laptop Mag", "PCMag"],
    category: "Laptops",
  },
  {
    title: "PlayStation 5 Pro",
    excerpt:
      "Sony's mid-generation upgrade delivers on its promise of enhanced performance and visuals...",
    date: "April 25, 2024",
    sources: ["IGN", "Eurogamer", "GameSpot"],
    category: "Gaming",
  },
  {
    title: "Apple AirPods Pro 2",
    excerpt:
      "The second-generation AirPods Pro improve on noise cancellation and sound quality...",
    date: "April 22, 2024",
    sources: ["What Hi-Fi", "SoundGuys", "TechCrunch"],
    category: "Audio",
  },
];

function LatestReviews() {
  return (
    <section id="latest" className="py-24 bg-gradient-to-r from-indigo-50 via-purple-200 to-indigo-100">
      <div className="container mx-auto px-4">
       <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-12 text-center">
  Latest Reviews
</h2>

        <div className="grid md:grid-cols-2 gap-12">
          {latestReviews?.map((review, index) => (
            <div
              key={index}
              className="bg-white shadow-2xl rounded-3xl p-8 transition-all transform hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-purple-500 duration-300 ease-in-out"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm text-muted-foreground">{review.date}</span>
                <span className="text-sm text-gray-500">{review.category}</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{review.title}</h3>
              <p className="text-lg text-gray-600 mb-6">{review.excerpt}</p>
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-2">Sources:</span>
                <div className="flex flex-wrap gap-3">
                  {review?.sources?.map((source, i) => (
                    <span
                      key={i}
                      className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="#" className="text-indigo-600 hover:underline text-lg">
            View all reviews → 
          </a>
        </div>
      </div>
    </section>
  );
}



function SearchResults({ results }: SearchResultsProps) {
  console.log("Search Results:");
  console.log(results);
  const [expandedSections, setExpandedSections] = useState({
    reddit: false,
    youtube: false,
    gemini: false,
  });

  const toggleSection = (section: SectionType) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-r from-indigo-100 to-purple-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-12 text-center drop-shadow-lg">
          Search Results for{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            "{results.product}"
          </span>
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Reddit Summary Card */}
          <div className="relative bg-white shadow-xl rounded-3xl p-8 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 hover:ring-2 hover:ring-purple-400">
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent hover:border-purple-400 transition pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaReddit className="text-3xl text-red-500 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-800">Reddit Reviews</h3>
              </div>
              <span className="text-sm text-gray-500">{results.redditReviews?.length} reviews</span>
            </div>
            <p className="text-gray-600 mb-4">
              Community insights and discussions from Reddit
            </p>
            <button
              onClick={() => toggleSection("reddit")}
              className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              {expandedSections.reddit ? (
                <>
                  <span>Show Less</span>
                  <FaChevronUp />
                </>
              ) : (
                <>
                  <span>Show Reviews</span>
                  <FaChevronDown />
                </>
              )}
            </button>
          </div>

          {/* YouTube Summary Card */}
          <div className="relative bg-white shadow-xl rounded-3xl p-8 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 hover:ring-2 hover:ring-purple-400">
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent hover:border-purple-400 transition pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaYoutube className="text-3xl text-red-600 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-800">YouTube Review</h3>
              </div>
              <span className="text-sm text-gray-500">1 video</span>
            </div>
            <p className="text-gray-600 mb-4">Video review and analysis</p>
            <button
              onClick={() => toggleSection("youtube")}
              className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              {expandedSections.youtube ? (
                <>
                  <span>Show Less</span>
                  <FaChevronUp />
                </>
              ) : (
                <>
                  <span>Show Video</span>
                  <FaChevronDown />
                </>
              )}
            </button>
          </div>

          {/* Gemini Summary Card */}
          <div className="relative bg-white shadow-xl rounded-3xl p-8 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 hover:ring-2 hover:ring-purple-400">
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent hover:border-purple-400 transition pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaRobot className="text-3xl text-blue-500 mr-4" />
                <h3 className="text-2xl font-semibold text-gray-800">AI Analysis</h3>
              </div>
              <span className="text-sm text-gray-500">AI-powered insights</span>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive analysis and recommendations
            </p>
            <button
              onClick={() => toggleSection("gemini")}
              className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              {expandedSections.gemini ? (
                <>
                  <span>Show Less</span>
                  <FaChevronUp />
                </>
              ) : (
                <>
                  <span>Show Analysis</span>
                  <FaChevronDown />
                </>
              )}
            </button>
          </div>
        </div>
      

        {/* Expanded Sections */}
        <div className="space-y-8">
          {/* Reddit Reviews */}
          {expandedSections.reddit && (
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <h3 className="text-3xl font-bold mb-8 flex justify-center items-center text-red-500">
                <FaReddit className="text-4xl mr-3" />
                Reddit Reviews
              </h3>

              <div className="grid gap-6">
                {results?.redditReviews?.map(
                  (
                    review: SearchResultsProps["results"]["redditReviews"][0],
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="bg-gray-50 hover:bg-white transition-all duration-200 border border-gray-200 rounded-xl p-5 shadow-sm"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {review.reddit_title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-1">
                        {review.reddit_content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center space-x-1 italic">
                          <FaArrowUp className="text-red-400" />
                          <span>Upvotes: {review.reddit_upvotes}</span>
                        </span>
                        <a
                          href={review.reddit_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View on Reddit
                        </a>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* YouTube Video */}
          {expandedSections.youtube && results.youtubeReview?.[0] && (
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 flex justify-center items-center text-red-600">
                <FaYoutube className="text-3xl mr-3" />
                YouTube Review
              </h3>

              <div className="mb-6 rounded-xl overflow-hidden shadow-md border border-gray-200">
                <div className="h-96 w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${results?.youtubeReview?.[0]?.video_id}`}
                    title="YouTube Video Review"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-3 md:mb-0">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {results?.youtubeReview?.[0]?.channel_title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {results.youtubeReview?.[0].video_title}
                  </p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${results.youtubeReview?.[0]?.video_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          )}

          {/* Gemini Summary */}
          {expandedSections.gemini && results.geminiSummary?.[0] && (
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <h3 className="text-3xl font-bold mb-8 flex justify-center items-center text-blue-600">
                <FaRobot className="text-4xl mr-3" />
                AI Analysis
              </h3>

              <div className="text-gray-700 text-lg leading-relaxed mb-10">
                {results.geminiSummary[0].opinion}
              </div>

              {results.geminiSummary[0].specs && (
                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-6 shadow-inner">
                  <div className="flex items-center mb-5">
                    <FaCheckCircle className="text-green-500 text-xl mr-2" />
                    <h4 className="text-xl font-semibold text-green-700">
                      Key Specifications
                    </h4>
                  </div>
                  <ul className="space-y-3 pl-4">
                    {results.geminiSummary[0].specs
                      .split("\n")
                      .map((spec: string, index: number) => (
                        <li
                          key={index}
                          className="relative pl-6 text-gray-800 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:rounded-full before:bg-green-500"
                        >
                          {spec}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-8">
      <div className="flex justify-between items-center">
        <p>&copy; 2025 NovaFetch. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-400">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-400">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-400">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}