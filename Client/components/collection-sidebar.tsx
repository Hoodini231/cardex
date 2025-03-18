"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface Collection {
  id: string
  name: string
  icon: string
  subcollections?: Collection[]
}

const collections: Collection[] = [
  {
    id: "scarlet-violet",
    name: "Scarlet & Violet",
    icon: "SVE",
    subcollections: [
      { id: "prismatic", name: "Prismatic Evolutions", icon: "PRE" },
      { id: "surging-sparks", name: "Surging Sparks", icon: "SSP" },
      { id: "stellar-crown", name: "Stellar Crown", icon: "SCR" },
      { id: "shrouded-fable", name: "Shrouded Fable", icon: "SFA" },
    ],
  },
  {
    id: "sword-shield",
    name: "Sword & Shield",
    icon: "SWS",
  },
  {
    id: "sun-moon",
    name: "Sun & Moon",
    icon: "SNM",
  },
  {
    id: "xy",
    name: "XY",
    icon: "XY",
  },
  {
    id: "black-white",
    name: "Black & White",
    icon: "BNW",
  },
]

export function CollectionSidebar() {
  const [expandedCollections, setExpandedCollections] = useState<string[]>([])

  const toggleCollection = (id: string) => {
    setExpandedCollections((prev) =>
      prev.includes(id) ? prev.filter((collectionId) => collectionId !== id) : [...prev, id],
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="p-4 space-y-2">
        {collections.map((collection) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            isExpanded={expandedCollections.includes(collection.id)}
            onToggle={() => toggleCollection(collection.id)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

function CollectionItem({
  collection,
  isExpanded,
  onToggle,
}: {
  collection: Collection
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <Button variant="ghost" className="w-full justify-start px-2 py-1 h-auto" onClick={onToggle}>
        <div className="flex items-center gap-2">
          {collection.subcollections ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="w-4" />
          )}
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center justify-center bg-gray-200 text-gray-700 rounded px-1.5 py-0.5 text-xs font-medium">
              {collection.icon}
            </span>
            {collection.name}
          </div>
        </div>
      </Button>

      {isExpanded && collection.subcollections && (
        <div className="ml-6 mt-1 space-y-1">
          {collection.subcollections.map((subcollection) => (
            <Link
              key={subcollection.id}
              href={`/collections/${subcollection.id}`}
              className="flex items-center gap-3 px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
            >
              <span className="inline-flex items-center justify-center bg-gray-200 text-gray-700 rounded px-1.5 py-0.5 text-xs font-medium">
                {subcollection.icon}
              </span>
              {subcollection.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

