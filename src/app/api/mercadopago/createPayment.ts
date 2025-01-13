'use client';

import { NextApiRequest, NextApiResponse } from "next";
import mercadopago from "mercadopago";

(mercadopago as any).configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const items = req.body;

    console.log("Received items:", items);

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid request body. Items must be an array." });
    }

    const preference = {
      items: items.map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: "BRL",
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-pending`,
      },
      auto_return: "approved",
    };

    const response = await (mercadopago as any).preferences.create(preference);

    console.log("Mercado Pago Response:", response);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ init_point: response.body.init_point });
  } catch (error: any) {
    console.error("Error creating payment preference:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to create payment preference" });
  }
}
