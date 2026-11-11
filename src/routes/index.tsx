import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Atom, Blocks, Brain, Check, ChevronDown, ChevronUp, Code2, FlaskConical, Heart, Leaf, Lightbulb, Minus, Plus, Search, ShoppingBag, Sparkles, Truck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/edtech-hero.jpg";
import robotImage from "@/assets/toy-coding-robot.jpg";
import marbleImage from "@/assets/toy-marble-run.jpg";
import explorerImage from "@/assets/toy-explorer-kit.jpg";

type Category = "All toys" | "Coding" | "Build & create" | "Science";

type Product = {
  id: string;
  title: string;
  category: Exclude<Category, "All toys">;
  description: string;
  age: string;
  price: number;
  image: string;
  icon: typeof Code2;
};

const products: Product[] = [
  { id: "codebug", title: "CodeBug Explorer", category: "Coding", description: "A first robot for big little ideas.", age: "Ages 5–9", price: 49, image: robotImage, icon: Code2 },
  { id: "marble", title: "Marble Logic Run", category: "Build & create", description: "Build a path. Test a theory. Try again.", age: "Ages 6–12", price: 36, image: marbleImage, icon: Blocks },
  { id: "field", title: "Little Field Scientist", category: "Science", description: "Everything for backyard discoveries.", age: "Ages 4–8", price: 28, image: explorerImage, icon: FlaskConical },
];

const categories: Category[] = ["All toys", "Coding", "Build & create", "Science"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindSprout | Playful learning toys" },
      { name: "description", content: "Discover thoughtfully picked coding, building and science toys that make screen-free learning a little more magical." },
      { property: "og:title", content: "MindSprout | Playful learning toys" },
      { property: "og:description", content: "Curious minds grow here. Shop playful learning toys for young inventors and explorers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Storefront,
});

