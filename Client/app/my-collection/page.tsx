"use client";

import { NavBar } from "../../components/nav-bar";
import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <NavBar />
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Collectin Page</h1>
          <p className="text-xl md:text-2xl mb-8">
            Page will show your own collection.
          </p>
          <p className="inline-block bg-white text-blue-700 px-6 py-2 font-semibold rounded">
            To Be Implemented
          </p>
        </div>
      </section>

    
    </main>
  );
}
