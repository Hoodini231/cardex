import { TrendingUp, Heart } from "lucide-react";
import { Card } from "./ui/card"; // Adjust path based on your project
import React from "react";

const MarketHighlights = () => {
  const topGainers = [
    { name: "Charizard VMAX", set: "Champion's Path", change: "+15.2%", price: "$89.99" },
    { name: "Pikachu VMAX", set: "Vivid Voltage", change: "+12.8%", price: "$45.50" },
    { name: "Umbreon VMAX", set: "Evolving Skies", change: "+9.4%", price: "$67.25" },
  ];

  const topSets = [
    { name: "Prismatic Evolutions", set: "Scarlet & Violet", watchers: "+3.4%" },
    { name: "Crown Zenith", set: "Sword & Shield", watchers: "+3.2%" },
    { name: "Silver Tempest", set: "Scarlet & Violet", watchers: "+3.2%"},
  ];

  const biggestLosses = [
    { name: "PSA 10 Charizard", set: "Base Set", price: "$6,000", time: "2h ago" },
    { name: "BGS 9.5 Pikachu", set: "Promo", price: "$1,250", time: "4h ago" },
    { name: "Raw Blastoise", set: "Base Set", price: "$180", time: "6h ago" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Market Highlights</h2>
          <p className="text-xl text-gray-600">Real-time insights into the most active cards and sets</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Gainers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Top Gainers</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-4">
              {topGainers.map((card, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{card.name}</div>
                    <div className="text-sm text-gray-600">{card.set}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{card.price}</div>
                    <div className="text-sm text-green-600">{card.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Most Watched */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Top ROI Sets</h3>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-4">
              {topSets.map((card, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{card.name}</div>
                  <div className="text-sm text-gray-600">{card.set}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold  text-green-600">{card.watchers}</div>
                </div>
              </div>
              ))}
            </div>
          </Card>

          {/* Recent Sales */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Worst Changes</h3>
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
            </div>
            <div className="space-y-4">
              {biggestLosses.map((sale, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{sale.name}</div>
                    <div className="text-sm text-gray-600">{sale.set}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{sale.price}</div>
                    <div className="text-sm text-gray-600">{sale.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MarketHighlights;
