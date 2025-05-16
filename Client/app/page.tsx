"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PokemonCardGrid } from "../components/PokemonCard/pokemon-card-grid"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, Grid, Heart, ChevronRight, ChevronLeft, Star, BarChart2, Search } from "lucide-react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  // Featured sets for carousel
  const featuredSets = [
    {
      id: "collections",
      name: "View Collections",
      description: "Easily explore and access all Pokémon card sets from every generation with price insights.",
      image: "./collections_display.png",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "roi",
      name: "ROI Calculator",
      description: "Leverage new tools to assist in your purchase decisions.",
      image: "./roi_display.png",
      color: "from-indigo-600 to-blue-400",
    },
    {
      id: "ai-assistant",
      name: "AI Collection assistant",
      description: "Currently in development, our AI assistant will help you find new cards for your collection.",
      image: "./Pokemon_Collector_display.png",
      color: "from-yellow-400 to-red-500",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredSets.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredSets.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar onSearch={setSearchQuery} />

      {/* Hero Carousel */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredSets.map((set, index) => (
            <div key={set.id} className="w-full flex-shrink-0">
              <div className={`relative h-[400px] md:h-[500px] w-full bg-gradient-to-r ${set.color}`}>
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 text-white z-10 mb-8 md:mb-0">
                      <h1 className="text-3xl md:text-5xl font-bold mb-4">{set.name}</h1>
                      <p className="text-lg md:text-xl mb-6">{set.description}</p>
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                        Explore Set
                      </Button>
                    </div>
                    <div className="md:w-1/2 relative h-[250px] md:h-[400px] w-full">
                      <Image
                        src={set.image || "/placeholder.svg"}
                        alt={set.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredSets.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Explore PokéCardEX</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Collections"
            description="Browse all Pokémon card sets from every generation"
            icon={<Grid className="h-8 w-8" />}
            href="/collections"
            color="bg-gradient-to-br from-blue-500 to-blue-700"
          />

          <FeatureCard
            title="ROI Calculator"
            description="Calculate potential returns on your card investments"
            icon={<Calculator className="h-8 w-8" />}
            href="/roi-calculator"
            color="bg-gradient-to-br from-green-500 to-green-700"
          />

          <FeatureCard
            title="Market Trends"
            description="Track price trends and market movements"
            icon={<TrendingUp className="h-8 w-8" />}
            href="/market-trends"
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />

          <FeatureCard
            title="My Collection"
            description="Manage and track your personal card collection"
            icon={<Heart className="h-8 w-8" />}
            href="/my-collection"
            color="bg-gradient-to-br from-red-500 to-red-700"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className={`${color} text-white rounded-t-lg`}>
          <div className="flex justify-between items-center">
            <CardTitle>{title}</CardTitle>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-between">
            Explore <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
