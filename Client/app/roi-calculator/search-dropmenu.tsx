"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { Command, CommandInput, CommandItem, CommandList } from "../../components/ui/command"
import { Button } from "../../components/ui/button"
import { useState } from "react"
import React from "react"

interface CardSet {
  id: string
  set: string
  packPrice: number
  expectedValue: number
  simpleROI: number
  adjustedROI?: number
}

export function SetSearchDropdown({
  onSelect,
  sets
}: {
  onSelect: (set: string) => void,
  sets: CardSet[]
}) {
  const [open, setOpen] = useState(false)
  // Rename the state to something like filteredSets if you intend to use it later.
  const [filteredSets, setFilteredSets] = useState<CardSet[]>(sets)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected || "Prismatic Evolutions"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput placeholder="Search sets..." />
          <CommandList>
            {sets?.map((cardSet) => (
              <CommandItem
                key={cardSet.id}
                value={cardSet.set}
                onSelect={() => {
                  setSelected(cardSet.set)
                  setOpen(false)
                  onSelect(cardSet.set) // call parent function
                }}
              >
                {cardSet.set}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
