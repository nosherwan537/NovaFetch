"use client";
import { FaHeadphones, FaVolumeUp, FaMusic } from "react-icons/fa";
import Link from 'next/link';

const featuredReviews = [
  {
    title: "Sony WH-1000XM5",
    icon: FaHeadphones,
    score: 4.9,
    sources: 18,
    category: "Audio",
  },
  {
    title: "Bose QuietComfort 45",
    icon: FaHeadphones,
    score: 4.8,
    sources: 14,
    category: "Audio",
  },
  {
    title: "Apple AirPods Max",
    icon: FaHeadphones,
    score: 4.7,
    sources: 10,
    category: "Audio",
  },
  {
    title: "Sennheiser Momentum 4",
    icon: FaHeadphones,
    score: 4.6,
    sources: 12,
    category: "Audio",
  },
  {
    title: "Jabra Elite 85h",
    icon: FaHeadphones,
    score: 4.5,
    sources: 9,
    category: "Audio",
  },
  {
    title: "Anker Soundcore Life Q35",
    icon: FaHeadphones,
    score: 4.4,
    sources: 11,
    category: "Audio",
  },
  {
    title: "Beats Studio Pro",
    icon: FaHeadphones,
    score: 4.3,
    sources: 8,
    category: "Audio",
  },
  {
    title: "Bowers & Wilkins PX7 S2",
    icon: FaHeadphones,
    score: 4.6,
    sources: 10,
    category: "Audio",
  },
  {
    title: "Sony WF-1000XM5",
    icon: FaHeadphones,
    score: 4.5,
    sources: 13,
    category: "Audio",
  },
  {
    title: "Bose SoundSport Free",
    icon: FaHeadphones,
    score: 4.2,
    sources: 7,
    category: "Audio",
  },
  {
    title: "Samsung Galaxy Buds 2 Pro",
    icon: FaHeadphones,
    score: 4.3,
    sources: 9,
    category: "Audio",
  },
  {
    title: "Nothing Ear (2)",
    icon: FaHeadphones,
    score: 4.1,
    sources: 6,
    category: "Audio",
  },
];

export default function AudioPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-gray-900 text-white py-4 px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">NovaFetch</h1>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
          <h2 className="text-4xl font-semibold mb-4">Audio Reviews</h2>
          <p className="text-xl mb-8">Discover the best audio equipment for all your needs!</p>
        </section>

        <section id="featured" className="py-24 bg-gray-100">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
              Featured Audio Reviews
            </h3>
            <p className="text-lg text-gray-600">Check out our top-rated audio gear for 2025!</p>
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
