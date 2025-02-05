import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextApiRequest, NextApiResponse } from "next";

const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-2623445745728314-081412-41412dbad5b679098cbdd40c1b13850d-350849605', 
});

const preference = new Preference(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cartItems = req.body;

    // Ensure items are provided and are in the correct format
    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: 'Invalid request body. Items must be an array.' });
    }

    const items = cartItems.map((item) => ({
      id: item.id, // Use the product ID
      title: item.name, // Use the product name as the title
      quantity: item.selectedQuantity, // Use the selected quantity
      unit_price: item.price, // Use the product price
    }));

    
    // Create the preference
    const preferenceResponse = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`, // Redirect URL after successful payment
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`, // Redirect URL after failed payment
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-pending`, // Redirect URL for pending payments
        },
        auto_return: 'approved', // Automatically redirect to the success URL after payment approval
      },
    });

    console.log("prefenrence: ", preferenceResponse)

    // Return the preference response
    res.status(200).json(preferenceResponse);
  } catch (error) {
    console.error('Error creating payment preference:', error);
    res.status(500).json({ error: 'Failed to create payment preference' });
  }
}