import { FaMobileAlt, FaLaptop, FaHeadphones, FaApple, FaGamepad, FaClock, FaHome, FaCog } from 'react-icons/fa';
import Image from 'next/image';

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
    icon: FaApple ,
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

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedReviews />
        <Categories />
        <LatestReviews />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">NovaFetch</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-gray-300"><FaHome /></a></li>
            <li><a href="#featured" className="hover:text-gray-300"><FaApple /></a></li>
            <li><a href="#categories" className="hover:text-gray-300"><FaCog /></a></li>
            <li><a href="#latest" className="hover:text-gray-300"><FaGamepad /></a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-16">
      <h2 className="text-4xl font-semibold mb-4">Tech Reviews You Can Trust</h2>
      <p className="text-xl mb-8">Get the latest and most reliable tech reviews from all the top sources.</p>
      <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200">Get Started</button>
    </section>
  );
}

function FeaturedReviews() {
  return (
    <section id="featured" className="py-16 bg-gray-100">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-semibold">Featured Reviews</h3>
        <p className="text-lg text-gray-600">Check out our top reviews from the world of technology!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        {featuredReviews.map((review, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-12 text-center">
            <div className="mb-4">
              <review.icon size={50} className="text-blue-600 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">{review.category}</p>
            <h4 className="text-xl font-semibold mb-2">{review.title}</h4>
            <div className="flex justify-center mb-4">
              <span className="text-primary font-medium">{review.score}/5</span>
            </div>
            <p className="text-sm text-muted-foreground">Based on {review.sources} sources</p>
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
        <p className="text-lg text-gray-600">Browse through different tech categories to find the right product for you!</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 px-8">
        {categories.map((category, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-12 text-center">
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
    excerpt: "The latest flagship from Samsung impresses with its camera capabilities and performance...",
    date: "May 1, 2024",
    sources: ["TechRadar", "CNET", "The Verge"],
    category: "Smartphones",
  },
  {
    title: "Dell XPS 13 (2024)",
    excerpt: "Dell's latest XPS 13 brings significant improvements to an already excellent ultrabook...",
    date: "April 28, 2024",
    sources: ["Wired", "Laptop Mag", "PCMag"],
    category: "Laptops",
  },
  {
    title: "PlayStation 5 Pro",
    excerpt: "Sony's mid-generation upgrade delivers on its promise of enhanced performance and visuals...",
    date: "April 25, 2024",
    sources: ["IGN", "Eurogamer", "GameSpot"],
    category: "Gaming",
  },
  {
    title: "Apple AirPods Pro 2",
    excerpt: "The second-generation AirPods Pro improve on noise cancellation and sound quality...",
    date: "April 22, 2024",
    sources: ["What Hi-Fi", "SoundGuys", "TechCrunch"],
    category: "Audio",
  },
];

function LatestReviews() {
  return (
    <section id="latest" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Latest Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {latestReviews.map((review, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{review.title}</h3>
              <p className="text-muted-foreground mb-4">{review.excerpt}</p>
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-1">Sources:</span>
                <div className="flex flex-wrap gap-2">
                  {review.sources.map((source, i) => (
                    <span key={i} className="text-sm bg-muted px-2 py-1 rounded">
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

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-8">
      <div className="flex justify-between items-center">
        <p>&copy; 2025 TechReviews. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400">Terms of Service</a>
          <a href="#" className="hover:text-gray-400">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
