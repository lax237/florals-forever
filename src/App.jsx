import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import "./App.css";

const ARRANGEMENTS = [
  { id: 1, emoji: "🌸", name: "Blushing Garden",   desc: "Soft roses, baby's breath & eucalyptus in a vintage mason jar. Perfect for gifting.", price: 62,  tags: ["Gift", "Home Décor"],    stripeLink: "https://buy.stripe.com/bJe8wP6uk3nR5TS9FL9sk0q" },
  { id: 2, emoji: "🌺", name: "Coral Sunrise",      desc: "Bold focal blooms with lush greenery in a modern matte vase. A statement piece.",    price: 88,  tags: ["Home Décor", "Offices"], stripeLink: "https://buy.stripe.com/7sYeVdaKAe2v6XW6tz9sk0r" },
  { id: 3, emoji: "💐", name: "Bridal Bouquet",     desc: "Classic whites and creams with cascading silk ribbon — yours forever.",               price: 116, tags: ["Weddings", "Gift"],      stripeLink: "https://buy.stripe.com/bJe4gz2e46A3bec5pv9sk0s" },
  { id: 4, emoji: "🌿", name: "Woodland Serenity",  desc: "Artisan greenery, dried botanicals, and fillers for a rustic, earthy look.",          price: 70,  tags: ["Home Décor", "Offices"], stripeLink: "https://buy.stripe.com/eVqbJ12e46A32HGg499sk0t" },
  { id: 5, emoji: "🌷", name: "Sweetheart Tulips",  desc: "Vibrant tulips in a terracotta pot. Timeless anniversary or birthday gift.",          price: 52,  tags: ["Gift", "Anniversary"],   stripeLink: "https://buy.stripe.com/fZu14n8Cs5vZ6XWaJP9sk0u" },
  { id: 6, emoji: "🌻", name: "Golden Hour",        desc: "Sunflowers, wildflowers, and golden accents that bring joy to any room.",             price: 74,  tags: ["Home Décor", "Gift"],    stripeLink: "https://buy.stripe.com/5kQcN5cSI7E7dmk05b9sk0v" },
];

const FOCAL_OPTIONS = [
  { id: "rose",      emoji: "🌹", name: "Roses",      sub: "Classic & timeless", price: 16, stripeLink: "https://buy.stripe.com/eVq4gz9Gw8Ibgywf059sk0x" },
  { id: "peony",     emoji: "🌸", name: "Peonies",    sub: "Full & romantic",    price: 20, stripeLink: "https://buy.stripe.com/eVq3cv7yo4rV6XW05b9sk0y" },
  { id: "lily",      emoji: "🌺", name: "Lilies",     sub: "Bold & dramatic",    price: 18, stripeLink: "https://buy.stripe.com/3cIbJ13i87E75TSg499sk0z" },
  { id: "tulip",     emoji: "🌷", name: "Tulips",     sub: "Elegant & simple",   price: 14, stripeLink: "https://buy.stripe.com/5kQ5kD3i86A35TSdW19sk0A" },
  { id: "sunflower", emoji: "🌻", name: "Sunflowers", sub: "Bright & cheerful",  price: 13, stripeLink: "https://buy.stripe.com/aFa7sL4mc2jN6XW5pv9sk0B" },
  { id: "orchid",    emoji: "🪷", name: "Orchids",    sub: "Exotic & refined",   price: 22, stripeLink: "https://buy.stripe.com/6oUeVd2e41fJ6XWg499sk0w" },
];
const FILLER_OPTIONS = [
  { id: "babysbreath", emoji: "🤍", name: "Baby's Breath",   sub: "Soft & airy",        price: 6, stripeLink: "https://buy.stripe.com/dRm00j9Gw5vZ6XWdW19sk0e" },
  { id: "lavender",    emoji: "💜", name: "Lavender Sprigs", sub: "Fragrant feel",       price: 8, stripeLink: "https://buy.stripe.com/5kQfZh4mc4rV4PO9FL9sk0f" },
  { id: "wildflower",  emoji: "🌼", name: "Wildflowers",     sub: "Garden fresh",        price: 7, stripeLink: "https://buy.stripe.com/5kQ4gzcSI4rVaa8bNT9sk0g" },
  { id: "statice",     emoji: "🫐", name: "Statice",         sub: "Purple cloud effect", price: 6, stripeLink: "https://buy.stripe.com/7sYfZhbOE9Mf4PO2dj9sk0h" },
];
const GREENERY_OPTIONS = [
  { id: "eucalyptus", emoji: "🌿", name: "Eucalyptus",   sub: "Fresh & modern",     price: 8,  stripeLink: "https://buy.stripe.com/28E28r8Cs1fJfus6tz9sk0i" },
  { id: "fern",       emoji: "🍃", name: "Fern Fronds",  sub: "Lush & traditional", price: 6,  stripeLink: "https://buy.stripe.com/eVqbJ16ukbUn2HG19f9sk0j" },
  { id: "ivy",        emoji: "🌱", name: "Trailing Ivy", sub: "Cascading effect",   price: 7,  stripeLink: "https://buy.stripe.com/4gM3cvf0Q2jNaa83hn9sk0k" },
  { id
