"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import React from "react"

interface CardSet {
  id: string
  set: string
  packPrice: number
  expectedValue: number
  simpleROI: number
  adjustedROI?: number
}


export function SetList({ setList }: { setList: any }) {
  const [sets] = useState<CardSet[]>(setList)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Set ROI Overview</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Set Name</th>
              <th className="py-2 px-4">Pack Cost</th>
              <th className="py-2 px-4">Expected Value</th>
              <th className="py-2 px-4">Simple ROI</th>
              <th className="py-2 px-4">Adjusted ROI</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set) => (
              <tr key={set.id} className="border-b">
                <td className="py-2 px-4 font-medium">{set.set}</td>
                <td className="py-2 px-4">${set.packPrice}</td>
                <td className="py-2 px-4">${set.expectedValue}</td>
                <td className={`py-2 px-4 ${set.simpleROI >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {set.simpleROI * 100}%
                </td>
                <td className={`py-2 px-4 ${set.adjustedROI !== undefined ? (set.adjustedROI >= 0 ? "text-green-600" : "text-red-600") : "text-gray-500"}`}>
                  {set.adjustedROI !== undefined ? `${set.adjustedROI}%` : "—"}
                </td>
                <td className="py-2 px-4">
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
