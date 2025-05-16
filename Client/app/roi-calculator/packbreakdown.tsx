"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Slot {
  id: string;
  rarities: number;
  expected_value: number;
}

// Define the shape of the response as a record where keys are strings and values are Slot
type PackBreakdownResponse = Record<string, Slot>;

export function PackBreakdown({ set_name }: { set_name: string }) {
  const { data: sets, isLoading, error } = useQuery<PackBreakdownResponse>({
    queryKey: ["packBreakdown", set_name],
    queryFn: async () => {
      if (set_name != null) {
        const res = await fetch(
          `http://127.0.0.1:8000/get/calculateBreakdown/${encodeURI(set_name)}`
        );
        // Parse and return your response data as a PackBreakdownResponse.
        const data = await res.json();
        return data;
      } else {
        return {};
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sets</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Slot</th>
            <th className="px-4 py-2 border-b text-left">Rarities</th>
            <th className="px-4 py-2 border-b text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {(Object.entries(sets ?? {}) as [string, Slot][]).map(([key, slot]) => (
            <tr key={slot.id}>
              <td className="px-4 py-2 border-b">{slot.id}</td>
              <td className="px-4 py-2 border-b">{slot.rarities}</td>
              <td className="px-4 py-2 border-b">${slot.expected_value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
