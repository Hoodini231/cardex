"use client"

import { useState } from "react"
import { CollectionHorizontalBar } from "@/components/collection-horizontal-bar"
import { NavBar } from "@/components/nav-bar"
import { FilterBar } from "@/components/filter-bar"
import { PokemonCardGrid } from "@/components/pokemon-card-grid"
import '@/app/globals.css';

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [filterOptions, setFilterOptions] = useState({
    rarity: "",
    showOnlyChase: false,
    priceRange: [0, 500],
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar onSearch={setSearchQuery} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Collections</h1>
        <FilterBar onSort={setSortBy} onFilter={setFilterOptions} onSearch={setSearchQuery} />
        <PokemonCardGrid searchQuery={searchQuery} sortBy={sortBy} filterOptions={filterOptions} />
      </main>
    </div>
  )
}

