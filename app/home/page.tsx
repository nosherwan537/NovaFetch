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
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

type SectionType = "reddit" | "youtube" | "gemini";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`
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
          <FeaturedReviews />
          <Categories />
          <LatestReviews />
        </>
      </main>
      <Footer />
    </div>
  );
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
    <section id="featured" className="py-16 bg-gray-100">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-semibold">Featured Reviews</h3>
        <p className="text-lg text-gray-600">
          Check out our top reviews from the world of technology!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        {featuredReviews?.map((review, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-12 text-center"
          >
            <div className="mb-4">
              <review.icon size={50} className="text-blue-600 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">{review.category}</p>
            <h4 className="text-xl font-semibold mb-2">{review.title}</h4>
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
    <section id="categories" className="py-16 bg-gray-200">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-semibold">Categories</h3>
        <p className="text-lg text-gray-600">
          Browse through different tech categories to find the right product for
          you!
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 px-8">
        {categories?.map((category, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-12 text-center"
          >
            <category.icon className="text-6xl mb-4 text-blue-600 mx-auto" />
            <p className="text-sm text-gray-600">{category.name}</p>
          </div>
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
    <section id="latest" className="py-16">
      <div className="container mx-auto px-4 z">
        <h2 className="text-2xl font-bold mb-8">Latest Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {latestReviews?.map((review, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{review.title}</h3>
              <p className="text-muted-foreground mb-4">{review.excerpt}</p>
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-1">Sources:</span>
                <div className="flex flex-wrap gap-2">
                  {review?.sources?.map((source, i) => (
                    <span
                      key={i}
                      className="text-sm bg-muted px-2 py-1 rounded"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-primary hover:underline">
            View all reviews →
          </a>
        </div>
      </div>
    </section>
  );
}

function SearchResults({ results }: SearchResultsProps) {
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
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8">
          Search Results for "{results.product}"
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Reddit Summary Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaReddit className="text-2xl text-red-500 mr-3" />
                <h3 className="text-xl font-semibold">Reddit Reviews</h3>
              </div>
              <span className="text-sm text-gray-500">
                {results.redditReviews?.length} reviews
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Community insights and discussions from Reddit
            </p>
            <button
              onClick={() => toggleSection("reddit")}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
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
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaYoutube className="text-2xl text-red-600 mr-3" />
                <h3 className="text-xl font-semibold">YouTube Review</h3>
              </div>
              <span className="text-sm text-gray-500">1 video</span>
            </div>
            <p className="text-gray-600 mb-4">Video review and analysis</p>
            <button
              onClick={() => toggleSection("youtube")}
              className="mt-auto w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
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
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaRobot className="text-2xl text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold">AI Analysis</h3>
              </div>
              <span className="text-sm text-gray-500">AI-powered insights</span>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive analysis and recommendations
            </p>
            <button
              onClick={() => toggleSection("gemini")}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
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
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
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
