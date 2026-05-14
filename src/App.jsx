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
  { id: "succulent",  emoji: "🪴", name: "Succulents",   sub: "Sculptural accent",  price: 10, stripeLink: "https://buy.stripe.com/aFa7sL4mce2v6XWcRX9sk0l" },
];
const VASE_OPTIONS = [
  { id: "mason",      emoji: "🫙", name: "Mason Jar",      sub: "Rustic charm",     price: 12, stripeLink: "https://buy.stripe.com/bJebJ14mc2jNcig9FL9sk0m" },
  { id: "ceramic",    emoji: "🏺", name: "Ceramic Vase",   sub: "Artisan crafted",  price: 20, stripeLink: "https://buy.stripe.com/6oUaEX7yoaQj9644lr9sk0n" },
  { id: "glass",      emoji: "🫗", name: "Clear Glass",    sub: "Timeless & clean", price: 14, stripeLink: "https://buy.stripe.com/3cI00j4mc8Ib820cRX9sk0o" },
  { id: "terracotta", emoji: "🪣", name: "Terracotta Pot", sub: "Earthy & warm",    price: 16, stripeLink: "https://buy.stripe.com/5kQ4gz9Gw3nR820bNT9sk0p" },
];

const OCCASIONS = ["Birthday", "Anniversary", "Wedding", "Home Décor", "Business / Office", "Sympathy", "Just Because", "Holiday"];

const BUILDER_STEPS = ["Focal Flower", "Filler", "Greenery", "Vase"];
const BUILDER_DATA  = [FOCAL_OPTIONS, FILLER_OPTIONS, GREENERY_OPTIONS, VASE_OPTIONS];
const BUILDER_KEYS  = ["focal", "filler", "greenery", "vase"];

export default function App() {
  const [toast, setToast]                     = useState(null);
  const [builderStep, setBuilderStep]         = useState(0);
  const [builderSel, setBuilderSel]           = useState({ focal: null, filler: null, greenery: null, vase: null });
  const [bookingOccasion, setBookingOccasion] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ── STRIPE PAYMENT LINKS ──
  // Each item has its own Stripe Payment Link — clicking Buy Now
  // sends the customer directly to Stripe's hosted checkout page.
  const buyNow = (item) => {
    if (item.stripeLink) {
      window.location.href = item.stripeLink;
    } else {
      alert("Payment link coming soon for this item! Please use the Book a Consultation form to order.");
    }
  };

  const builderPrice = BUILDER_KEYS.reduce((s, k, i) => {
    const found = BUILDER_DATA[i].find((o) => o.id === builderSel[k]);
    return s + (found ? found.price : 0);
  }, 35);

  const buyCustom = () => {
    const vase = VASE_OPTIONS.find((o) => o.id === builderSel.vase);
    if (vase?.stripeLink) {
      window.location.href = vase.stripeLink;
    } else {
      alert("Please use the Book a Consultation form to complete your custom order and Carl will be in touch!");
    }
    setBuilderStep(0);
    setBuilderSel({ focal: null, filler: null, greenery: null, vase: null });
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ── FORMSPREE (React hook) ──
  const [formState, handleBookingSubmit] = useForm("xpqbelga");

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
                <button className="add-to-cart" onClick={() => buyNow(a)}>Buy Now — ${a.price}</button>
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
                <button className="btn-primary" onClick={buyCustom}>Buy Now — ${builderPrice}</button>
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
          {formState.succeeded ? (
            <div className="success-msg">
              <div className="success-icon">✿</div>
              <h3>Request Received!</h3>
              <p>Carl will be in touch within 24 hours. Thank you!</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="booking-form">
              {/* Hidden field: passes selected occasion chips as a single value */}
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
              {/* Shows any top-level Formspree errors (e.g. network issues) */}
              <ValidationError errors={formState.errors} className="field-error" />
              <button type="submit" className="submit-btn" disabled={formState.submitting}>
                {formState.submitting ? "Sending…" : "✦ Send Consultation Request"}
              </button>
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

      {/* ── TOAST ── */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
