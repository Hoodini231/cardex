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
  const [page, setPage] = useState(1); // Initialize page state
  const [totalPages, setTotalPages] = useState(0); // Initialize total pages state

  const pageSize = 40;

  const { data, isLoading, error } = useQuery({
    queryKey: ["set_name", chosenSet, page],
    queryFn: async () => {
      if (!chosenSet) return { data: [], total: 0 };
  
      const res = await fetch(
        `http://127.0.0.1:8000/get/render/collections/${chosenSet}?page=${page}&page_size=${pageSize}`
      );
      return await res.json(); // expects { data, total }
    },
    enabled: !!chosenSet,
    staleTime: 1000 * 60 * 15, //  15 min
    refetchOnWindowFocus: false,
  });


  function priceCompare(a: PriceWrapper, b: PriceWrapper) {
    return a.price["Ungraded"] < b.price["Ungraded"] ? -1 : 1;
  }


  // Use the fetched data or fallback to an empty array
  useEffect(() => {
    let result: CardSet[] = data ? [...data.data] : [];
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
    setTotalPages(Math.ceil(result.length / pageSize)); // Update total pages based on filtered results
  }, [data, searchQuery, sortBy, filterOptions]);

  const toggleChase = (id: number) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, chase: !card.chase } : card)));
  };

  // Always call hooks in the same order, and conditionally render content in the returned JSX.
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data.</p>
      ) : (
        <>
          {data.data.map((card, index) => (
            <div key={index}>{/* render card here */}</div>
          ))}
  
          <div className="pagination-controls">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
