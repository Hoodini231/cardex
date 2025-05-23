"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import CardDetailDialog from "./cardDetailDialog";

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
                  src={card.imageLarge.replace(/\s/g, '_')}
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
                <h3 className="font-medium text-sm truncate">{card.name} #{card.number}</h3>
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

export default PokemonCard;