"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";


export default function PaymentPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>('');

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/");
    } else {
      initMercadoPago('TEST-10d0b880-2bfe-4d7e-ac3a-5bbf3786acf4');
      createPaymentPreference();
    }
  }, [cartItems, router]);

  const createPaymentPreference = async () => {
    setLoading(true);
    try {

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems), 
      });

      const data = await response.json();
      if (data.id) {
        setPreferenceId(data.id);
      } else {
        console.error('Invalid preferenceId:', data);
      }
    } catch (error) {
      console.error('Error creating payment preference:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Pagamento</h1>
      <div className="bg-white p-6 shadow-md rounded-md">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 object-cover rounded-md"
              />
              <span>
                {item.name} x {item.selectedQuantity}
              </span>
            </div>
            <span>
              R$ {(item.price * item.selectedQuantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <span className="font-semibold text-xl">Total:</span>
          <span className="font-semibold text-xl">
            R${" "}
            {cartItems
              .reduce(
                (sum, item) => sum + item.price * item.selectedQuantity,
                0
              )
              .toFixed(2)}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </div>
        ) : (
          preferenceId && (
            <Wallet
              initialization={{ preferenceId }}
              customization={{
                texts: {
                  valueProp: "smart_option",
                },
              }}
            />
          )
        )}
      </div>
    </main>
  );
}