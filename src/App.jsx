import { useState } from "react";
import "./App.css";

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION — fill these in before publishing
// ─────────────────────────────────────────────────────────────────
// 1. STRIPE: Sign up at https://stripe.com → Developers → API Keys
//    Copy your "Publishable key" and paste it below.
const STRIPE_PUBLISHABLE_KEY = "pk_live_REPLACE_WITH_YOUR_STRIPE_KEY";

// 2. FORMSPREE: Sign up at https://formspree.io → New Form
//    Copy your form endpoint (looks like https://formspree.io/f/abcdefgh)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";
// ─────────────────────────────────────────────────────────────────

const ARRANGEMENTS = [
  { id: 1, emoji: "🌸", name: "Blushing Garden", desc: "Soft roses, baby's breath & eucalyptus in a vintage mason jar. Perfect for gifting.", price: 62, tags: ["Gift", "Home Décor"] },
  { id: 2, emoji: "🌺", name: "Coral Sunrise", desc: "Bold focal blooms with lush greenery in a modern matte vase. A statement piece.", price: 88, tags: ["Home Décor", "Offices"] },
  { id: 3, emoji: "💐", name: "Bridal Bouquet", desc: "Classic whites and creams with cascading silk ribbon — yours forever.", price: 116, tags: ["Weddings", "Gift"] },
  { id: 4, emoji: "🌿", name: "Woodland Serenity", desc: "Artisan greenery, dried botanicals, and fillers for a rustic, earthy look.", price: 70, tags: ["Home Décor", "Offices"] },
  { id: 5, emoji: "🌷", name: "Sweetheart Tulips", desc: "Vibrant tulips in a terracotta pot. Timeless anniversary or birthday gift.", price: 52, tags: ["Gift", "Anniversary"] },
  { id: 6, emoji: "🌻", name: "Golden Hour", desc: "Sunflowers, wildflowers, and golden accents that bring joy to any room.", price: 74, tags: ["Home Décor", "Gift"] },
];

const FOCAL_OPTIONS = [
  { id: "rose",      emoji: "🌹", name: "Roses",      sub: "Classic & timeless",  price: 16 },
  { id: "peony",     emoji: "🌸", name: "Peonies",    sub: "Full & romantic",     price: 20 },
  { id: "lily",      emoji: "🌺", name: "Lilies",     sub: "Bold & dramatic",     price: 18 },
  { id: "tulip",     emoji: "🌷", name: "Tulips",     sub: "Elegant & simple",    price: 14 },
  { id: "sunflower", emoji: "🌻", name: "Sunflowers", sub: "Bright & cheerful",   price: 13 },
  { id: "orchid",    emoji: "🪷", name: "Orchids",    sub: "Exotic & refined",    price: 22 },
];
const FILLER_OPTIONS = [
  { id: "babysbreath", emoji: "🤍", name: "Baby's Breath",   sub: "Soft & airy",         price: 6  },
  { id: "lavender",    emoji: "💜", name: "Lavender Sprigs", sub: "Fragrant feel",        price: 8  },
  { id: "wildflower",  emoji: "🌼", name: "Wildflowers",     sub: "Garden fresh",         price: 7  },
  { id: "statice",     emoji: "🫐", name: "Statice",         sub: "Purple cloud effect",  price: 6  },
];
const GREENERY_OPTIONS = [
  { id: "eucalyptus", emoji: "🌿", name: "Eucalyptus",   sub: "Fresh & modern",      price: 8 },
  { id: "fern",       emoji: "🍃", name: "Fern Fronds",  sub: "Lush & traditional",  price: 6  },
  { id: "ivy",        emoji: "🌱", name: "Trailing Ivy", sub: "Cascading effect",     price: 7  },
  { id: "succulent",  emoji: "🪴", name: "Succulents",   sub: "Sculptural accent",    price: 10 },
];
const VASE_OPTIONS = [
  { id: "mason",      emoji: "🫙", name: "Mason Jar",      sub: "Rustic charm",       price: 12 },
  { id: "ceramic",    emoji: "🏺", name: "Ceramic Vase",   sub: "Artisan crafted",    price: 20 },
  { id: "glass",      emoji: "🫗", name: "Clear Glass",    sub: "Timeless & clean",   price: 14 },
  { id: "terracotta", emoji: "🪣", name: "Terracotta Pot", sub: "Earthy & warm",      price: 16 },
];

