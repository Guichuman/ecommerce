import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-2623445745728314-081412-41412dbad5b679098cbdd40c1b13850d-350849605', 
});

type Item = {
  id: string;
  type: string;
  name: string;
  description: string
  image: string;
  category: string;
  selectedQuantity: number;
  price: number;
}

const payment = new Payment(client);
const preference = new Preference(client)

export async function POST(req: Request) {
  try {
    const items = await req.json();

    const paymentData = {
      items: items.map((item: Item) => ({
        id: item.id,
        title: item.name,
        description: item.type,
        picture_url: item.image,
        category_id: item.type,
        quantity: item.selectedQuantity,
        currency_id: "BRL",
        unit_price: item.price,
      })),
      back_urls: {
        success: "http://localhost:3000/paymentSuccess",
        pending: "http://localhost:3000/pending",
        failure: "http://localhost:3000/paymentError",
      },
      auto_return: "all"
    };

    const response = await preference.create({ body: paymentData });
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}