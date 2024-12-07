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
import { firestore, app } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "./context/CartContext";

const products = [
  {
    id: "1",
    name: "Classic T-Shirt",
    price: 19.99,
    image: "/placeholder.svg",
    type: "Top",
    size: "M",
    quantity: 5,
    gender: "Unisex",
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    price: 49.99,
    image: "/placeholder.svg",
    type: "Bottom",
    size: "32",
    quantity: 5,
    gender: "Men",
  },
  {
    id: "3",
    name: "Cozy Sweater",
    price: 39.99,
    image: "/placeholder.svg",
    type: "Top",
    quantity: 5,
    size: "L",
    gender: "Women",
  },
  {
    id: "4",
    name: "Summer Dress",
    price: 29.99,
    image: "/placeholder.svg",
    type: "Dress",
    size: "S",
    quantity: 5,
    gender: "Women",
  },
  {
    id: "5",
    name: "Leather Jacket",
    price: 99.99,
    image: "/placeholder.svg",
    type: "Outerwear",
    size: "XL",
    quantity: 5,
    gender: "Unisex",
  },
  {
    id: "6",
    name: "Athletic Shorts",
    price: 24.99,
    image: "/placeholder.svg",
    type: "Bottom",
    size: "M",
    quantity: 5,
    gender: "Unisex",
  },
];

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  size: string;
  quantity: number;
  gender: string;
};

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;
  const { cartItems, setCartItems } = useCart();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    if (!isFetched) {
      fetchProducts();
      setIsFetched(true);
    }
    console.log("Updated Items: ", items);
  }, [items]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  useEffect(() => {
    let filtered = [...items];

    if (selectedGender) {
      filtered = filtered.filter((item) => item.gender === selectedGender);
    }

    if (selectedSize) {
      filtered = filtered.filter((item) => item.size.includes(selectedSize));
    }

    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    if (sortOrder) {
      filtered.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    setFilteredItems(filtered);
  }, [selectedGender, selectedSize, selectedType, sortOrder, items]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "produtos"));
      const data: Product[] = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Product),
      }));
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.log("Error trying to fetch products: ", error);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-grow">
          <Input
            type="search"
            placeholder="Pesquisar produtos..."
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                Preço: mais baratos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                Preço: mais caros
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelectedType("Camiseta")}>
                Camiseta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("Calça")}>
                Calça
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("Shorts")}>
                Shorts
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelectedSize("P")}>
                Tamanho: P
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSize("M")}>
                Tamanho: M
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSize("G")}>
                Tamanho: G
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSize("GG")}>
                Tamanho: GG
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setSelectedGender("Masculino")}>
                Masculino
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedGender("Feminino")}>
                Feminino
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() => {
            setSelectedGender(null);
            setSelectedSize(null);
            setSelectedType(null);
            setSortOrder(null);
          }}
        >
          Limpar filtros
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <ProductCard key={item.id} product={item} onAddToCart={addToCart} />
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
