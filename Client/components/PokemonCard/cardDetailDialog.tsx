"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Heart, ChevronRight, X, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
                <h2 className="text-2xl font-bold">{card.name} #{card.number}</h2>
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

export default CardDetailDialog;