"use client"

import React, { use } from "react"

import useSWR from 'swr';
import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, ChevronDown, Star } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import '@/app/globals.css';

export function FilterBar({
  onSort,
  onFilter,
  onSearch,
  chosenSet,
}: {
  onSort?: (sortBy: string) => void
  onFilter?: (filters: any) => void
  onSearch?: (query: string) => void
  chosenSet?: string;
}) {
  const [showFilters, setShowFilters] = useState(false)
  const [chaseRarity, setChaseRarity] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [raritySet, setRaritySet] = useState(["Loading..."])
  const [searchQuery, setSearchQuery] = useState("")

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: rarityValues, error: rarityError } = useSWR(
    `http://127.0.0.1:8000/get/set/rarities/${chosenSet}`,
    fetcher
  );

  // Update parent component when filters change
  useEffect(() => {
    onFilter?.({
      rarity: selectedRarity === "all" ? "" : selectedRarity,
      showOnlyChase: chaseRarity,
      priceRange: priceRange,
    })
  }, [selectedRarity, chaseRarity, priceRange, onFilter])



  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    const timeoutId = setTimeout(() => {
      onSearch?.(query)
    }, 300)
    return () => clearTimeout(timeoutId)
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col top-4 md:flex-row justify-between items-start md:items-center gap-4 mb-4 mt-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search a card"
            className="pl-10 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex top-[4px] flex-wrap gap-2 w-full md:w-auto">
          <SortFilter onSort={onSort} />
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-sm mb-4">
          <div className="space-y-3">
            <Label>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Label>
            <Slider
              defaultValue={[0, 500]}
              max={500}
              step={5}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="chase-rarity" checked={chaseRarity} onCheckedChange={setChaseRarity} />
            <Label htmlFor="chase-rarity" className="flex items-center gap-2">
              Chase Rarity
              <Star className="h-4 w-4 text-yellow-500" />
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="my-chases" />
            <Label htmlFor="my-chases" className="flex items-center gap-2">
              Show Only My Chases
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            </Label>
          </div>
        </div>
      )}

      {/* <SetNavigationBar /> */}

      <div className="flex flex-wrap gap-2 mt-4">
        {/* "SEE ALL" button */}
        <FilterButton
          label="SEE ALL"
          active={selectedRarity === "all"}
          onClick={() => setSelectedRarity("all")}
        />
        {rarityError && <div>Error loading rarities</div>}
        {/* Render a FilterButton for each fetched rarity */}
        {rarityValues &&
          rarityValues.map((rarity: string) => (
            <FilterButton
              key={rarity}
              label={rarity}
              active={selectedRarity === rarity}
              onClick={() => setSelectedRarity(rarity)}
            />
          ))}
      </div>
    </div>
  )
}


function SortFilter({ onSort }: { onSort?: (sortBy: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Sort By
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort?.("name-asc")}>Name (A-Z)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort?.("name-desc")}>Name (Z-A)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort?.("price-asc")}>Price (Low to High)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort?.("price-desc")}>Price (High to Low)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort?.("rarity")}>Rarity</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function FilterButton({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "default" : "outline"}
      className={`text-xs font-medium ${
        active
          ? "bg-primary text-primary-foreground"
          : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
      }`}
    >
      {label}
    </Button>
  );
}