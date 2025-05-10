"use client";
import { FaGamepad, FaTrophy } from "react-icons/fa";
import Link from 'next/link';

const featuredReviews = [
  {
    title: "PlayStation 5",
    icon: FaGamepad,
    score: 4.9,
    sources: 20,
    category: "Gaming",
  },
  {
    title: "Xbox Series X",
    icon: FaGamepad,
    score: 4.8,
    sources: 15,
    category: "Gaming",
  },
  {
    title: "Nintendo Switch OLED",
    icon: FaGamepad,
    score: 4.7,
    sources: 12,
    category: "Gaming",
  },
  {
    title: "Steam Deck",
    icon: FaGamepad,
    score: 4.6,
    sources: 14,
    category: "Gaming",
  },
  {
    title: "ASUS ROG Ally",
    icon: FaGamepad,
    score: 4.5,
    sources: 10,
    category: "Gaming",
  },
  {
    title: "Xbox Series S",
    icon: FaGamepad,
    score: 4.4,
    sources: 11,
    category: "Gaming",
  },
  {
    title: "Logitech G Cloud",
    icon: FaGamepad,
    score: 4.1,
    sources: 8,
    category: "Gaming",
  },
  {
    title: "Alienware Aurora R13",
    icon: FaGamepad,
    score: 4.6,
    sources: 9,
    category: "Gaming",
  },
  {
    title: "Razer Blade 16",
    icon: FaGamepad,
    score: 4.7,
    sources: 13,
    category: "Gaming",
  },
  {
    title: "MSI GE76 Raider",
    icon: FaGamepad,
    score: 4.5,
    sources: 10,
    category: "Gaming",
  },
  {
    title: "Nintendo Switch Lite",
    icon: FaGamepad,
    score: 4.3,
    sources: 9,
    category: "Gaming",
  },
  {
    title: "Sony DualSense Edge",
    icon: FaGamepad,
    score: 4.4,
    sources: 7,
    category: "Gaming",
  },
  {
    title: "Valve Index VR Kit",
    icon: FaGamepad,
    score: 4.6,
    sources: 11,
    category: "Gaming",
  },
  {
    title: "Meta Quest 3",
    icon: FaGamepad,
    score: 4.5,
    sources: 12,
    category: "Gaming",
  },
  {
    title: "HP Omen 45L",
    icon: FaGamepad,
    score: 4.4,
    sources: 10,
    category: "Gaming",
  },
];

export default function GamingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-gray-900 text-white py-4 px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">NovaFetch</h1>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
          <h2 className="text-4xl font-semibold mb-4">Gaming Reviews</h2>
          <p className="text-xl mb-8">Explore the latest and greatest in gaming consoles and accessories!</p>
        </section>

        <section id="featured" className="py-24 bg-gray-100">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
              Featured Gaming Reviews
            </h3>
            <p className="text-lg text-gray-600">Discover the best gaming consoles and accessories of 2025!</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
            {featuredReviews.map((review, index) => (
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
      </main>

      <footer className="bg-gray-900 text-white py-4 px-8 text-center">
        <p>&copy; 2025 NovaFetch</p>
      </footer>
    </div>
  );
}
