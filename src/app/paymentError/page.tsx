'use client';

import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <XCircle className="text-red-500 w-16 h-16 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Pagamento Não Aprovado</h1>
        <p className="text-gray-600 mt-2">Houve um problema ao processar seu pagamento.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition"
        >
          Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
}
