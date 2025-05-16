"use client"

import { useState } from "react"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import React from "react"

interface MultiSliderProps {
  risk: number;
  emotion: number;
  spend: number;
  onRisk: (value: number) => void;
  onEmotion: (value: number) => void;
  onSpend: (value: number) => void;
}



export function AdjustedROIForm({ risk, emotion, spend, onRisk, onEmotion, onSpend }: MultiSliderProps) {

  const [value, setValue] = useState(0); 
    const MAX = 10; 
    const getBackgroundSize = () => { 
    return { backgroundSize: `${(value * 100) / MAX}% 100%` }; }; 




  return (
    <>
        <div className="space-y-4">
            <Label>How accepting of risk are you when it comes with pack openings?</Label>
            <div className="flex items-center space-x-4">
                <span>{0}</span>
                <Input type="range" min="0" max="10"className="slider flex-grow" value={risk} onChange={(e) => onRisk(parseInt(e.target.value))} style={getBackgroundSize()}/>
                <span>{10}</span>
            </div>
            
        </div>
        <div className="space-y-4">
            <Label>How much do you enjoy opening packs versus just buying singles?</Label>
            <div className="flex items-center space-x-4">
                <span>{0}</span>
                <Input type="range" min="0" max="10"className="slider" value={emotion} onChange={(e) => onEmotion(parseInt(e.target.value))}style={getBackgroundSize()}/>
                <span>{10}</span>
            </div>
        </div>
        <div className="space-y-4">
            <Label>How much do you usually spend on Pokémon cards?</Label>
            <div className="flex items-center space-x-4">
                <span>{0}</span>
                <Input type="range" min="0" max="10"className="slider" value={spend} onChange={(e) => onSpend(parseInt(e.target.value))}style={getBackgroundSize()}/>
                <span>{10}</span>
            </div>
            
        </div>
    </>

  )
}


    // <>
    //     <div className="space-y-4">
    //       <Label>How okay are you with opening a pack and getting nothing valuable in return?</Label>
    //       <Input value={confidence} onChange={(e) => setConfidence(e.target.value)} placeholder="e.g. It's fine thats the fun in opeing packs!" />
    //     </div>
    //     <div className="space-y-4">
    //       <Label>How important is the excitement of pulling a chase card to you rather than just buying/trading for it?</Label>
    //       <Input value={strategy} onChange={(e) => setStrategy(e.target.value)} placeholder="e.g. A mix is good sometimes its not worth to buy so many packs" />
    //     </div>
    //     <div className="space-y-4">
    //       <Label>How much do you usually spend on Pokémon cards each month, and why?</Label>
    //       <Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. Quite a lot. I spend like 400 every month" />
    //     </div>
    //     <Button onClick={handleAdjustedROICalc} disabled={loading}>
    //       {loading ? "Calculating..." : "Get Adjusted ROI"}
    //     </Button>
    // </>
