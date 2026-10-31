import { FormEvent, useState } from "react";

const A = "/assets";

const productViews = [
  { position: "main", label: "Front of booster display" },
  { position: "right", label: "Side of booster display" },
  { position: "top", label: "Top of booster display" },
  { position: "cards", label: "Booster packs" },
  { position: "single", label: "Single booster pack" },
];

const relatedProducts = [
  { image: "6cd67.png", title: "Umbreon VMAX — Alternate Art", type: "POKÉMON · SINGLE CARD", tag: "Near Mint", crop: "umbreon" },
  { image: "7166f.png", title: "Pokémon Promo Card", type: "POKÉMON · PROMO CARD", tag: "Near Mint", crop: "promo" },
  { image: "2004f.png", title: "Charizard Graded Card", type: "POKÉMON · GRADED CARD", tag: "Graded Collectible", crop: "charizard" },
  { image: "76b93.png", title: "One Piece Trading Card", type: "ONE PIECE · SINGLE CARD", tag: "In Stock", crop: "onepiece" },
];

const detailGroups = [
  {
    title: "Card details",
    items: [
      ["Card type", "Booster Display"],
      ["Sub type", "Trading Cards"],
      ["Color", "Multicolor"],
      ["Card number", "erer435"],
      ["Set", "Festival Arena (BS12)"],
      ["Category", "CookieRun: Braverse TCG"],
      ["Card type", "Oct 2, 2026"],
    ],
  },
  {
    title: "Game stats",
    items: [
      ["Power / Toughness", "Not Applicable"],
      ["Mana cost", "Not Applicable"],
      ["Mana value", "Not Applicable"],
      ["Colors", "Blue Pink"],
      ["Color identity", "Multicolor"],
      ["Card types", "Product Display"],
      ["Creature types", "Not Applicable"],
      ["Keywords", "Festival Edition"],
      ["Frame", "Full Art"],
      ["Frame effects", "Holographic Foil"],
    ],
  },
  {
    title: "Card stats",
    items: [
      ["Element", "Water Light"],
      ["Cost", "12 Energy"],
      ["Job", "Collector Item"],
      ["Card category", "Booster Box"],
    ],
  },
];

const conditionDetails = [
  ["Near Mint (NM)", "Looks unplayed. Crisp corners and edges, clean surface, little to no wear."],
  ["Lightly Played (LP)", "Minor wear: light scratches or small edge and corner wear. Sleeve-and-play ready."],
  ["Moderately Played (MP)", "Noticeable wear: moderate scratches, border or corner wear, light whitening."],
  ["Heavily Played (HP)", "Significant wear: heavy scratches, creasing or whitening, but intact."],
  ["Damaged (DMG)", "Major flaws: bends, tears, water damage or writing. Sold as-is."],
];

