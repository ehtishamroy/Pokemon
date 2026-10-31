import { FormEvent, useMemo, useState } from "react"

const A = "/assets"

type Product = {
  name: string
  category: string
  image: string
  badge: string
  badgeColor: string
}

const products: Product[] = [
  {
    name: "Umbreon VMAX · Alternate Art",
    category: "POKÉMON · SINGLE CARD",
    image: "6cd67.png",
    badge: "Near Mint",
    badgeColor: "#ec4899",
  },
  {
    name: "Pokémon Elite Trainer Box",
    category: "POKÉMON · SEALED",
    image: "3c7e1.png",
    badge: "In Stock",
    badgeColor: "#22c55e",
  },
  {
    name: "Umbreon Collectible Figure",
    category: "COLLECTIBLE FIGURE",
    image: "c1e90.png",
    badge: "Fan Favorite",
    badgeColor: "#38bdf8",
  },
  {
    name: "TCG HITZ Mystery Pack",
    category: "MYSTERY PRODUCTS",
    image: "46815.png",
    badge: "In Stock",
    badgeColor: "#22c55e",
  },
  {
    name: "Electric-Type Character Figure",
    category: "COLLECTIBLE FIGURE",
    image: "c1e90.png",
    badge: "Fan Favorite",
    badgeColor: "#38bdf8",
  },
  {
    name: "Charizard Graded Card",
    category: "POKÉMON · GRADED CARD",
    image: "2004f.png",
    badge: "Graded",
    badgeColor: "#ef4444",
  },
  {
    name: "Pokémon Promo Card",
    category: "POKÉMON · SINGLE CARD",
    image: "7166f.png",
    badge: "Near Mint",
    badgeColor: "#ec4899",
  },
  {
    name: "Trading Card Protection Bundle",
    category: "ACCESSORIES",
    image: "36a15.png",
    badge: "In Stock",
    badgeColor: "#22c55e",
  },
  {
    name: "Pokémon Booster Box",
    category: "POKÉMON · SEALED",
    image: "32c3e.png",
    badge: "In Stock",
    badgeColor: "#22c55e",
  },
  {
    name: "Ghost-Type Collection",
    category: "COLLECTIBLE FIGURE",
    image: "c1e90.png",
    badge: "Fan Favorite",
    badgeColor: "#38bdf8",
  },
  {
    name: "Rare One Piece Card",
    category: "ONE PIECE · SINGLE CARD",
    image: "76b93.png",
    badge: "Near Mint",
    badgeColor: "#ec4899",
  },
  {
    name: "TCG HITZ Mystery Pack",
    category: "MYSTERY PRODUCTS",
    image: "46815.png",
    badge: "In Stock",
    badgeColor: "#22c55e",
  },
  {
    name: "Pokémon Booster Box",
    category: "POKÉMON · SEALED",
    image: "3c7e1.png",
    badge: "In Stock",
    badgeColor: "#22c55e",
  },
  {
    name: "Umbreon VMAX · Alternate Art",
    category: "POKÉMON · SINGLE CARD",
    image: "6cd67.png",
    badge: "Near Mint",
    badgeColor: "#ec4899",
  },
  {
    name: "Charizard Graded Card",
    category: "POKÉMON · GRADED CARD",
    image: "2004f.png",
    badge: "Graded",
    badgeColor: "#ef4444",
  },
  {
    name: "Trading Card Protection Bundle",
    category: "ACCESSORIES",
    image: "36a15.png",
    badge: "In Stock",
    badgeColor: "#22c55e",
  },
]

