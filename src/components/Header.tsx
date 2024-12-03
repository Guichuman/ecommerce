'use client';
import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import CartDrawer from './CartDrawer'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Stylish Threads
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
          <Button variant="outline" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          </Button>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} cartItems={cartItems} />
    </header>
  )
}