function Asset({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return <img src={`${A}/${src}`} alt={alt} className={className} />;
}

function Arrow() {
  return <Asset src="0bbf3.svg" className="size-5" />;
}

function Header({ cartCount }: { cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cardsOpen, setCardsOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        <Asset src="5c413.svg" className="size-[18px]" />
        <span>Free Shipping on Orders Over $75</span>
        <i />
        <span className="hidden sm:inline">Authentic Products</span>
        <i className="hidden sm:block" />
        <span className="hidden md:inline">New Arrivals Weekly!</span>
      </div>
      <header className="site-header">
        <a href="#" aria-label="TCG Hitz home" className="logo">
          <Asset src="41460.png" alt="TCG Hitz" />
        </a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`}>
          <div className="nav-dropdown">
            <button onClick={() => setCardsOpen((value) => !value)} aria-expanded={cardsOpen}>
              Trading Cards <Asset src="d5f0b.svg" className={`chevron ${cardsOpen ? "rotate-180" : ""}`} />
            </button>
            {cardsOpen && (
              <div className="dropdown-menu">
                <a href="#related">Pokémon Cards</a>
                <a href="#details">Trading Cards</a>
                <a href="#related">Graded Cards</a>
              </div>
            )}
          </div>
          <a href="#related">Mystery Packs</a>
          <a href="#related">Graded Cards</a>
          <a href="#experience">Merchandise</a>
          <a href="#experience">Vending Machines</a>
        </nav>
        <div className="header-actions">
          <label className="search">
            <Asset src="a8617.svg" className="size-5" />
            <input aria-label="Search products" placeholder="Search cards, products ..." />
          </label>
          <button className="circle-button hidden sm:flex" aria-label="Account">
            <Asset src="09840.svg" className="size-5" />
          </button>
          <button className="circle-button cart-button" aria-label={`${cartCount} items in cart`}>
            <Asset src="3d10c.svg" className="size-6" />
            <span>{cartCount}</span>
          </button>
          <button className="mobile-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="section-heading">
      <div className="eyebrow"><Asset src="ad64c.svg" className="size-2" />{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function Gallery() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="gallery">
      <div className={`product-stage sprite-${productViews[selected].position}`}>
        <Asset src="c3004.png" alt={productViews[selected].label} />
        <button className="gallery-arrow left" onClick={() => setSelected((selected + productViews.length - 1) % productViews.length)} aria-label="Previous image">‹</button>
        <button className="gallery-arrow right" onClick={() => setSelected((selected + 1) % productViews.length)} aria-label="Next image">›</button>
      </div>
      <div className="thumbnails">
        {productViews.map((view, index) => (
          <button key={view.position} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} aria-label={`View ${view.label}`}>
            <span className={`thumb-sprite sprite-${view.position}`}><Asset src="c3004.png" alt="" /></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="mini-feature">
      <Asset src="0ce2d.svg" className="corner top" />
      <strong>{title}</strong>
      <span>{text}</span>
      <Asset src="dfae0.svg" className="corner bottom" />
    </div>
  );
}

function ProductInfo({ onAdd }: { onAdd: (quantity: number) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const add = () => {
    onAdd(quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  return (
    <div className="product-info">
      <div className="product-heading">
        <span className="pill pink">Festival Arena · erer435</span>
        <h1>Festival Arena Booster Display [BS12]</h1>
        <span className="sealed"><Asset src="c265b.svg" className="size-[18px]" />Sealed</span>
        <div className="price-row"><strong>$30.00</strong><span><Asset src="40a4f.svg" className="size-[18px]" />Only 1 Left</span></div>
        <div className="selection"><span>CONDITION &amp; LANGUAGE &amp; PRINTING</span><p>Selected: <b>Unopened / English / New</b></p></div>
      </div>
      <div className="variant-card"><div><strong>Unopened <small>· English · New</small></strong><span>Only 1 left</span></div><b>$30.00</b></div>
      <div className="purchase">
        <div className="buy-row">
          <div className="quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Asset src="1f7d5.svg" /></button>
            <span>{String(quantity).padStart(2, "0")}</span>
            <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Asset src="f61ee.svg" /></button>
          </div>
          <button className="button button-orange" onClick={add}><Asset src="5b056.svg" className="size-[22px]" />{added ? "Added to Cart" : "Add to Cart"}</button>
        </div>
        <button className="button button-blue" onClick={add}>Buy Now <Asset src="4e907.svg" className="size-5" /></button>
        <p>Have this card? <a href="#footer">Sell it to us →</a></p>
      </div>
      <div className="trust-row">
        <span><Asset src="90f7f.svg" />Secure Checkout</span>
        <span><Asset src="54bcc.png" />Fast Shipping</span>
        <span><Asset src="829a8.svg" />Verified Authenticity</span>
      </div>
      <div className="mini-features">
        <FeatureCard title="Ships in 1 day" text="Rigid sleeve + mailer" />
        <FeatureCard title="Real photos" text="The exact card shown" />
        <FeatureCard title="Fair returns" text="Not as described? Refund" />
      </div>
      <div className="variant-card card-text"><div><span>CARD TEXT</span><strong>dsfdsfdsfdsfdsf</strong></div></div>
      <Details />
    </div>
  );
}

function Details() {
  const [identifiersOpen, setIdentifiersOpen] = useState(false);
  const [conditionsOpen, setConditionsOpen] = useState(true);
  return (
    <div id="details" className="details">
      {detailGroups.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          <div className="neon-rule"><Asset src="2487b.svg" /><i /></div>
          <dl>
            {group.items.map(([label, value]) => <div key={`${group.title}-${label}-${value}`}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </section>
      ))}
      <button className="accordion-trigger" onClick={() => setIdentifiersOpen((value) => !value)}>
        Identifiers <Asset src="d5f0b.svg" className={identifiersOpen ? "rotate-180" : ""} />
      </button>
      {identifiersOpen && <div className="accordion-copy">BS12 · Festival Arena · Factory sealed booster display</div>}
      <div className="conditions">
        <Asset src="0ce2d.svg" className="corner top" />
        <button onClick={() => setConditionsOpen((value) => !value)}>What do the conditions mean?<Asset src="69945.svg" className={conditionsOpen ? "rotate-180" : ""} /></button>
        {conditionsOpen && <div>{conditionDetails.map(([title, text]) => <p key={title}><strong>{title}</strong><span>{text}</span></p>)}</div>}
        <Asset src="dfae0.svg" className="corner bottom" />
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: (typeof relatedProducts)[number] }) {
  const [favorite, setFavorite] = useState(false);
  return (
    <article className="related-card">
      <div className="related-image">
        <span className={`pill ${product.tag === "In Stock" ? "green" : product.tag === "Graded Collectible" ? "red" : "pink"}`}>{product.tag}</span>
        <button className={favorite ? "favorite active" : "favorite"} onClick={() => setFavorite(!favorite)} aria-label="Toggle favorite">♥</button>
        <div className={`related-crop ${product.crop}`}><Asset src={product.image} alt={product.title} /></div>
      </div>
      <div className="related-copy"><small>{product.type}</small><h3>{product.title}</h3><strong>$24.00</strong></div>
      <div className="card-actions"><button className="button button-blue">View Product <Asset src="133ba.svg" /></button><button className="circle-button"><Asset src="7c474.svg" /></button></div>
    </article>
  );
}

function Newsletter() {
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("You’re on the list.");
  };
  return (
    <section className="newsletter">
      <div className="newsletter-art"><Asset src="606f0.png" alt="Colorful Pokémon trading cards" /></div>
      <div>
        <SectionHeading eyebrow="Get Started" title="JOIN THE TCG HITZ COMMUNITY." description="Get updates on new arrivals, collectible drops, and store news." />
        <form onSubmit={submit}><input required type="email" aria-label="Email address" placeholder="Type your email address ..." /><button className="button button-orange">Subscribe</button></form>
        {message && <p className="form-message" role="status">{message}</p>}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer">
      <div className="footer-grid">
        <div className="footer-brand"><Asset src="41460.png" alt="TCG Hitz" /><p>Trading cards, collectibles, merchandise, and vending machines—all in one place.</p><div className="socials">{["f", "p", "▶", "◎"].map((icon) => <a href="#" key={icon}>{icon}</a>)}</div></div>
        <div><h3>SHOP</h3><a href="#">Trading Cards</a><a href="#">Mystery Packs</a><a href="#">Graded Cards</a><a href="#">Merchandise</a></div>
        <div><h3>MACHINES</h3><a href="#">Vending Machines</a><a href="#">Browse Machines</a><a href="#">Machine Information</a></div>
        <div><h3>HELP</h3><a href="#">Sell to Us</a><a href="#">Contact Us</a><a href="#">Shipping Policy</a><a href="#">Returns &amp; Refunds</a><a href="#">FAQs</a></div>
        <div className="contact"><h3>Our Contact</h3><p><Asset src="37cac.svg" />+1 208-620-7749</p><p><Asset src="8171b.svg" />admin@tcghitz.com</p><p><Asset src="4b263.svg" />Skate Plaza in Coeur d’Alene, Idaho</p></div>
      </div>
      <div className="copyright"><span>© 2026 TCG HITZ. All rights reserved.</span><span>Terms | Privacy | Cookies Policy</span></div>
    </footer>
  );
}

export default function App() {
  const [cartCount, setCartCount] = useState(3);
  return (
    <div className="page-shell">
      <Header cartCount={cartCount} />
      <main>
        <div className="breadcrumbs">Home / Trading Cards / Pokémon / Festival Arena / <strong>Festival Arena Booster Display [BS12]</strong></div>
        <section className="product-layout">
          <Gallery />
          <ProductInfo onAdd={(quantity) => setCartCount((count) => count + quantity)} />
        </section>
        <section id="related" className="related section-wrap">
          <div className="section-title-row"><SectionHeading eyebrow="Related Products" title="YOU MIGHT ALSO LIKE." description="Discover more cards and collectibles to explore." /><button className="outline-button">View All Products <Arrow /></button></div>
          <div className="related-grid">{relatedProducts.map((product) => <RelatedCard key={product.title} product={product} />)}</div>
        </section>
        <section id="experience" className="experience section-wrap">
          <SectionHeading eyebrow="The TCG Hitz Experience" title="WHY SHOP TCG HITZ?" description="From trading cards to collectibles and vending machines, explore more of what makes collecting exciting." />
          <div className="experience-grid">
            {[["e177e.svg", "A WORLD OF COLLECTIBLES", "Explore trading cards, mystery packs, graded cards, and merchandise in one place."], ["73a54.svg", "DISCOVER SOMETHING NEW", "Browse collectible finds and explore products that could become your next favorite addition."], ["1d40b.svg", "BEYOND THE CARDS", "Explore trading-card vending machines alongside the store's collectible products."]].map(([icon, title, text]) => (
              <article key={title}><span><Asset src={icon} /></span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </section>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
