"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "./pokemoncard";
import PokeballSpinner from "../ui/pokeballSpinner";
import { useQuery } from "@tanstack/react-query";

interface priceData {
  "Ungraded": string;
  "PSA 10": string;
  "PSA 9.5": string;
  "PSA 9": string;
  "PSA 8": string;
  "PSA 7": string;
  "PSA 6": string;
  "SGC 10": string;
  "CGC 10": string;
  "BGS 10": string;
  "BGS 10 Black": string;
  "CGC 10 Pristine": string;
}

interface PriceWrapper {
  name: string;
  number: string;
  price: priceData;
}

interface CardSet {
  id: number;
  name: string;
  image: string;
  price: PriceWrapper;
  rarity: string;
  type: string;
  set: string;
  number: string;
  chase: boolean;
}

export function PokemonCardGrid({
  searchQuery = "",
  sortBy = "",
  filterOptions = {},
  chosenSet,
}: {
  searchQuery?: string;
  sortBy?: string;
  filterOptions?: any;
  chosenSet?: string;
}) {
  const [cards, setCards] = useState<CardSet[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardSet[]>([]);
  const [cardPrices, setCardPrices] = useState<{ [key: number]: any }>({});
  const [page, setPage] = useState(1); // Initialize page state
  const [totalPages, setTotalPages] = useState(0); // Initialize total pages state

  const pageSize = 42;

 // Updated useQuery to include all filter params in the queryKey
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "set_name", 
      chosenSet, 
      page, 
      pageSize, 
      filterOptions.rarity, 
      sortBy
    ],
    queryFn: async () => {
      if (!chosenSet) return { data: [], total: 0 };
    
      // Build params inside the queryFn
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (filterOptions.rarity) {
        params.append("rarity", filterOptions.rarity);
      }

      if (sortBy) {
        const [field, direction] = sortBy.split("-");
        params.append("sort_by", field);
        params.append("sort_order", direction === 'desc' ? '-1' : '1');
      }
      
      // Use the params in the fetch URL
      const res = await fetch(
        `http://127.0.0.1:8000/get/render/collections/${chosenSet}?${params.toString()}`
      );
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      return result;
    },
    enabled: !!chosenSet,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  // Effect to update cards state when data changes
  useEffect(() => {
    if (data) {
      setCards(data.data || []);
      setTotalPages(Math.ceil(data.total / pageSize));
    }
  }, [data, pageSize]);

  // Effect to handle filter changes - reset to page 1 and refetch
  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
    
    // If chosenSet exists, refetch data with new params
    if (chosenSet) {
      refetch();
    }
  }, [searchQuery, sortBy, filterOptions, chosenSet, refetch]);

  const toggleChase = (id: number) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, chase: !card.chase } : card)));
  };

  // Always call hooks in the same order, and conditionally render content in the returned JSX.
return (
  <div>
    {isLoading ? (
      <div className="flex py-8 justify-center items-center">
        <PokeballSpinner size="large" showText={true} />
      </div>
    ) : error ? (
      <p>Error loading data.</p>
    ) : (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
          {cards.map((card: any) => (
            <PokemonCard
              key={card.id}
              card={card}
              onToggleChase={() => toggleChase(card.id)}
              priceData={card.price.price}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </>
    )}
  </div>
  )};
