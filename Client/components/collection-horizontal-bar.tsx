"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import "@/app/globals.css";
import axios from "axios";

interface Collection {
  id: string;
  name: string;
  icon: string;
  created: number;
  series?: Subcollection[];
}

interface Subcollection {
  id: string;
  name: string;
}

export function CollectionHorizontalBar({
  onChosenSet,
}: {
  onChosenSet?: (setId: string) => void; // Add this
}) {
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [expandedCollectionIds, setExpandedCollectionIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCollections = async () => {
    try {
      const response = await axios.get<Collection[]>("http://localhost:5001/get/gens");
      const sortedCollections = response.data.sort((a, b) => b.created - a.created);
      setAllCollections(sortedCollections);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Filter collections by name
  const filteredCollections = allCollections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle expansion for a single collection
  const toggleCollection = (id: string) => {
    setExpandedCollectionIds((prev) =>
      prev.includes(id)
        ? prev.filter((expandedId) => expandedId !== id)
        : [...prev, id]
    );
  };

  // Toggle expansion for all filtered collections
  const toggleAll = () => {
    const allIds = filteredCollections.map((c) => c.id);
    const areAllExpanded = allIds.every((id) => expandedCollectionIds.includes(id));
    if (areAllExpanded) {
      setExpandedCollectionIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setExpandedCollectionIds((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  useEffect(() => {
    console.log("CollectionHorizontalBar: chosenSet = Paldean Fates");
    onChosenSet?.("Paldean Fates");
  }, [onChosenSet]);

  // When the user clicks on a subcollection, call onChosenSet with that sub's ID
  const handleSubcollectionClick = (subId: string) => {
    console.log("Subcollection clicked:", subId);
    onChosenSet?.(subId);
    console.log("onChosenSet called with:", subId);
  };

  return (
    <div className="w-full bg-gray-50 border-b">
      <div className="container mx-auto">
        {/* You can keep the search & fold/unfold logic if needed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search a collection..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" onClick={toggleAll} className="flex items-center gap-2">
            {filteredCollections.every((c) => expandedCollectionIds.includes(c.id)) ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Fold all
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Unfold all
              </>
            )}
          </Button>
        </div>

        <div className="p-4">
          <ScrollArea className="w-full">
            <div className="flex gap-4">
              {filteredCollections.map((collection) => (
                <div key={collection.id} className="min-w-[200px]">
                  <Button
                    variant="ghost"
                    className="w-full justify-start mb-2 hover:bg-gray-100"
                    onClick={() => toggleCollection(collection.id)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedCollectionIds.includes(collection.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-6 h-6 text-xs font-medium">
                          {collection.icon}
                        </span>
                        {collection.name}
                      </span>
                    </div>
                  </Button>

                  {/* If expanded, show subcollections */}
                  {expandedCollectionIds.includes(collection.id) && collection.series && (
                    <div className="ml-6 space-y-1">
                      {collection.series.map((sub) => (
                        <Button
                          key={sub.id}
                          variant="ghost"
                          className="w-full justify-start pl-6 hover:bg-gray-100"
                          onClick={() => handleSubcollectionClick(sub.name)}
                        >
                          <span className="flex items-center gap-2">{sub.name}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
