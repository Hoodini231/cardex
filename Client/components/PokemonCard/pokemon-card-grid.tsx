"use client";

import React, { useEffect, useState } from "react";
import PokemonCard from "./pokemoncard";
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

  const { data, isLoading, error } = useQuery<CardSet[]>({
    queryKey: ["set_name", chosenSet],
    queryFn: async () => {
      if (!chosenSet) return []; // Always return the same type (empty array)
      const API_ENDPOINT = process.env.REACT_APP_BACKEND_API_ENDPOINT;
      const res = await fetch(`http://127.0.0.1:8000/get/render/collections/${chosenSet}`);
      const result = await res.json();
      console.log(result);
      return result;
    },
  });

  function priceCompare(a: PriceWrapper, b: PriceWrapper) {
    return a.price["Ungraded"] < b.price["Ungraded"] ? -1 : 1;
  }


  // Use the fetched data or fallback to an empty array
  useEffect(() => {
    let result: CardSet[] = data ? [...data] : [];
    if (searchQuery) {
      result = result.filter((card) =>
        card.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    if (filterOptions.rarity) {
      result = result.filter((card) => card.rarity === filterOptions.rarity);
    }
    if (filterOptions.showOnlyChase) {
      result = result.filter((card) => card.chase);
    }

    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "rarity-asc":
            return a.rarity.localeCompare(b.rarity);
          case "rarity-desc":
            return b.rarity.localeCompare(a.rarity);
          case "chase":
            return (b.chase ? 1 : 0) - (a.chase ? 1 : 0);
          case "price-asc":
            return priceCompare(a.price, b.price);
          case "price-desc":
            return priceCompare(b.price, a.price);
          default:
            return 0;
        }
      });
    }
    setFilteredCards(result);
  }, [data, searchQuery, sortBy, filterOptions]);

  const toggleChase = (id: number) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, chase: !card.chase } : card)));
  };

  // Always call hooks in the same order, and conditionally render content in the returned JSX.
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div>Error loading sets.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCards.map((card) => (
            <PokemonCard
              key={card.id}
              card={card}
              onToggleChase={() => toggleChase(card.id)}
              priceData={card.price.price || {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
