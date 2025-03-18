"use client";

import React, { useEffect, useState } from "react";
import placeholderImage from "@/public/placeholder.png";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, ChevronRight, X, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

const defaultCards = [
  {
    id: 1,
    name: "Blastoise",
    image: placeholderImage,
    price: 12.99,
    rarity: "Common",
    type: "Grass",
    hp: 40,
    set: "Prismatic Evolutions",
    chase: true,
    number: "001", // unique identifier for each card
  },
];

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
  const [cards, setCards] = useState(defaultCards);
  const [filteredCards, setFilteredCards] = useState(defaultCards);
  // Explicitly type cardPrices with a numeric index signature
  const [cardPrices, setCardPrices] = useState<{ [key: number]: any }>({});

  // Fetch cards when chosenSet changes
  useEffect(() => {
    console.log("PokemonCardGrid: chosenSet =", chosenSet);
    if (chosenSet) {
      fetchCards(chosenSet);
    }
  }, [chosenSet]);

  const fetchCards = async (set: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/get/cardSets?set=${set}`);
      console.log("Fetched cards for set:", set, response.data);
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  // Re-run filtering & sorting when cards, searchQuery, sortBy, or filterOptions change
  useEffect(() => {
    let result = [...cards];

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
          case "rarity":
            return a.rarity.localeCompare(b.rarity);
          case "chase":
            return (b.chase ? 1 : 0) - (a.chase ? 1 : 0);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }

    setFilteredCards(result);
  }, [cards, searchQuery, sortBy, filterOptions]);

  // Fetch all price data concurrently
  const fetchAllPrices = async () => {
    try {
      const responses = await Promise.all(
        cards.map((card) =>
          axios.get(`http://127.0.0.1:8000/cardprice/${card.set}/${card.name}/${card.number}`)
        )
      );
      const newPrices: { [key: number]: any } = {};
      responses.forEach((response, index) => {
        newPrices[cards[index].id] = response.data.data;
      });
      setCardPrices(newPrices);
    } catch (error) {
      console.error("Error fetching all prices:", error);
    }
  };

  // Fetch prices when cards update and poll every 60 seconds
  useEffect(() => {
    if (cards.length > 0) {
      fetchAllPrices();
      const intervalId = setInterval(() => {
        fetchAllPrices();
      }, 60000); // Poll every 60 seconds
      return () => clearInterval(intervalId);
    }
  }, [cards]);

  const toggleChase = (id: number) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, chase: !card.chase } : card)));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {filteredCards.map((card) => (
        <PokemonCard
          key={card.id}
          card={card}
          onToggleChase={() => toggleChase(card.id)}
          priceData={cardPrices[card.id] || {}}
        />
      ))}
    </div>
  );
}

function PokemonCard({ card, onToggleChase, priceData }: { card: any; onToggleChase: () => void; priceData: any }) {
  const EMPTY_PRICES = {
    "Ungraded": "-",
    "Grade 1": "-",
    "Grade 2": "-",
    "Grade 3": "-",
    "Grade 4": "-",
    "Grade 5": "-",
    "Grade 6": "-",
    "Grade 7": "-",
    "Grade 8": "-",
    "Grade 9": "-",
    "Grade 9.5": "-",
    "SGC 10": "-",
    "CGC 10": "-",
    "PSA 10": "-",
    "BGS 10": "-",
    "BGS 10 Black": "$562.00",
    "CGC 10 Pristine": "-"
  };

  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleToggleChase = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleChase();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-0 relative">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={card.imageLarge || placeholderImage}
                alt={card.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white/90 rounded-full h-8 w-8 p-1"
                  onClick={handleToggleChase}
                >
                  {/* Your Chase button content */}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white/90 rounded-full h-8 w-8 p-1"
                  onClick={toggleWishlist}
                >
                  {/* Your Wishlist button content */}
                </Button>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm truncate">{card.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{card.set}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-primary font-bold">
                  {priceData["Ungraded"] || EMPTY_PRICES["Ungraded"]}
                </span>
                <Badge variant="outline" className="text-xs">
                  {card.rarity}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <CardDetailDialog card={card} onToggleChase={onToggleChase} cardPrice={priceData || EMPTY_PRICES} />
    </Dialog>
  );
}

function CardDetailDialog({ card, onToggleChase, cardPrice }: { card: any; onToggleChase: () => void; cardPrice: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="bg-gray-100 p-8 flex items-center justify-center relative">
          <div className="relative aspect-[3/4] w-full max-w-[280px]">
            <Image src={card.imageSmall || "/placeholder.png"} alt={card.name} fill className="object-contain" />

            {/* Chase Banner in Detail View */}
            {card.chase && (
              <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden">
                <div className="absolute top-0 left-0 transform -translate-x-1/2 translate-y-1/2 rotate-[-45deg] bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-1 px-10 shadow-md">
                  CHASE
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onToggleChase}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full h-10 w-10"
          >
            <Star className={`h-5 w-5 ${card.isChase ? "fill-yellow-500 text-yellow-500" : "text-gray-500"}`} />
          </Button>
        </div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{card.name}</h2>
              <p className="text-sm text-muted-foreground">{card.set}</p>
            </div>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DialogTrigger>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Card Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{card.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HP:</span>
                  <span>{card.hp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rarity:</span>
                  <span>{card.rarity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Set:</span>
                  <span>{card.set}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="pricing">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="grading">Grading</TabsTrigger>
              </TabsList>
              <TabsContent value="pricing" className="space-y-4 pt-4">
                <div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span>Market Price</span>
                    <span className="font-bold">
                      {cardPrice["Ungraded"] !== "-" ? `$${cardPrice["Ungraded"]}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span>Avg. Sold Price (7 days)</span>
                    <span className="font-bold">
                      {cardPrice["Ungraded"] !== "-" ? `$${cardPrice["Ungraded"]}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span>Lowest Listed Price</span>
                    <span className="font-bold">
                      {cardPrice["Ungraded"] !== "-" ? `$${cardPrice["Ungraded"]}` : "-"}
                    </span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="grading" className="space-y-4 pt-4">
                <div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span>PSA 10</span>
                    <span className="font-bold">
                      {typeof cardPrice["PSA 10"] === "number"
                        ? `$${cardPrice["PSA 10"].toFixed(2)}`
                        : cardPrice["PSA 10"]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span>PSA 9</span>
                    <span className="font-bold">
                      {typeof cardPrice["Grade 9"] === "number"
                        ? `$${cardPrice["Grade 9"]}`
                        : cardPrice["Grade 9"]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span>Ungraded</span>
                    <span className="font-bold">{cardPrice["Ungraded"]}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1">Add to Collection</Button>
              <Button
                variant={isWishlisted ? "default" : "outline"}
                className={`flex-1 ${isWishlisted ? "bg-red-500 hover:bg-red-600" : ""}`}
                onClick={toggleWishlist}
              >
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-white" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>

            <Button variant="link" className="w-full mt-2 flex items-center justify-center">
              See More Analytics
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
