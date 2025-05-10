"use client";
import Link from 'next/link';

import { FaLaptop, FaApple, FaWindows, FaKeyboard } from "react-icons/fa";

const featuredReviews = [
  {
    title: "MacBook Pro 16-inch (2023)",
    icon: FaApple,
    score: 4.9,
    sources: 15,
    category: "Laptops",
  },
  {
    title: "Dell XPS 15",
    icon: FaLaptop,
    score: 4.8,
    sources: 12,
    category: "Laptops",
  },
  {
    title: "Lenovo ThinkPad X1 Carbon",
    icon: FaKeyboard,
    score: 4.7,
    sources: 10,
    category: "Laptops",
  },
  {
    title: "HP Spectre x360",
    icon: FaWindows,
    score: 4.6,
    sources: 11,
    category: "Laptops",
  },
  {
    title: "Asus ROG Zephyrus G14",
    icon: FaLaptop,
    score: 4.5,
    sources: 13,
    category: "Laptops",
  },
  {
    title: "Acer Swift X",
    icon: FaLaptop,
    score: 4.4,
    sources: 9,
    category: "Laptops",
  },
  {
    title: "Microsoft Surface Laptop 5",
    icon: FaWindows,
    score: 4.3,
    sources: 10,
    category: "Laptops",
  },
  {
    title: "Razer Blade 15",
    icon: FaLaptop,
    score: 4.6,
    sources: 12,
    category: "Laptops",
  },
  {
    title: "LG Gram 17",
    icon: FaLaptop,
    score: 4.2,
    sources: 8,
    category: "Laptops",
  },
];

export default function LaptopsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-gray-900 text-white py-4 px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">NovaFetch</h1>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
          <h2 className="text-4xl font-semibold mb-4">Laptop Reviews</h2>
          <p className="text-xl mb-8">Find the best laptops for your needs!</p>
        </section>

        <section id="featured" className="py-24 bg-gray-100">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
              Featured Laptop Reviews
            </h3>
            <p className="text-lg text-gray-600">Explore our top picks for the latest laptops!</p>
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
