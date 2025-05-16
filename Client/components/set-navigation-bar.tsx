"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import axios from "axios"
import React from "react"

interface SetCollection {
  id: string
  name: string
  icon: string
  created: string
  subcollections?: {
    id: string
    name: string
    icon: string
  }[]
}

const Collections: SetCollection[] = [
  {
    id: "scarlet-violet",
    name: "Scarlet & Violet",
    icon: "SVE",
    created: "2023-01-01",
    subcollections: [
      { id: "prismatic", name: "Prismatic Evolutions", icon: "PRE" },
      { id: "surging-sparks", name: "Surging Sparks", icon: "SSP" },
      { id: "stellar-crown", name: "Stellar Crown", icon: "SCR" },
      { id: "shrouded-fable", name: "Shrouded Fable", icon: "SFA" },
      { id: "twilight-masquerade", name: "Twilight Masquerade", icon: "TWM" },
      { id: "temporal-forces", name: "Temporal Forces", icon: "TEF" },
      { id: "paldean-fates", name: "Paldean Fates", icon: "PAF" },
      { id: "paradox-rift", name: "Paradox Rift", icon: "PAR" },
      { id: "151", name: "151", icon: "151" },
      { id: "obsidian-flames", name: "Obsidian Flames", icon: "OBF" },
      { id: "paldea-evolved", name: "Paldea Evolved", icon: "PAL" },
      { id: "scarlet-violet-base", name: "Scarlet & Violet", icon: "SVE" },
    ],
  },
  {
    id: "sword-shield",
    name: "Sword & Shield",
    icon: "SWS",
    created: "2022-01-01",
    subcollections: [
      { id: "crown-zenith", name: "Crown Zenith", icon: "CRZ" },
      { id: "silver-tempest", name: "Silver Tempest", icon: "SIT" },
      { id: "lost-origin", name: "Lost Origin", icon: "LOR" },
      { id: "pokemon-go", name: "Pokémon GO", icon: "PGO" },
    ],
  },
  {
    id: "sun-moon",
    name: "Sun & Moon",
    icon: "SNM",
    created: "2021-01-01",
    subcollections: [
      { id: "cosmic-eclipse", name: "Cosmic Eclipse", icon: "CEC" },
      { id: "unified-minds", name: "Unified Minds", icon: "UNM" },
      { id: "unbroken-bonds", name: "Unbroken Bonds", icon: "UNB" },
      { id: "team-up", name: "Team Up", icon: "TEU" },
    ],
  },
  {
    id: "xy",
    name: "XY",
    icon: "XY",
    created: "2020-01-01",
    subcollections: [
      { id: "evolutions", name: "Evolutions", icon: "EVO" },
      { id: "steam-siege", name: "Steam Siege", icon: "STS" },
      { id: "fates-collide", name: "Fates Collide", icon: "FCO" },
      { id: "breakpoint", name: "BREAKpoint", icon: "BKP" },
    ],
  },
  {
    id: "black-white",
    name: "Black & White",
    icon: "BNW",
    created: "2019-01-01",
    subcollections: [
      { id: "legendary-treasures", name: "Legendary Treasures", icon: "LTR" },
      { id: "plasma-blast", name: "Plasma Blast", icon: "PLB" },
      { id: "plasma-freeze", name: "Plasma Freeze", icon: "PLF" },
      { id: "plasma-storm", name: "Plasma Storm", icon: "PLS" },
    ],
  },
]

export function SetNavigationBar() {
  const [selectedSet, setSelectedSet] = useState<string | null>(null)
  const [collections, setCollections] = useState<SetCollection[]>(Collections)

  const fetchSets = async () => {
    try {
      const response = await axios.get("http://localhost:5001/get/gens")
      const sortedCollections = response.data.sort((a: SetCollection, b: SetCollection) => 
        new Date(b.created).getTime() - new Date(a.created).getTime()
      )
      setCollections(sortedCollections)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSets()
    
  }, [])

  useEffect(() => {
    console.log("updated")
  }, [collections])

  return (
    <div className="w-full bg-gray-50 border-y">
      <div className="container mx-auto overflow-x-auto">
        <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
          <div className="flex items-center gap-1 p-2">
            {collections.map((collection) => (
              <DropdownMenu key={collection.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 px-3 py-2 ${
                      selectedSet === collection.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => setSelectedSet(selectedSet === collection.id ? null : collection.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-6 h-6 text-xs font-medium">
                        tbc
                      </span>
                      {collection.name}
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px] max-h-[400px] overflow-auto">
                  {collection.subcollections?.map((sub) => (
                    <DropdownMenuItem key={sub.id} className="flex items-center gap-2 py-2">
                      <span className="inline-flex items-center justify-center bg-gray-200 text-gray-700 rounded px-1.5 py-0.5 text-xs font-medium min-w-[40px]">
                        {sub.id}
                      </span>
                      {sub.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}