function Storefront() {
  const [category, setCategory] = useState<Category>("All toys");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  const visibleProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = category === "All toys" || product.category === category;
      const searchMatch = !search || `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(search);
      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartEntries = products.filter((product) => cart[product.id]);
  const subtotal = cartEntries.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  const updateQuantity = (productId: string, delta: number) => {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) + delta;
      if (nextQuantity <= 0) {
        const { [productId]: _removed, ...remaining } = current;
        return remaining;
      }
      return { ...current, [productId]: nextQuantity };
    });
    setCheckoutNotice(false);
  };

  return (
    <div className="store-shell">
      <div className="announcement">Free shipping on orders over $60 <span aria-hidden="true">·</span> Little ideas, big adventures</div>

      <header className="store-header">
        <nav className="store-nav" aria-label="Main navigation">
          <a className="store-logo" href="#top" aria-label="MindSprout home">
            <span className="store-logo-mark"><Leaf size={20} strokeWidth={2.5} /></span>
            <span>mindsprout</span>
          </a>
          <div className="store-links">
            <a href="#shop">Shop toys</a>
            <a href="#our-promise">Our promise</a>
          </div>
          <label className="search-box">
            <Search size={18} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find their next aha" aria-label="Search toys" />
          </label>
          <Button variant="bag" aria-label={`Open bag, ${cartCount} items`} onClick={() => { setCartOpen(true); setCheckoutNotice(false); }}>
            <ShoppingBag size={19} aria-hidden="true" />
            {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
          </Button>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} aria-hidden="true" /> For curious little minds</span>
            <h1 id="hero-title">The best kind of learning feels like <em>play.</em></h1>
            <p>Thoughtful toys for building, making, testing, and asking “what if?” all afternoon long.</p>
            <div className="hero-actions">
              <a className="store-button store-button--solid" href="#shop">Explore the toys <ArrowRight size={17} aria-hidden="true" /></a>
              <span className="hero-note">Chosen by educators. Loved by kids.</span>
            </div>
          </div>
          <div className="hero-media">
            <img className="hero-photo" src={heroImage} alt="A cheerful coding robot, wooden maze and colorful direction tiles ready for play" width={1440} height={1088} fetchPriority="high" />
            <div className="hero-sticker">Curiosity<br />inside!</div>
          </div>
        </section>

        <section className="benefit-strip" aria-label="Why families shop MindSprout">
          <div className="benefit-inner">
            <span><Heart size={18} aria-hidden="true" /> Made for real-world wonder</span>
            <span><Brain size={18} aria-hidden="true" /> Learning tucked into every play</span>
            <span><Truck size={18} aria-hidden="true" /> Free shipping over $60</span>
          </div>
        </section>

        <section className="shop-section" id="shop" aria-labelledby="shop-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Good things to get curious about</span>
              <h2 id="shop-title">Find their next big idea</h2>
            </div>
            <p>Small-batch favorites, picked to spark a “let me try that” kind of day.</p>
          </div>

          <div className="shop-controls">
            <div className="category-list" role="group" aria-label="Filter toys by category">
              {categories.map((item) => (
                <Button key={item} variant="filter" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>
              ))}
            </div>
            <span className="hero-note">{visibleProducts.length} {visibleProducts.length === 1 ? "favorite" : "favorites"} to explore</span>
          </div>

          <div className="product-grid" aria-live="polite">
            {visibleProducts.map((product) => {
              const ProductIcon = product.icon;
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-photo-wrap">
                    <img className="product-photo" src={product.image} alt={product.title} width={1024} height={1024} loading="lazy" />
                    <span className="product-age">{product.age}</span>
                  </div>
                  <div className="product-info">
                    <span className="product-category"><ProductIcon size={14} aria-hidden="true" /> {product.category}</span>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <div className="product-buy-row">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      <Button variant="outline" onClick={() => { updateQuantity(product.id, 1); setCartOpen(true); }}>
                        <Plus size={16} aria-hidden="true" /> Add to bag
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
            {visibleProducts.length === 0 && <p className="no-results">No toys found. Try a different search or category.</p>}
          </div>
        </section>

        <section className="play-callout" id="our-promise" aria-labelledby="promise-title">
          <div>
            <h2 id="promise-title">Less scrolling. More “look what I made!”</h2>
            <p>Open-ended play, helpful hands-on learning, and room for wonderful messes.</p>
          </div>
          <a className="store-button store-button--outline" href="#shop">Meet the toys <ArrowRight size={17} aria-hidden="true" /></a>
        </section>
      </main>

      <footer className="store-footer">
        <div className="footer-inner">
          <a className="store-logo" href="#top"><span className="store-logo-mark"><Leaf size={18} /></span><span>mindsprout</span></a>
          <span>Made for the beautifully curious. © 2026 MindSprout</span>
        </div>
      </footer>

      {cartOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="cart-title" className="cart-panel">
          <div className="cart-header">
            <h2 id="cart-title">Your little bag ({cartCount})</h2>
            <Button variant="icon" aria-label="Close bag" onClick={() => setCartOpen(false)}><X size={20} /></Button>
          </div>
          <div className="cart-items">
            {cartEntries.length === 0 ? (
              <div className="cart-empty">Your bag is ready for its first little adventure.<br /><br /><Button variant="outline" onClick={() => setCartOpen(false)}>Explore toys <ArrowRight size={16} /></Button></div>
            ) : cartEntries.map((product) => (
              <article className="cart-item" key={product.id}>
                <img className="cart-thumb" src={product.image} alt="" width={1024} height={1024} />
                <div>
                  <h3>{product.title}</h3>
                  <p>${product.price.toFixed(2)}</p>
                  <div className="quantity-control" aria-label={`${product.title} quantity`}>
                    <Button variant="icon" aria-label={`Remove one ${product.title}`} onClick={() => updateQuantity(product.id, -1)}><Minus size={15} /></Button>
                    <span>{cart[product.id]}</span>
                    <Button variant="icon" aria-label={`Add one ${product.title}`} onClick={() => updateQuantity(product.id, 1)}><Plus size={15} /></Button>
                  </div>
                </div>
                <span className="product-price">${(product.price * (cart[product.id] ?? 0)).toFixed(2)}</span>
              </article>
            ))}
          </div>
          {cartEntries.length > 0 && (
            <div className="cart-summary">
              <div className="cart-total"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <Button variant="solid" onClick={() => setCheckoutNotice(true)}>Continue to checkout <ArrowRight size={16} /></Button>
              {checkoutNotice && <p className="checkout-note" role="status">Demo shop only: checkout is not connected yet. Your bag is saved while you browse.</p>}
              <Button variant="quiet" onClick={() => setCartOpen(false)}>Keep exploring</Button>
            </div>
          )}
        </div>
      )}
      {cartOpen && <Button variant="backdrop" aria-label="Close bag" onClick={() => setCartOpen(false)} />}
    </div>
  );
}