const categories = [
  ["ALL PRODUCTS", "1d2aa.svg"],
  ["POKÉMON CARDS", "11225.svg"],
  ["MYSTERY PACKS", "911c4.svg"],
  ["GRADED CARDS", "b22aa.svg"],
  ["MERCHANDISE", "a22c2.svg"],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function ProductCard({
  product,
  favorite,
  onFavorite,
  onCart,
}: {
  product: Product
  favorite: boolean
  onFavorite: () => void
  onCart: () => void
}) {
  return (
    <article className="product-card">
      <div className="product-visual">
        <div className="product-meta">
          <span className="badge" style={{ background: product.badgeColor }}>
            {product.badge}
          </span>
          <button
            className={`heart ${favorite ? "is-favorite" : ""}`}
            onClick={onFavorite}
            aria-label={`Favorite ${product.name}`}
          >
            {favorite ? "♥" : "♡"}
          </button>
        </div>
        <img src={`${A}/${product.image}`} alt="" />
      </div>
      <div className="product-copy">
        <div>
          <p className="eyebrow">{product.category}</p>
          <h3>{product.name}</h3>
        </div>
        <strong className="price">$24.00</strong>
        <div className="product-actions">
          <button className="view-button">
            VIEW PRODUCT <Arrow />
          </button>
          <button
            className="cart-button"
            onClick={onCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <img src={`${A}/7c474.svg`} alt="" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("ALL PRODUCTS")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cartCount, setCartCount] = useState(0)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const visibleProducts = useMemo(() => {
    let result = products
    if (activeCategory === "POKÉMON CARDS")
      result = products.filter((p) => p.category.includes("POKÉMON"))
    if (activeCategory === "MYSTERY PACKS")
      result = products.filter((p) => p.category.includes("MYSTERY"))
    if (activeCategory === "GRADED CARDS")
      result = products.filter((p) => p.category.includes("GRADED"))
    if (activeCategory === "MERCHANDISE")
      result = products.filter(
        (p) =>
          p.category.includes("FIGURE") || p.category.includes("ACCESSORIES"),
      )
    if (query.trim())
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      )
    return result
  }, [activeCategory, query])

  function toggleFavorite(name: string) {
    setFavorites((current) => {
      const next = new Set(current)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  function submitNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        FREE SHIPPING ON ORDERS OVER $75 <span>•</span> AUTHENTIC PRODUCTS{" "}
        <span>•</span> NEW ARRIVALS WEEKLY!
      </div>
      <header className="header">
        <a className="brand" href="#top" aria-label="TCG Hitz home">
          <img src={`${A}/41460.png`} alt="TCG Hitz" />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            Trading Cards <span>⌄</span>
          </button>
          <a href="#products">Mystery Packs</a>
          <a href="#products">Graded Cards</a>
          <a href="#products">Merchandise</a>
          <a href="#community">Vending Machines</a>
          {menuOpen && (
            <div className="nav-menu">
              <a href="#products">Pokémon Cards</a>
              <a href="#products">Trading Cards</a>
              <a href="#products">Graded Cards</a>
            </div>
          )}
        </nav>
        <div className="header-tools">
          <label className="search">
            <img src={`${A}/a8617.svg`} alt="" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
            />
          </label>
          <button className="tool" aria-label="Favorites">
            ♡<span>{favorites.size}</span>
          </button>
          <button className="tool" aria-label="Cart">
            <img src={`${A}/3d10c.svg`} alt="" />
            <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <p className="breadcrumb">
            Home / <strong>Shop All</strong>
          </p>
          <h1>
            FIND YOUR NEXT <span>FAVORITE</span>.
          </h1>
          <p>
            Explore trading cards, collectibles, and more. Discover something
            new for your collection and find your next favorite addition.
          </p>
        </section>

        <div className="ticker-small">
          COLLECT&nbsp; ✦ &nbsp;TRADE&nbsp; ✦ &nbsp;RIP&nbsp; ✦ &nbsp;REPEAT
        </div>
        <div className="ticker">
          {[
            "POKÉMON CARDS",
            "MYSTERY PACKS",
            "GRADED CARDS",
            "MERCHANDISE",
            "VENDING MACHINES",
          ].map((item) => (
            <span key={item}>
              {item}
              <i>●</i>
            </span>
          ))}
        </div>

        <section className="catalog" id="products">
          <div className="section-heading">
            <h2>EXPLORE THE COLLECTION</h2>
            <p>Find the cards and collectibles you're looking for.</p>
          </div>
          <div className="category-tabs">
            {categories.map(([name, icon]) => (
              <button
                key={name}
                className={activeCategory === name ? "active" : ""}
                onClick={() => {
                  setActiveCategory(name)
                  setPage(1)
                }}
              >
                <img src={`${A}/${icon}`} alt="" />
                {name}
              </button>
            ))}
          </div>
          <div className="catalog-tools">
            <button
              className="filter-button"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <img src={`${A}/2088e.png`} alt="" /> FILTERS
            </button>
            <label>
              SORT BY
              <select aria-label="Sort products">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Newest</option>
              </select>
            </label>
          </div>
          {filterOpen && (
            <div className="filter-panel">
              <strong>FILTER & SORT</strong>
              {["In Stock", "Near Mint", "Pokémon", "Mystery Packs"].map(
                (filter) => (
                  <label key={filter}>
                    <input type="checkbox" /> {filter}
                  </label>
                ),
              )}
              <button onClick={() => setFilterOpen(false)}>
                APPLY FILTERS
              </button>
            </div>
          )}
          <div className="product-grid">
            {visibleProducts
              .slice((page - 1) * 8, page * 8)
              .map((product, index) => (
                <ProductCard
                  key={`${product.name}-${index}`}
                  product={product}
                  favorite={favorites.has(product.name)}
                  onFavorite={() => toggleFavorite(product.name)}
                  onCart={() => setCartCount((count) => count + 1)}
                />
              ))}
          </div>
          {visibleProducts.length === 0 && (
            <p className="empty">No products match your search.</p>
          )}
          <div className="pagination" aria-label="Pagination">
            {[1, 2].map((number) => (
              <button
                key={number}
                className={page === number ? "active" : ""}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </section>

        <section className="rare-banner">
          <img src={`${A}/0d27c.png`} alt="" />
          <div>
            <p className="kicker">● THE THRILL OF THE UNKNOWN</p>
            <h2>CHASE YOUR NEXT RARE FIND.</h2>
            <p>
              Every collection has room for another surprise. Explore TCG HITZ
              mystery packs and discover your next collectible addition.
            </p>
            <div className="banner-actions">
              <button>
                SHOP MYSTERY PACKS <Arrow />
              </button>
              <button>
                EXPLORE ALL COLLECTIBLES <Arrow />
              </button>
            </div>
          </div>
        </section>

        <section className="why">
          <h2>WHY SHOP TCG HITZ?</h2>
          <p>We make collecting exciting, accessible, and worth the chase.</p>
          <div className="why-grid">
            {[
              [
                "✦",
                "A WORLD OF COLLECTIBLES",
                "From trading cards to collectibles, find your next favorite.",
              ],
              [
                "♢",
                "DISCOVER SOMETHING NEW",
                "Fresh drops, mystery packs, and exciting finds every week.",
              ],
              [
                "⌁",
                "BEYOND THE CARDS",
                "Explore collectibles, vending machines, and more.",
              ],
            ].map(([icon, title, copy]) => (
              <article key={title}>
                <span>{icon}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="community" id="community">
          <img
            src={`${A}/606f0.png`}
            alt="Pokémon characters and trading cards"
          />
          <div>
            <h2>JOIN THE TCG HITZ COMMUNITY.</h2>
            <p>
              Get first access to new drops, exclusive offers, and collector
              updates.
            </p>
            {subscribed ? (
              <p className="thanks">
                You're in. Watch your inbox for the next drop.
              </p>
            ) : (
              <form onSubmit={submitNewsletter}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                />
                <button>SUBSCRIBE</button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={`${A}/41460.png`} alt="TCG Hitz" />
            <p>
              Your destination for trading cards, collectibles, mystery packs,
              and more.
            </p>
            <div className="socials">
              <span>
                <img src={`${A}/47c3f.png`} alt="Facebook" />
              </span>
              <span>
                <img src={`${A}/d02a3.png`} alt="X" />
              </span>
              <span>
                <img src={`${A}/5c1de.png`} alt="Instagram" />
              </span>
              <span>
                <img src={`${A}/0b671.png`} alt="LinkedIn" />
              </span>
            </div>
          </div>
          <div>
            <h3>SHOP</h3>
            <a href="#products">Pokémon Cards</a>
            <a href="#products">Mystery Packs</a>
            <a href="#products">Graded Cards</a>
            <a href="#products">Merchandise</a>
          </div>
          <div>
            <h3>MACHINES</h3>
            <a href="#community">Browse Machines</a>
            <a href="#community">Machine Information</a>
            <a href="#community">Sell to Us</a>
          </div>
          <div>
            <h3>HELP</h3>
            <a href="#top">Contact Us</a>
            <a href="#top">Shipping Policy</a>
            <a href="#top">FAQs</a>
          </div>
          <div>
            <h3>OUR CONTACT</h3>
            <p>+1 208-620-7749</p>
            <p>admin@tcghitz.com</p>
            <p>Idaho, United States</p>
          </div>
        </div>
        <div className="copyright">
          © 2026 TCG HITZ. All rights reserved.
          <span>Privacy Policy &nbsp; Terms & Conditions</span>
        </div>
      </footer>
    </div>
  )
}
