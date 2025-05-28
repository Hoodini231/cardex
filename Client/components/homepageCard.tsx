import React, { FC } from 'react'
import { ChevronRight, Link } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

interface Feature {
  title: string
  description: string
  icon: React.ElementType
  color: string
  hoverColor: string
  navLink: string
}

interface HomePageCardProps {
  feature: Feature
}

const HomePageCard: FC<HomePageCardProps> = ({ feature }) => {
  const IconComponent = feature.icon

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
      <CardContent className="p-6">
        <div
          className={`w-12 h-12 rounded-xl ${feature.color} ${feature.hoverColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}
        >
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
        <Link href={feature.navLink}>
          <Button
            variant="ghost"
            className="p-0 h-auto text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-transform"
          >
            Explore
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default HomePageCard