const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Home Décor", "Business / Office", "Sympathy", "Just Because", "Holiday"];

const BUILDER_STEPS = ["Focal Flower", "Filler", "Greenery", "Vase"];
const BUILDER_DATA  = [FOCAL_OPTIONS, FILLER_OPTIONS, GREENERY_OPTIONS, VASE_OPTIONS];
const BUILDER_KEYS  = ["focal", "filler", "greenery", "vase"];

export default function App() {
  const [cart, setCart]                       = useState([]);
  const [cartOpen, setCartOpen]               = useState(false);
  const [toast, setToast]                     = useState(null);
  const [checkingOut, setCheckingOut]         = useState(false);
  const [builderStep, setBuilderStep]         = useState(0);
  const [builderSel, setBuilderSel]           = useState({ focal: null, filler: null, greenery: null, vase: null });
  const [bookingForm, setBookingForm]         = useState({ name: "", email: "", phone: "", date: "", notes: "" });
  const [bookingOccasion, setBookingOccasion] = useState([]);
  const [bookingDone, setBookingDone]         = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const addToCart = (item) => {
    setCart((c) => [...c, { ...item, cartId: Date.now() + Math.random() }]);
    showToast(`✿ "${item.name}" added to your order`);
  };

  const removeFromCart = (cartId) => setCart((c) => c.filter((i) => i.cartId !== cartId));
  const cartTotal = cart.reduce((s, i) => s + i.price, 0);

  // ── STRIPE CHECKOUT ──
  // This redirects the customer to Stripe's secure hosted checkout page.
  // To make this fully functional you need to:
  //   1. Replace STRIPE_PUBLISHABLE_KEY at the top of this file
  //   2. Set up a small backend (e.g. a Vercel serverless function) that
  //      creates a Stripe Checkout Session and returns its URL.
  //   Until then, clicking "Pay" will show a setup reminder.
  const handleCheckout = async () => {
    if (STRIPE_PUBLISHABLE_KEY.includes("REPLACE")) {
      alert("💳 Stripe is not set up yet.\n\nTo accept payments:\n1. Sign up at stripe.com\n2. Paste your Publishable Key into App.jsx\n3. Follow the README for the serverless function setup.");
      return;
    }
    setCheckingOut(true);
    try {
      // Call your Vercel serverless function (see /api/checkout.js in README)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      alert("Something went wrong. Please try again.");
      setCheckingOut(false);
    }
  };

  const builderPrice = BUILDER_KEYS.reduce((s, k, i) => {
    const found = BUILDER_DATA[i].find((o) => o.id === builderSel[k]);
    return s + (found ? found.price : 0);
  }, 35);

  const addCustomToCart = () => {
    const focal = FOCAL_OPTIONS.find((o) => o.id === builderSel.focal);
    const vase  = VASE_OPTIONS.find((o) => o.id === builderSel.vase);
    addToCart({ name: `Custom Arrangement (${focal?.name ?? "—"}, ${vase?.name ?? "—"})`, price: builderPrice });
    setBuilderStep(0);
    setBuilderSel({ focal: null, filler: null, greenery: null, vase: null });
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ── FORMSPREE BOOKING ──
  // Submits the consultation form to Formspree, which emails YOU and
  // logs every submission to a Google Sheet.
  // To activate: replace FORMSPREE_ENDPOINT at the top of this file.
  const handleBooking = async (e) => {
    e.preventDefault();
    const payload = {
      ...bookingForm,
      occasion: bookingOccasion.join(", "),
    };
    if (FORMSPREE_ENDPOINT.includes("REPLACE")) {
      // Dev mode — just show success without actually submitting
      setBookingDone(true);
      showToast("✿ Consultation request sent to Carl!");
      return;
    }
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setBookingDone(true);
        showToast("✿ Consultation request sent to Carl!");
      } else {
        alert("Something went wrong sending your request. Please try again.");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="app">
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">Florals <em>Forever</em></div>
        <ul className="nav-links">
          {[["home","Home"],["portfolio","Shop"],["builder","Custom Builder"],["booking","Book Consultation"]].map(([id, label]) => (
            <li key={id}><button onClick={() => scrollTo(id)}>{label}</button></li>
          ))}
        </ul>
        <button className="nav-cart" onClick={() => setCartOpen(true)}>
          🛒 Order ({cart.length})
        </button>
      </nav>

      {/* ── HERO ── */}
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

      {/* ── PORTFOLIO ── */}
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
                <button className="add-to-cart" onClick={() => addToCart(a)}>Add to Order</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CUSTOM BUILDER ── */}
      <section id="builder" className="section section--tinted">
        <div className="section-header">
          <p className="eyebrow">✦ Design Studio</p>
          <h2 className="section-title">Build Your <em>Custom</em> Arrangement</h2>
          <p className="section-sub">Pick each element and Carl will bring your vision to life.</p>
        </div>
        <div className="builder-inner">
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
              <div className="options-grid">
                {BUILDER_DATA[builderStep].map((opt) => (
                  <div
                    key={opt.id}
                    className={`option-card ${builderSel[BUILDER_KEYS[builderStep]] === opt.id ? "selected" : ""}`}
                    onClick={() => setBuilderSel((b) => ({ ...b, [BUILDER_KEYS[builderStep]]: opt.id }))}
                  >
                    <span className="option-emoji">{opt.emoji}</span>
                    <div className="option-name">{opt.name}</div>
                    <div className="option-sub">{opt.sub}</div>
                    <div className="option-price">+${opt.price}</div>
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
                      <span>{sel.emoji} {sel.name} (+${sel.price})</span>
                    </div>
                  ) : null;
                })}
                <div className="summary-row"><span>Base price</span><span>$35</span></div>
                <div className="summary-total"><span>Total</span><span>${builderPrice}</span></div>
              </div>
              <div className="builder-nav">
                <button className="btn-outline" onClick={() => setBuilderStep(0)}>Start Over</button>
                <button className="btn-primary" onClick={addCustomToCart}>Add to Order</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="booking" className="section section--white">
        <div className="section-header">
          <p className="eyebrow">✦ Work with Carl</p>
          <h2 className="section-title">Book a <em>Consultation</em></h2>
          <p className="section-sub">Have a vision? Let's talk. Carl personally designs every arrangement.</p>
        </div>
        <div className="booking-inner">
          {bookingDone ? (
            <div className="success-msg">
              <div className="success-icon">✿</div>
              <h3>Request Received!</h3>
              <p>Carl will be in touch within 24 hours. Thank you!</p>
              <button className="btn-primary" onClick={() => setBookingDone(false)}>Submit Another</button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" placeholder="Jane Smith" value={bookingForm.name} onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="jane@email.com" value={bookingForm.email} onChange={(e) => setBookingForm((f) => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone (optional)</label>
                  <input className="form-input" placeholder="(352) 555-0100" value={bookingForm.phone} onChange={(e) => setBookingForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input className="form-input" type="date" value={bookingForm.date} onChange={(e) => setBookingForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Occasion</label>
                <div className="occasion-chips">
                  {OCCASIONS.map((o) => (
                    <button type="button" key={o} className={`chip ${bookingOccasion.includes(o) ? "selected" : ""}`}
                      onClick={() => setBookingOccasion((oc) => oc.includes(o) ? oc.filter((x) => x !== o) : [...oc, o])}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tell Carl about your vision</label>
                <textarea className="form-textarea" placeholder="Colors, size, style, where it will be displayed..." value={bookingForm.notes} onChange={(e) => setBookingForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <button type="submit" className="submit-btn">✦ Send Consultation Request</button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <h3>Florals <em>Forever</em></h3>
        <p>Handcrafted by Carl · Gainesville, Florida</p>
        <p className="footer-tagline">✿ Beauty that never fades ✿</p>
        <p className="footer-copy">© 2026 Florals Forever. All arrangements handmade with love.</p>
      </footer>

      {/* ── CART MODAL ── */}
      {cartOpen && (
        <div className="modal-overlay" onClick={() => setCartOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Your Order</h2>
              <button className="modal-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <p className="cart-empty">Your order is empty. Browse the collection!</p>
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
                    {checkingOut ? "Redirecting to payment…" : `✦ Pay Securely — $${cartTotal}`}
                  </button>
                  <p className="stripe-note">🔒 Secure checkout powered by Stripe. Accepts all major cards, Apple Pay & Google Pay.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
