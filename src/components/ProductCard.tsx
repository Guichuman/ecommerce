
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    type: string
    size: string
    gender: string
  }
  onAddToCart: (product: ProductCardProps['product']) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-48 object-cover"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{product.type}</Badge>
          <Badge variant="secondary">{product.size}</Badge>
          <Badge variant="secondary">{product.gender}</Badge>
        </div>
        <Button className="w-full" onClick={() => onAddToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

