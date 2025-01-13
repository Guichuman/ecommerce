
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "@/app/components/ui/badge"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    type: string
    size: string
    quantity: number
    gender: string
    selectedQuantity: number;
  }
  onAddToCart: (product: ProductCardProps['product']) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="">
      <CardContent className="p-0">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-72 object-cover"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2 font-bold">R$ {product.price.toFixed(2)}</p>
        <div className="flex flex-wrap gap-2 mb-4 ">
          <Badge variant="secondary">{product.type}</Badge>
          <Badge variant="secondary">{product.size}</Badge>
          <Badge variant="secondary">{product.gender}</Badge>
        </div>
        <Button className="w-full" onClick={() => onAddToCart(product)}>Adicionar ao carrinho</Button>
      </CardFooter>
    </Card>
  )
}

