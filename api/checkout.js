import Stripe from "stripe";

// Vercel serverless function — runs securely on the server, never in the browser.
// Your secret key is read from Vercel's Environment Variables, not hardcoded.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items in order" });
  }

  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: "Handcrafted artificial floral arrangement by Carl — Florals Forever",
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // After payment, customer is sent back to your site
      success_url: `${req.headers.origin}/?order=success`,
      cancel_url:  `${req.headers.origin}/?order=cancelled`,
      // Pre-fills the email field on Stripe's checkout page if available
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      custom_text: {
        submit: {
          message: "Carl will handcraft and ship your arrangement within 5–7 business days.",
        },
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Payment session could not be created. Please try again." });
  }
}
