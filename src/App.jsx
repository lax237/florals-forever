import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import "./App.css";

const ARRANGEMENTS = [
  { id: 1, emoji: "🌸", name: "Blushing Garden",   desc: "Soft roses, baby's breath & eucalyptus in a vintage mason jar. Perfect for gifting.", price: 62,  tags: ["Gift", "Home Décor"],    stripeLink: "https://buy.stripe.com/bJe8wP6uk3nR5TS9FL9sk0q" },
  { id: 2, emoji: "🌺", name: "Coral Sunrise",      desc: "Bold focal blooms with lush greenery in a modern matte vase. A statement piece.",    price: 88,  tags: ["Home Décor", "Offices"], stripeLink: "https://buy.stripe.com/7sYeVdaKAe2v6XW6tz9sk0r" },
  { id: 3, emoji: "🤍", name: "Bridal Bouquet",     desc: "Classic whites and creams with cascading silk ribbon — yours forever.",               price: 116, tags: ["Weddings", "Gift"],      stripeLink: "https://buy.stripe.com/bJe4gz2e46A3bec5pv9sk0s" },
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
  { id: "succulent",  emoji: "🪴", name: "Succulents",   sub: "Sculptural accent",  price: 10, stripeLink: "https://buy.stripe.com/aFa7sL4mce2v6XWcRX9sk0l" },
];
const VASE_OPTIONS = [
  { id: "mason",      emoji: "🫙", name: "Mason Jar",      sub: "Rustic charm",     price: 12, stripeLink: "https://buy.stripe.com/bJebJ14mc2jNcig9FL9sk0m" },
  { id: "ceramic",    emoji: "🪆", name: "Ceramic Vase",   sub: "Artisan crafted",  price: 20, stripeLink: "https://buy.stripe.com/6oUaEX7yoaQj9644lr9sk0n" },
  { id: "glass",      emoji: "🍶", name: "Clear Glass",    sub: "Timeless & clean", price: 14, stripeLink: "https://buy.stripe.com/3cI00j4mc8Ib820cRX9sk0o" },
  { id: "terracotta", emoji: "🏺", name: "Terracotta Pot", sub: "Earthy & warm",    price: 16, stripeLink: "https://buy.stripe.com/5kQ4gz9Gw3nR820bNT9sk0p" },
];

const BRIDAL_ARRANGEMENTS = [
  { id: "b1", emoji: "🌼", name: "Classic White Elegance",  desc: "All-white roses, peonies & cascading baby's breath in a clear glass vase. Timeless bridal beauty.", price: 145, tags: ["Bridal", "Bouquet"] },
  { id: "b2", emoji: "🌸", name: "Blush Romance",           desc: "Soft blush peonies, ivory roses & dusty miller in a ceramic vase. Romantic and feminine.", price: 135, tags: ["Bridal", "Centerpiece"] },
  { id: "b3", emoji: "🌿", name: "Garden Bohemian",         desc: "Wildflowers, eucalyptus & trailing ivy with pops of lavender. Perfect for outdoor & boho weddings.", price: 125, tags: ["Bridal", "Boho"] },
  { id: "b4", emoji: "🌹", name: "Red Carpet Rose",         desc: "Deep red roses with lush greenery & gold accents in a matte ceramic vase. Bold & dramatic.", price: 155, tags: ["Bridal", "Statement"] },
  { id: "b5", emoji: "💛", name: "Golden Meadow",           desc: "Sunflowers, cream roses & golden wheat in a terracotta pot. Rustic elegance for country weddings.", price: 120, tags: ["Bridal", "Rustic"] },
  { id: "b6", emoji: "🪷", name: "Orchid Luxe",             desc: "Exotic orchids, white lilies & sculptural succulents in a tall glass vase. Luxury at its finest.", price: 175, tags: ["Bridal", "Luxury"] },
];

