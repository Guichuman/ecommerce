"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, ChevronDown } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAuth } from "firebase/auth";
import { auth, app } from "../../firebase";


const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 19.99,
    image: "/placeholder.svg",
    type: "Top",
    size: "M",
    gender: "Unisex",
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 49.99,
    image: "/placeholder.svg",
    type: "Bottom",
    size: "32",
    gender: "Men",
  },
  {
    id: 3,
    name: "Cozy Sweater",
    price: 39.99,
    image: "/placeholder.svg",
    type: "Top",
    size: "L",
    gender: "Women",
  },
  {
    id: 4,
    name: "Summer Dress",
    price: 29.99,
    image: "/placeholder.svg",
    type: "Dress",
    size: "S",
    gender: "Women",
  },
  {
    id: 5,
    name: "Leather Jacket",
    price: 99.99,
    image: "/placeholder.svg",
    type: "Outerwear",
    size: "XL",
    gender: "Unisex",
  },
  {
    id: 6,
    name: "Athletic Shorts",
    price: 24.99,
    image: "/placeholder.svg",
    type: "Bottom",
    size: "M",
    gender: "Unisex",
  },
];

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<typeof products>([]);
  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  const addToCart = (product: (typeof products)[0]) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-grow">
          <Input
            type="search"
            placeholder="Search for products..."
            className="pl-10 pr-4"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Tops</DropdownMenuItem>
              <DropdownMenuItem>Bottoms</DropdownMenuItem>
              <DropdownMenuItem>Dresses</DropdownMenuItem>
              <DropdownMenuItem>Outerwear</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Size: S</DropdownMenuItem>
              <DropdownMenuItem>Size: M</DropdownMenuItem>
              <DropdownMenuItem>Size: L</DropdownMenuItem>
              <DropdownMenuItem>Size: XL</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Men</DropdownMenuItem>
              <DropdownMenuItem>Women</DropdownMenuItem>
              <DropdownMenuItem>Unisex</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
      <CartDrawer
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cartItems={cartItems}
        onRemove={removeFromCart}
      />
    </main>
  );
}
