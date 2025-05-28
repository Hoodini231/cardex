"use client";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { NavBar } from "../../components/nav-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { SetList } from "./set-list";
import { ROICalculator } from "./calculator";
import React from "react";


interface CardSet {
    id: string
    set: string
    packPrice: number
    expectedValue: number
    simpleROI: number
    adjustedROI?: number
  }

export default function ROICalculatorPage() {
  // Purchase details
  const [fees, setFees] = useState(5);
  const [shipping, setShipping] = useState(5);

  // Selling details
  const [estimatedValue, setEstimatedValue] = useState(150);
  const [sellingFees, setSellingFees] = useState(10);
  const [shippingCost, setShippingCost] = useState(5);
  const [timeframe, setTimeframe] = useState(12);

  // Details
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Adjusted ROI from NLP
  const [adjustedROI, setAdjustedROI] = useState<number | null>(null);

  const { data: sets, isLoading, error } = useQuery({
    queryKey: ['cardSets'],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:8000/get/render/roi/setlist");
      const data = await res.json();
      return data;
    }
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sets</div>;

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Pokémon Card ROI Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Calculate, compare and project your Pokémon card investments
          </p>

          <Tabs defaultValue="sets" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="sets">Set ROI List</TabsTrigger>
              <TabsTrigger value="calculator">ROI Calculator</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator">
              <ROICalculator sets={sets}/>
            </TabsContent>

            <TabsContent value="sets">
              <SetList setList={sets} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