const SUBSTRATE_OPTIONS = [
  { id: "river-stones",  emoji: "🪨", name: "River Stones",      sub: "Smooth & natural" },
  { id: "dec-rocks",     emoji: "🪨", name: "Decorative Rocks",   sub: "Polished & earthy" },
  { id: "marbles",       emoji: "🔵", name: "Glass Marbles",      sub: "Colorful & playful" },
  { id: "peat-moss",     emoji: "🌿", name: "Peat Moss",          sub: "Organic & lush" },
  { id: "colored-sand",  emoji: "🏖️", name: "Colored Sand",       sub: "Soft & decorative" },
  { id: "aqua-gravel",   emoji: "🫧", name: "Aquarium Gravel",    sub: "Clean & refined" },
  { id: "dried-moss",    emoji: "🍃", name: "Dried Moss",         sub: "Rustic & textured" },
  { id: "dec-pebbles",   emoji: "⚪", name: "Decorative Pebbles", sub: "Classic & versatile" },
  { id: "wood-chips",    emoji: "🪵", name: "Wood Chips / Bark",  sub: "Warm & woodland" },
  { id: "lichen",        emoji: "🌱", name: "Preserved Lichen",   sub: "Botanical & unique" },
  { id: "sea-glass",     emoji: "💚", name: "Sea Glass",          sub: "Coastal & elegant" },
  { id: "no-pref",       emoji: "✨", name: "No Preference",      sub: "Carl will choose" },
];

const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Home Décor", "Business / Office", "Sympathy", "Just Because", "Holiday"];

const BUILDER_STEPS = ["Focal Flower", "Filler", "Greenery", "Substrate", "Vase"];
const BUILDER_DATA  = [FOCAL_OPTIONS, FILLER_OPTIONS, GREENERY_OPTIONS, SUBSTRATE_OPTIONS, VASE_OPTIONS];
const BUILDER_KEYS  = ["focal", "filler", "greenery", "substrate", "vase"];

