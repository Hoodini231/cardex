"use client"
import '@/app/globals.css';
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Axios from "axios"

export function SearchBar({
  onSearch,
  placeholder = "Search for cards...",
  className = "",
}: {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const testOutputLogsAPI = () => {
    Axios.post('http://localhost:3000/api/test').then((response) => {
      console.log("pushign")
      console.log(response.data)
    })
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, onSearch])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      
      <button onClick={() => testOutputLogsAPI()}>Test</button>
    </div>
  )
}

