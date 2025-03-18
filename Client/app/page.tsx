"use client"

import { useState } from "react"
import { PokemonCardGrid } from "@/components/pokemon-card-grid"
import { NavBar } from "@/components/nav-bar"
import { FilterBar } from "@/components/filter-bar"
import './globals.css'
import { CollectionHorizontalBar } from "@/components/collection-horizontal-bar"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [chosenSet, setChosenSet] = useState("Prismatic Evolutions")
  const [filterOptions, setFilterOptions] = useState({
    rarity: "",
    showOnlyChase: false,
    priceRange: [0, 500],
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar onSearch={setSearchQuery} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Pokémon Card Collection</h1>
        <CollectionHorizontalBar onChosenSet={setChosenSet} />
        <FilterBar onSort={setSortBy} onFilter={setFilterOptions} onSearch={setSearchQuery}/>
        <PokemonCardGrid searchQuery={searchQuery} sortBy={sortBy} filterOptions={filterOptions} chosenSet={chosenSet} />
      </main>
    </div>
  )
}

