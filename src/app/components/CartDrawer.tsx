import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number; 
    selectedQuantity: number; 
    image: string;
  }>;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, selectedQuantity: number) => void;
}

export default function CartDrawer({
  isOpen,
  setIsOpen,
  cartItems,
  onRemove,
  onUpdateQuantity,
}: CartDrawerProps) {

  const router = useRouter();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.selectedQuantity,
    0
  );

  const goToPayment = () => {
    router.push("/payment");
    setIsOpen(false)
  };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[400px] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Seu carrinho
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  R$ {(Number(item.price) * Number(item.selectedQuantity) || 0).toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.selectedQuantity - 1)
                    }
                    disabled={item.selectedQuantity <= 1}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="mx-2">{item.selectedQuantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.selectedQuantity + 1)
                    }
                    disabled={item.selectedQuantity >= item.quantity}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Estoque disponível: {item.quantity}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">R$ {total.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={goToPayment}>Ir para o pagamento</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}