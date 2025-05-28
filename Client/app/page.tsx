"use client"

import type React from "react"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import HomePageCard from "../components/homepageCard"
import HeroCarousel from "../components/heroCarousell"
import MarketHighlights from "../components/trendsComponent"
import { Calculator, TrendingUp, Grid, Heart, ChevronRight, ChevronLeft, Grid3X3 } from "lucide-react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  const features = [
    {
      title: "Collections",
      description: "Browse all Pokémon card sets from every generation",
      icon: Grid3X3,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      navLink: "/collections",
    },
    {
      title: "ROI Calculator",
      description: "Calculate potential returns on your card investments",
      icon: Calculator,
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
      navLink: "/roi-calculator",
    },
    {
      title: "Market Trends",
      description: "Track price trends and market movements",
      icon: TrendingUp,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      navLink: "/market-watch",
    },
    {
      title: "My Collection",
      description: "Manage and track your personal card collection",
      icon: Heart,
      color: "bg-rose-500",
      hoverColor: "hover:bg-rose-600",
      navLink: "/wishlist",
    },
  ]

  // Featured sets for carousel
  const featuredSets = [
    {
      id: "collections",
      badgeInfo: "Core Feature",
      name: "View Collections",
      description: "Easily explore and access all Pokémon card sets from every generation with price insights.",
      image: "./collections_display.png",
      color: "from-blue-500 to-purple-600",
      subcard: [['18k+', 'Cards Tracked'], ['260+', 'Sets Available']]
    },
    {
      id: "roi",
      badgeInfo: "In Beta",
      name: "ROI Calculator",
      description: "Leverage new tools to assist in your purchase decisions.",
      image: "./roi_display.png",
      color: "from-indigo-600 to-blue-400",
      subcard: [['18k+', 'Cards Tracked'], ['260+', 'Sets Available']]
    },
    {
      id: "ai-assistant",
      name: "AI Collection assistant",
      badgeInfo: "In Beta",
      description: "Currently in development, our AI assistant will help you find new cards for your collection.",
      image: "./Pokemon_Collector_display.png",
      color: "from-yellow-400 to-red-500",
      subcard: [['18k+', 'Cards Tracked'], ['260+', 'Sets Available']],
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar onSearch={setSearchQuery} />
      <section>
        <HeroCarousel featuredSets={featuredSets} />
      </section>

      {/* Feature Cards */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Explore PokéCardEX</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and insights for Pokémon card collectors and investors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              return (
                <HomePageCard key={index} feature={feature}>
                </HomePageCard>
              )
            })}
          </div>
        </div>
      </section>
      <section className="py-16 lg:py-24 bg-gray-50">
        <MarketHighlights/>
      </section>
    </div>
  )
}

