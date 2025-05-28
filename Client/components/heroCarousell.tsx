import React, { ReactNode, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { COMPILER_INDEXES } from 'next/dist/shared/lib/constants'

interface FeaturedSet {
  badgeInfo: ReactNode
  id: string
  name: string
  description: string
  image: string
  color: string // Tailwind background gradient classes
  subcard: string[][]
}

interface HeroCarouselProps {
  featuredSets: FeaturedSet[]
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ featuredSets }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredSets.length - 1 : prev - 1
    )
  }

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredSets.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {featuredSets.map((set) => (
          <div key={set.id} className="w-full flex-shrink-0">
            <div className={`relative h-[400px] md:h-[500px] w-full bg-gradient-to-r ${set.color}`}>
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
                    
                    <div className="md:w-1/2 text-white z-10 mb-8 md:mb-0">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {set.badgeInfo}
                    </Badge>
                    <div className="mt-4">
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{set.name}</h1>
                    <p className="text-lg md:text-xl mb-6">{set.description}</p>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Explore more
                    </Button>
                    <div className="flex gap-8 pt-6">
                        {set.subcard.map((item, index) => (
                            <div key={index}>
                                <div className="text-2xl font-bold text-white">{item[0]}</div>
                                <div className="text-sm text-gray-200">{item[1]}</div>
                            </div>
                        ))}
                    </div>
                    
                  </div>
                  {/*Right side Image */}
                  <div className="relative w-full h-[500px] perspective-[1000px] overflow-visible">
                    <Image
                        src={set.image || "/placeholder.svg"}
                        alt={set.name}
                        fill
                        priority
                        className="object-contain mx-auto transition-transform duration-700 ease-out"
                        style={{
                        WebkitMaskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,1) 30%)',
                        maskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,1) 30%)',
                        WebkitMaskSize: '100% 100%',
                        maskSize: '100% 100%',
                        transform: 'rotateX(15deg) rotateY(-10deg) translateZ(40px)',
                        filter: 'drop-shadow(0 16px 24px rgba(0, 0, 0, 0.25))',
                        transformStyle: 'preserve-3d',
                        }}
                    />
                    </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full h-10 w-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {featuredSets.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