export default function App() {
  const [cart, setCart]                       = useState([]);
  const [cartOpen, setCartOpen]               = useState(false);
  const [checkingOut, setCheckingOut]         = useState(false);
  const [toast, setToast]                     = useState(null);
  const [builderMode, setBuilderMode]         = useState("guided"); // "guided" | "custom"
  const [builderStep, setBuilderStep]         = useState(0);
  const [builderSel, setBuilderSel]           = useState({ focal: null, filler: null, greenery: null, substrate: null, vase: null });
  const [bookingOccasion, setBookingOccasion] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const addToCart = (item) => {
    setCart((c) => [...c, { ...item, cartId: Date.now() + Math.random() }]);
    showToast(`✿ "${item.name}" added to your cart`);
  };

  const removeFromCart = (cartId) => setCart((c) => c.filter((i) => i.cartId !== cartId));
  const cartTotal = cart.reduce((s, i) => s + i.price, 0);

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.url) {
        const w = Math.min(window.screen.width * 0.85, 1100);
        const h = Math.min(window.screen.height * 0.85, 800);
        const left = (window.screen.width - w) / 2;
        const top  = (window.screen.height - h) / 2;
        window.open(data.url, "_blank", `width=${Math.round(w)},height=${Math.round(h)},left=${Math.round(left)},top=${Math.round(top)},resizable=yes,scrollbars=yes`);
      } else {
        alert("Error: " + (data.error || "Could not start checkout. Please try again."));
        setCheckingOut(false);
      }
    } catch (err) {
      alert("Network error. Please check your connection and try again.");
      setCheckingOut(false);
    }
  };

  const buyNow = (item) => {
    if (item.stripeLink) {
      window.location.href = item.stripeLink;
    } else {
      alert("Payment link coming soon! Please use the Book a Consultation form to order.");
    }
  };

  const builderPrice = BUILDER_KEYS.reduce((s, k, i) => {
    const found = BUILDER_DATA[i].find((o) => o.id === builderSel[k]);
    return s + (found ? found.price : 0);
  }, 35);

  const addCustomToCart = () => {
    const components = BUILDER_KEYS.map((k, i) => {
      const sel = BUILDER_DATA[i].find((o) => o.id === builderSel[k]);
      return sel ? `${sel.emoji} ${sel.name}` : null;
    }).filter(Boolean).join(", ");

    const customItem = {
      name: `Custom Arrangement (${components})`,
      price: builderPrice,
      cartId: Date.now() + Math.random(),
    };
    setCart((c) => [...c, customItem]);
    showToast(`✿ Custom arrangement added to your cart`);
    setBuilderStep(0);
    setBuilderSel({ focal: null, filler: null, greenery: null, substrate: null, vase: null });
  };

  // ── FIXED: sends all selected components to /api/checkout instead of
  //           redirecting to the vase's individual Stripe link only.
  const buyCustom = async () => {
    setCheckingOut(true);
    const items = [
      { name: "Custom Arrangement — Base & Labour", price: 35 },
      ...BUILDER_KEYS.map((k, i) => {
        const sel = BUILDER_DATA[i].find((o) => o.id === builderSel[k]);
        return sel ? { name: `${BUILDER_STEPS[i]}: ${sel.name}`, price: sel.price } : null;
      }).filter(Boolean),
    ];
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        const w = Math.min(window.screen.width * 0.85, 1100);
        const h = Math.min(window.screen.height * 0.85, 800);
        const left = (window.screen.width - w) / 2;
        const top  = (window.screen.height - h) / 2;
        window.open(data.url, "_blank", `width=${Math.round(w)},height=${Math.round(h)},left=${Math.round(left)},top=${Math.round(top)},resizable=yes,scrollbars=yes`);
        setBuilderStep(0);
        setBuilderSel({ focal: null, filler: null, greenery: null, substrate: null, vase: null });
      } else {
        alert(data.error || "Could not start checkout. Please try again.");
        setCheckingOut(false);
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
      setCheckingOut(false);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const [formState, handleBookingSubmit] = useForm("xpqbelga");
  const [customForm, handleCustomSubmit]  = useForm("xpqbelga"); // reuses same Formspree endpoint
  const [genderForm, handleGenderSubmit]  = useForm("xpqbelga"); // gender reveal requests
  const [genderChoice, setGenderChoice]   = useState(null);      // "boy" | "girl" | null
  const [bridalForm, handleBridalSubmit]  = useForm("xpqbelga"); // bridal requests
  const [bridalTab, setBridalTab]         = useState("preset");  // "preset" | "custom"
  const [selectedSubstrate, setSelectedSubstrate] = useState([]);

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">Florals <em>Forever</em></div>
        <div className="nav-right">
          <ul className="nav-links">
            {[["home","Home"],["portfolio","Shop"],["builder","Custom Builder"],["gender-reveal","Gender Reveal"],["bridal","Bridal"],["booking","Book Consultation"]].map(([id, label]) => (
              <li key={id}><button onClick={() => scrollTo(id)}>{label}</button></li>
            ))}
          </ul>
          <button className="nav-cart" onClick={() => setCartOpen(true)}>
            🛒 Cart ({cart.length})
          </button>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <p className="eyebrow">✦ Handcrafted by Carl · Gainesville, Florida</p>
          <h1 className="hero-title">Arrangements that<br /><em>last a lifetime</em></h1>
          <p className="hero-sub">
            Each piece is lovingly handcrafted from premium artificial flowers — focal blooms,
            fillers, and lush greenery — so you can enjoy breathtaking beauty that never wilts,
            never fades, never dies.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => scrollTo("portfolio")}>Shop Arrangements</button>
            <button className="btn-outline" onClick={() => scrollTo("builder")}>Build Your Own</button>
          </div>
          <div className="hero-badges">
            <div className="badge"><span className="badge-num">100%</span><span className="badge-lbl">Artificial & Lasting</span></div>
            <div className="badge"><span className="badge-num">∞</span><span className="badge-lbl">Lifetime Beauty</span></div>
            <div className="badge"><span className="badge-num">✦</span><span className="badge-lbl">Handmade by Carl</span></div>
          </div>
        </div>
        <div className="hero-floral" aria-hidden="true">❀</div>
      </section>

      <section id="portfolio" className="section section--white">
        <div className="section-header">
          <p className="eyebrow">✦ The Collection</p>
          <h2 className="section-title">Ready-Made <em>Arrangements</em></h2>
          <p className="section-sub">Each one handcrafted, ready to ship. Yours forever.</p>
        </div>
        <div className="portfolio-grid">
          {ARRANGEMENTS.map((a) => (
            <div key={a.id} className="portfolio-card">
              <div className="portfolio-img"><span>{a.emoji}</span></div>
              <div className="portfolio-info">
                <h3 className="portfolio-name">{a.name}</h3>
                <p className="portfolio-desc">{a.desc}</p>
                <div className="portfolio-tags">
                  {a.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="portfolio-price">${a.price}</div>
                <div className="card-btns">
                  <button className="add-to-cart" onClick={() => addToCart(a)}>Add to Cart</button>
                  <button className="buy-now" onClick={() => buyNow(a)}>Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="builder" className="section section--tinted">
        <div className="section-header">
          <p className="eyebrow">✦ Design Studio</p>
          <h2 className="section-title">Build Your <em>Custom</em> Arrangement</h2>
          <p className="section-sub">Pick each element and Carl will bring your vision to life — or describe your dream arrangement in your own words.</p>
        </div>
        <div className="builder-inner">

          {/* ── MODE TABS ── */}
          <div className="builder-tabs">
            <button
              className={`builder-tab ${builderMode === "guided" ? "active" : ""}`}
              onClick={() => setBuilderMode("guided")}
            >
              ✦ Step-by-Step Builder
            </button>
            <button
              className={`builder-tab ${builderMode === "custom" ? "active" : ""}`}
              onClick={() => setBuilderMode("custom")}
            >
              ✍ Describe Your Own
            </button>
          </div>

          {/* ── GUIDED BUILDER ── */}
          {builderMode === "guided" && (<>
            <div className="builder-steps">
              {BUILDER_STEPS.map((s, i) => (
                <div key={s} className={`builder-step ${builderStep === i ? "active" : builderSel[BUILDER_KEYS[i]] ? "done" : ""}`}>
                  <span className="step-num">{builderSel[BUILDER_KEYS[i]] ? "✓" : i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
            {builderStep < 4 ? (
              <>
                <h3 className="builder-prompt">Choose your {BUILDER_STEPS[builderStep]}</h3>
                <div className={`options-grid ${
                  BUILDER_DATA[builderStep].length === 4 ? "options-grid--2col" :
                  BUILDER_DATA[builderStep].length === 12 ? "options-grid--4col" : ""
                }`}>
                  {BUILDER_DATA[builderStep].map((opt) => (
                    <div key={opt.id} className={`option-card ${builderSel[BUILDER_KEYS[builderStep]] === opt.id ? "selected" : ""}`}
                      onClick={() => setBuilderSel((b) => ({ ...b, [BUILDER_KEYS[builderStep]]: opt.id }))}>
                      <span className="option-emoji">{opt.emoji}</span>
                      <div className="option-name">{opt.name}</div>
                      <div className="option-sub">{opt.sub}</div>
                      <div className="option-price">
                      {opt.price !== undefined ? `+$${opt.price}` : <span className="option-price-tbd">+ To be determined by weight</span>}
                    </div>
                    </div>
                  ))}
                </div>
                <div className="builder-nav">
                  <button className="btn-outline" onClick={() => setBuilderStep((s) => Math.max(0, s - 1))} disabled={builderStep === 0}>← Back</button>
                  <button className="btn-primary" onClick={() => setBuilderStep((s) => s + 1)} disabled={!builderSel[BUILDER_KEYS[builderStep]]}>
                    {builderStep === 3 ? "Review →" : "Next →"}
                  </button>
                </div>
              </>
            ) : (
              <div className="builder-review">
                <div className="builder-summary">
                  <div className="summary-title">✦ Your Custom Arrangement</div>
                  {BUILDER_KEYS.map((k, i) => {
                    const sel = BUILDER_DATA[i].find((o) => o.id === builderSel[k]);
                    return sel ? (
                      <div key={k} className="summary-row">
                        <span>{BUILDER_STEPS[i]}</span>
                        <span>{sel.emoji} {sel.name} {sel.price !== undefined ? `(+$${sel.price})` : <em className="tbd-tag">(+ TBD by weight)</em>}</span>
                      </div>
                    ) : null;
                  })}
                  <div className="summary-row"><span>Base price</span><span>$35</span></div>
                  <div className="summary-total"><span>Total</span><span>${builderPrice}</span></div>
                </div>
                <div className="builder-nav">
                  <button className="btn-outline" onClick={() => setBuilderStep(0)}>Start Over</button>
                  <button className="btn-add-to-cart" onClick={addCustomToCart}>Add to Cart</button>
                  <button className="btn-primary" onClick={buyCustom} disabled={checkingOut}>
                    {checkingOut ? "Redirecting to Stripe…" : `Buy Now — $${builderPrice}`}
                  </button>
                </div>
              </div>
            )}
          </>)}

          {/* ── DESCRIBE YOUR OWN ── */}
          {builderMode === "custom" && (
            <div className="custom-request">
              {customForm.succeeded ? (
                <div className="success-msg">
                  <div className="success-icon">✿</div>
                  <h3>Request Received!</h3>
                  <p>Carl will review your vision and reach out within 24 hours with a quote.</p>
                </div>
              ) : (
                <>
                  <div className="custom-request-intro">
                    <p>Not sure where to start? No problem. Describe your dream arrangement below — the flowers, colors, style, size, occasion, or anything else on your mind. Carl will personally review your request and send you a custom quote.</p>
                  </div>
                  <form onSubmit={handleCustomSubmit} className="booking-form">
                    <input type="hidden" name="request_type" value="Describe Your Own Arrangement" />
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="custom-name">Your Name</label>
                        <input id="custom-name" name="name" className="form-input" placeholder="Jane Smith" required />
                        <ValidationError field="name" errors={customForm.errors} className="field-error" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="custom-email">Email</label>
                        <input id="custom-email" name="email" type="email" className="form-input" placeholder="jane@email.com" required />
                        <ValidationError field="email" errors={customForm.errors} className="field-error" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="custom-vision">Describe Your Arrangement</label>
                      <textarea
                        id="custom-vision"
                        name="arrangement_description"
                        className="form-textarea custom-textarea"
                        placeholder={"Tell Carl everything! For example:\n• Focal flowers: roses, peonies, sunflowers, lilies, tulips, orchids — or something else entirely\n• Fillers: baby's breath, lavender, wildflowers, statice, or your own ideas\n• Greenery: eucalyptus, ferns, trailing ivy, succulents, or anything you love\n• Vase or container: mason jar, ceramic vase, clear glass, terracotta, or describe your own\n• Colors, style, size, occasion, where it will be displayed...\n\nThe more detail, the better — there are no wrong answers!"}
                        required
                      />
                      <ValidationError field="arrangement_description" errors={customForm.errors} className="field-error" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="custom-budget">Budget (optional)</label>
                      <input id="custom-budget" name="budget" className="form-input" placeholder="e.g. $50–$100, or no preference" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="custom-phone">Phone (optional)</label>
                      <input id="custom-phone" name="phone" className="form-input" placeholder="(352) 555-0100" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vase Substrate Preference</label>
                      <p className="substrate-note">Choose what you'd like inside your vase to hold your arrangement. You may select multiple. Carl will add it after shipping to protect your arrangement.</p>
                      <div className="substrate-grid">
                        {SUBSTRATE_OPTIONS.map((s) => (
                          <label key={s} className="substrate-option">
                            <input
                              type="checkbox"
                              name="substrate"
                              value={s}
                              checked={selectedSubstrate.includes(s)}
                              onChange={() => setSelectedSubstrate((prev) =>
                                prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                              )}
                            />
                            <span className="chip">{s}</span>
                          </label>
                        ))}
                      </div>
                      {selectedSubstrate.length > 0 && (
                        <input type="hidden" name="substrate_choices" value={selectedSubstrate.join(", ")} />
                      )}
                    </div>
                    <ValidationError errors={customForm.errors} className="field-error" />
                    <button type="submit" className="submit-btn" disabled={customForm.submitting}>
                      {customForm.submitting ? "Sending…" : "✦ Send My Vision to Carl"}
                    </button>
                    <p className="custom-request-note">🌸 Carl will reply within 24 hours with a personal quote. No commitment required.</p>
                  </form>
                </>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ── GENDER REVEAL ── */}
      <section id="gender-reveal" className="section section--white">
        <div className="section-header">
          <p className="eyebrow">✦ Celebrate New Life</p>
          <h2 className="section-title">Gender Reveal <em>Arrangements</em></h2>
          <p className="section-sub">A beautiful handcrafted floral arrangement to celebrate your little one. Carl will create a custom blue or pink design — just for you.</p>
        </div>
        <div className="gender-reveal-inner">

          {/* Gender choice cards */}
          <div className="gender-cards">
            <div
              className={`gender-card gender-card--boy ${genderChoice === "boy" ? "selected" : ""}`}
              onClick={() => setGenderChoice("boy")}
            >
              <div className="gender-card-icon">👶💙</div>
              <h3 className="gender-card-title">It's a Boy!</h3>
              <p className="gender-card-desc">A stunning arrangement of blue & white artificial florals — roses, delphiniums, hydrangeas, and lush greenery — handcrafted by Carl to celebrate your baby boy.</p>
              {genderChoice === "boy" && <div className="gender-selected-badge">✓ Selected</div>}
            </div>
            <div
              className={`gender-card gender-card--girl ${genderChoice === "girl" ? "selected" : ""}`}
              onClick={() => setGenderChoice("girl")}
            >
              <div className="gender-card-icon">👶🩷</div>
              <h3 className="gender-card-title">It's a Girl!</h3>
              <p className="gender-card-desc">A gorgeous arrangement of blush pink & soft cream artificial florals — peonies, roses, ranunculus, and delicate fillers — handcrafted by Carl to celebrate your baby girl.</p>
              {genderChoice === "girl" && <div className="gender-selected-badge">✓ Selected</div>}
            </div>
          </div>

          {/* Request form — shown after a choice is made */}
          {genderChoice && (
            <div className="gender-form-wrap">
              {genderForm.succeeded ? (
                <div className="success-msg">
                  <div className="success-icon">{genderChoice === "boy" ? "💙" : "🩷"}</div>
                  <h3>Request Received!</h3>
                  <p>Carl will review your details and send you a personal quote within 24 hours. Congratulations!</p>
                </div>
              ) : (
                <>
                  <div className="gender-form-header">
                    <h3>Customize Your <em>{genderChoice === "boy" ? "Boy" : "Girl"}</em> Arrangement</h3>
                    <p>Tell Carl the details and he'll send you a custom quote.</p>
                  </div>
                  <form onSubmit={handleGenderSubmit} className="booking-form">
                    <input type="hidden" name="request_type" value="Gender Reveal Arrangement" />
                    <input type="hidden" name="gender_choice" value={genderChoice === "boy" ? "Boy (Blue)" : "Girl (Pink)"} />
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="gr-name">Your Name</label>
                        <input id="gr-name" name="name" className="form-input" placeholder="Jane Smith" required />
                        <ValidationError field="name" errors={genderForm.errors} className="field-error" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="gr-email">Email</label>
                        <input id="gr-email" name="email" type="email" className="form-input" placeholder="jane@email.com" required />
                        <ValidationError field="email" errors={genderForm.errors} className="field-error" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="gr-phone">Phone (optional)</label>
                        <input id="gr-phone" name="phone" className="form-input" placeholder="(352) 555-0100" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="gr-date">Needed By (optional)</label>
                        <input id="gr-date" name="needed_by" type="date" className="form-input" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vase / Container Style</label>
                      <div className="gender-vase-grid">
                        {VASE_OPTIONS.map((v) => (
                          <label key={v.id} className="gender-vase-option">
                            <input type="radio" name="vase_choice" value={`${v.name} — ${v.sub}`} required />
                            <div className="gender-vase-card">
                              <span className="option-emoji">{v.emoji}</span>
                              <div className="option-name">{v.name}</div>
                              <div className="option-sub">{v.sub}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gr-size">Arrangement Size</label>
                      <div className="occasion-chips">
                        {["Small (tabletop)", "Medium (centerpiece)", "Large (statement piece)", "Extra Large"].map((s) => (
                          <label key={s} className="chip-radio">
                            <input type="radio" name="size" value={s} required style={{display:"none"}} />
                            <span className="chip">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gr-notes">Additional Details (optional)</label>
                      <textarea
                        id="gr-notes"
                        name="additional_details"
                        className="form-textarea"
                        placeholder="Any specific flowers, color shades, style preferences, where it will be displayed, budget range, or anything else Carl should know..."
                      />
                      <ValidationError field="additional_details" errors={genderForm.errors} className="field-error" />
                    </div>
                    <ValidationError errors={genderForm.errors} className="field-error" />
                    <button type="submit" className="submit-btn gender-submit" disabled={genderForm.submitting}
                      style={{background: genderChoice === "boy" ? "#5b8fc9" : "#d4789a"}}>
                      {genderForm.submitting ? "Sending…" : `✦ Request My ${genderChoice === "boy" ? "💙 Boy" : "🩷 Girl"} Arrangement Quote`}
                    </button>
                    <p className="custom-request-note">🌸 Carl will reply within 24 hours with a personal quote. No commitment required.</p>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── BRIDAL ── */}
      <section id="bridal" className="section section--tinted">
        <div className="section-header">
          <p className="eyebrow">✦ Forever Begins Here</p>
          <h2 className="section-title">Bridal <em>Collections</em></h2>
          <p className="section-sub">Handcrafted artificial arrangements that last long after the wedding day — bouquets, centerpieces & more, designed by Carl.</p>
        </div>
        <div className="builder-inner">
          <div className="builder-tabs">
            <button className={`builder-tab ${bridalTab === "preset" ? "active" : ""}`} onClick={() => setBridalTab("preset")}>✦ Preset Collections</button>
            <button className={`builder-tab ${bridalTab === "custom" ? "active" : ""}`} onClick={() => setBridalTab("custom")}>✍ Custom Bridal Request</button>
          </div>

          {bridalTab === "preset" && (
            <div className="portfolio-grid">
              {BRIDAL_ARRANGEMENTS.map((a) => (
                <div key={a.id} className="portfolio-card">
                  <div className="portfolio-img" style={{background: "linear-gradient(135deg, #fce8f2, #f8f0e8)"}}><span>{a.emoji}</span></div>
                  <div className="portfolio-info">
                    <h3 className="portfolio-name">{a.name}</h3>
                    <p className="portfolio-desc">{a.desc}</p>
                    <div className="portfolio-tags">{a.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                    <div className="portfolio-price">${a.price}</div>
                    <div className="card-btns">
                      <button className="add-to-cart" onClick={() => addToCart(a)}>Add to Cart</button>
                      <button className="buy-now" onClick={() => scrollTo("bridal") || setBridalTab("custom")}>Customize</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {bridalTab === "custom" && (
            <div className="custom-request">
              {bridalForm.succeeded ? (
                <div className="success-msg">
                  <div className="success-icon">💐</div>
                  <h3>Request Received!</h3>
                  <p>Carl will review your bridal vision and send a personal quote within 24 hours. Congratulations on your upcoming wedding!</p>
                </div>
              ) : (
                <>
                  <div className="custom-request-intro">
                    <p>Every wedding is unique. Describe your dream bridal arrangement and Carl will handcraft something truly one-of-a-kind — yours to keep forever.</p>
                  </div>
                  <form onSubmit={handleBridalSubmit} className="booking-form">
                    <input type="hidden" name="request_type" value="Custom Bridal Arrangement" />
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="br-name">Your Name</label>
                        <input id="br-name" name="name" className="form-input" placeholder="Jane Smith" required />
                        <ValidationError field="name" errors={bridalForm.errors} className="field-error" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="br-email">Email</label>
                        <input id="br-email" name="email" type="email" className="form-input" placeholder="jane@email.com" required />
                        <ValidationError field="email" errors={bridalForm.errors} className="field-error" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="br-phone">Phone (optional)</label>
                        <input id="br-phone" name="phone" className="form-input" placeholder="(352) 555-0100" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="br-date">Wedding Date</label>
                        <input id="br-date" name="wedding_date" type="date" className="form-input" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">What are you looking for?</label>
                      <div className="occasion-chips">
                        {["Bridal Bouquet","Bridesmaid Bouquets","Centerpieces","Ceremony Arch","Reception Décor","Flower Girl Basket","Boutonnieres","Full Package"].map((o) => (
                          <label key={o} className="chip-radio">
                            <input type="checkbox" name="bridal_items" value={o} style={{display:"none"}} />
                            <span className="chip">{o}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vase / Container Style</label>
                      <div className="gender-vase-grid">
                        {VASE_OPTIONS.map((v) => (
                          <label key={v.id} className="gender-vase-option">
                            <input type="radio" name="vase_choice" value={`${v.name} — ${v.sub}`} />
                            <div className="gender-vase-card">
                              <span className="option-emoji">{v.emoji}</span>
                              <div className="option-name">{v.name}</div>
                              <div className="option-sub">{v.sub}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="br-vision">Describe Your Bridal Vision</label>
                      <textarea id="br-vision" name="bridal_vision" className="form-textarea custom-textarea"
                        placeholder="Colors, flowers, style, theme, number of arrangements, budget range, inspiration photos you can describe..." />
                      <ValidationError field="bridal_vision" errors={bridalForm.errors} className="field-error" />
                    </div>
                    <ValidationError errors={bridalForm.errors} className="field-error" />
                    <button type="submit" className="submit-btn" disabled={bridalForm.submitting}>
                      {bridalForm.submitting ? "Sending…" : "✦ Send My Bridal Vision to Carl"}
                    </button>
                    <p className="custom-request-note">💐 Carl will reply within 24 hours with a personal quote. No commitment required.</p>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="booking" className="section section--tinted">
        <div className="section-header">
          <p className="eyebrow">✦ Work with Carl</p>
          <h2 className="section-title">Book a <em>Consultation</em></h2>
          <p className="section-sub">Have a vision? Let's talk. Carl personally designs every arrangement.</p>
        </div>
        <div className="booking-inner">
          {formState.succeeded ? (
            <div className="success-msg">
              <div className="success-icon">✿</div>
              <h3>Request Received!</h3>
              <p>Carl will be in touch within 24 hours. Thank you!</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <input type="hidden" name="occasion" value={bookingOccasion.join(", ")} />
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Your Name</label>
                  <input id="name" name="name" className="form-input" placeholder="Jane Smith" required />
                  <ValidationError field="name" errors={formState.errors} className="field-error" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" className="form-input" placeholder="jane@email.com" required />
                  <ValidationError field="email" errors={formState.errors} className="field-error" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone (optional)</label>
                  <input id="phone" name="phone" className="form-input" placeholder="(352) 555-0100" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="date">Preferred Date</label>
                  <input id="date" name="date" type="date" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Occasion</label>
                <div className="occasion-chips">
                  {OCCASIONS.map((o) => (
                    <button type="button" key={o}
                      className={`chip ${bookingOccasion.includes(o) ? "selected" : ""}`}
                      onClick={() => setBookingOccasion((oc) => oc.includes(o) ? oc.filter((x) => x !== o) : [...oc, o])}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="notes">Tell Carl about your vision</label>
                <textarea id="notes" name="notes" className="form-textarea" placeholder="Colors, size, style, where it will be displayed..." />
                <ValidationError field="notes" errors={formState.errors} className="field-error" />
              </div>
              <ValidationError errors={formState.errors} className="field-error" />
              <button type="submit" className="submit-btn" disabled={formState.submitting}>
                {formState.submitting ? "Sending…" : "✦ Send Consultation Request"}
              </button>
              <div className="shipping-disclaimer">
                <h4 className="disclaimer-title">✨ A Little Love Note About Your Arrangement</h4>
                <p className="shipping-free-note">🚚 <strong>Shipping is always free</strong> — because beautiful things should arrive at your door without any extra cost.</p>
                <p>Your flowers have traveled to reach you — here's how to help them settle in and truly shine:</p>
                <ul>
                  <li><strong>🌸 Give them a little fluff!</strong> Artificial blooms are adventurous travelers, but they may arrive a touch compressed from their journey. Simply take a moment to gently coax each petal and stem back to life — think of it as a welcome-home hug for your flowers. Allow <strong>48–72 hours</strong> for everything to gracefully fall into its full, breathtaking shape.</li>
                  <li><strong>💎 Your substrate arrives separately — by design!</strong> To keep your vessel safe and your blooms pristine during shipping, the vase filling (rocks, marbles, river stones, peat moss, etc.) is packed separately and added by you upon arrival. This little extra step protects your arrangement from shifting weight and ensures nothing gets damaged in transit. Think of it as the final, personal touch that makes it truly yours.</li>
                  <li><strong>📦 Unbox with intention!</strong> Open your package slowly and lovingly — avoid shaking or flipping the box. Your arrangement was packed with care and deserves a gentle, graceful grand entrance.</li>
                </ul>
                <p className="disclaimer-footer">✿ Questions about setup, care, or anything at all? Carl personally replies to every message — don't hesitate to reach out!</p>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className="footer">
        <h3>Florals <em>Forever</em></h3>
        <p>Handcrafted by Carl · Gainesville, Florida</p>
        <p className="footer-tagline">✿ Beauty that never fades ✿</p>
        <p className="footer-copy">© 2026 Florals Forever. All arrangements handmade with love.</p>
      </footer>

      {cartOpen && (
        <div className="modal-overlay" onClick={() => setCartOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Your Cart</h2>
              <button className="modal-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <p className="cart-empty">Your cart is empty. Browse the collection!</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.cartId} className="cart-item">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-right">
                        <span className="cart-item-price">${item.price}</span>
                        <button className="cart-remove" onClick={() => removeFromCart(item.cartId)}>✕</button>
                      </span>
                    </div>
                  ))}
                  <div className="cart-total">Total: ${cartTotal}</div>
                  <button className="submit-btn" onClick={handleCheckout} disabled={checkingOut}>
                    {checkingOut ? "Redirecting to Stripe…" : `✦ Pay Securely — $${cartTotal}`}
                  </button>
                  <p className="stripe-note">🔒 Secure checkout via Stripe. Accepts all major cards, Apple Pay & Google Pay.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
