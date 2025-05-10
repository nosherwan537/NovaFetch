"use client";
import { FaTv, FaDesktop } from "react-icons/fa";
import Link from 'next/link';

const featuredReviews = [
  {
    title: "Samsung QLED 8K",
    icon: FaTv,
    score: 4.8,
    sources: 18,
    category: "TVs",
  },
  {
    title: "LG OLED 65 inch",
    icon: FaTv,
    score: 4.9,
    sources: 22,
    category: "TVs",
  },
  {
    title: "Sony Bravia XR",
    icon: FaDesktop,
    score: 4.7,
    sources: 14,
    category: "TVs",
  },
];

export default function TVsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-gray-900 text-white py-4 px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">NovaFetch</h1>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
          <h2 className="text-4xl font-semibold mb-4">TV Reviews</h2>
          <p className="text-xl mb-8">Discover the latest and best TVs on the market in 2025!</p>
        </section>

        <section id="featured" className="py-24 bg-gray-100">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
              Featured TV Reviews
            </h3>
            <p className="text-lg text-gray-600">Find out the top-rated TVs that offer incredible picture and sound quality!</p>
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
