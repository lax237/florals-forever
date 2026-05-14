# 🌸 Florals Forever

Handcrafted artificial floral arrangements by Carl — Gainesville, Florida.

---

## Before You Publish — 3 Things to Set Up

### 1. 📬 Formspree (Consultation Form → Your Email + Google Sheet)

Formspree sends every booking form submission to your email AND a Google Sheet.

Steps:
1. Go to formspree.io and create a free account
2. Click New Form, give it a name like "Florals Forever Consultations"
3. Copy the endpoint URL (looks like https://formspree.io/f/abcdefgh)
4. Open src/App.jsx and replace this line near the top:
     const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";
   with your real endpoint, e.g.:
     const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpwzabcd";
5. In your Formspree dashboard, go to Integrations > Google Sheets to connect your spreadsheet

---

### 2. 💳 Stripe (Accept Payments)

Stripe lets customers pay with any credit card, Apple Pay, or Google Pay.
They charge 2.9% + 30c per transaction — no monthly fee.

Steps:
1. Go to stripe.com and create a free account
2. Go to Developers > API Keys and copy your Publishable key
3. Open src/App.jsx and replace:
     const STRIPE_PUBLISHABLE_KEY = "pk_live_REPLACE_WITH_YOUR_STRIPE_KEY";
   with your real key.

4. Create the file api/checkout.js in your project root:

------- api/checkout.js -------
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { items } = req.body;
  const line_items = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: req.headers.origin + "/success",
    cancel_url: req.headers.origin + "/",
  });
  res.json({ url: session.url });
}
--------------------------------

5. In your Vercel dashboard go to Settings > Environment Variables and add:
   STRIPE_SECRET_KEY = your Stripe Secret key (from Stripe > Developers > API Keys)

6. Run: npm install stripe

---

### 3. How to Edit After Publishing

You can change prices, text, or anything else at any time.

Option A — Edit files on your computer (recommended):
1. Open src/App.jsx in any text editor (Notepad, VS Code, etc.)
2. Change whatever you need — prices are near the top of the file
3. Run in your terminal:
     git add .
     git commit -m "Updated prices"
     git push
4. Vercel automatically rebuilds and republishes within about 30 seconds

Option B — Edit directly on GitHub:
1. Go to your repository on github.com
2. Click src/App.jsx
3. Click the pencil icon to edit in the browser
4. Make changes and click Commit changes
5. Vercel auto-deploys the update instantly

---

## Running Locally

  npm install
  npm run dev

Open http://localhost:5173 in your browser.

## Deploying to Vercel

  npm install -g vercel
  vercel

Or connect your GitHub repo at vercel.com — it deploys automatically on every push.

---

## Project Structure

  florals-forever/
  ├── api/
  │   └── checkout.js        (Stripe serverless function — you create this)
  ├── public/
  │   └── favicon.svg
  ├── src/
  │   ├── App.jsx             EDIT THIS — prices, names, descriptions
  │   └── App.css             EDIT THIS — colors and styles
  ├── index.html
  ├── package.json
  └── vite.config.js

## Where to Find Prices in App.jsx

- ARRANGEMENTS array — ready-made piece prices
- FOCAL_OPTIONS — focal flower add-on prices
- FILLER_OPTIONS — filler add-on prices
- GREENERY_OPTIONS — greenery add-on prices
- VASE_OPTIONS — vase add-on prices
- Builder base price: search for ", 28)" to find and change the $28 base
