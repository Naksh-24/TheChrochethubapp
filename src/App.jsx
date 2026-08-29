import { useEffect, useMemo, useState } from 'react';

const seed = [
  { id: 1, name: 'Crochet Flower', price: 249 },
  { id: 2, name: 'Cozy Crochet Scarf', price: 699 },
  { id: 3, name: 'Handmade Crochet Bag', price: 899 },
  { id: 4, name: 'Crochet Teddy', price: 599 },
];

export default function App() {
  const [products, setProducts] = useState(seed);
  const [cart, setCart] = useState([]);
  const [tab, setTab] = useState('shop');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    try {
      const savedProducts = JSON.parse(localStorage.getItem('urcrochet-products'));
      const savedCart = JSON.parse(localStorage.getItem('urcrochet-cart'));
      if (savedProducts?.length) setProducts(savedProducts);
      if (savedCart) setCart(savedCart);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('urcrochet-products', JSON.stringify(products));
    localStorage.setItem('urcrochet-cart', JSON.stringify(cart));
  }, [products, cart]);

  const total = useMemo(() => cart.reduce((sum, product) => sum + product.price, 0), [cart]);
  const add = (product) => setCart((current) => [...current, product]);

  function save(event) {
    event.preventDefault();
    if (!name.trim() || !Number(price)) return;
    setProducts((current) => [...current, { id: Date.now(), name: name.trim(), price: Number(price) }]);
    setName('');
    setPrice('');
    setTab('shop');
  }

  function checkout() {
    if (!cart.length) return window.alert('Your cart is empty!');
    if (window.confirm(`Your total is ₹${total.toFixed(2)}. Confirm purchase?`)) {
      window.alert('Thank you for buying from UrCrochetHub! 🧶');
      setCart([]);
    }
  }

  return (
    <main>
      <section className="hero"><div>
        <p className="eyebrow">HANDCRAFTED WITH LOVE & YARN</p>
        <h1>Welcome to <span>UrCrochetHub</span></h1>
        <p className="sub">A cozy little hub for handmade crochet creations.</p>
        <button onClick={() => setTab('shop')}>Let’s get on it →</button>
      </div></section>

      <nav>
        <strong>🧶 UrCrochetHub</strong>
        <div>
          <button className={tab === 'shop' ? 'active' : ''} onClick={() => setTab('shop')}>🛍 Shop Catalog</button>
          <button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}>＋ Add Product</button>
          <button className={tab === 'cart' ? 'active' : ''} onClick={() => setTab('cart')}>🛒 Cart ({cart.length})</button>
        </div>
      </nav>

      <div className="content">
        {tab === 'shop' && <>
          <div className="heading"><div><p className="eyebrow">SHOP</p><h2>Our Crochet Collection</h2></div><span>{products.length} items</span></div>
          <div className="grid">{products.map((product) => <article key={product.id}>
            <div className="pic">🧶</div><h3>{product.name}</h3><p>₹{product.price.toFixed(2)}</p><button onClick={() => add(product)}>Add to Cart</button>
          </article>)}</div>
        </>}

        {tab === 'add' && <form className="card" onSubmit={save}>
          <p className="eyebrow">CATALOG MANAGEMENT</p><h2>Add New Crochet Item</h2>
          <label>Product Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Crochet Bunny" /></label>
          <label>Price (₹)<input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="499" /></label>
          <button>Save Product to Hub</button>
        </form>}

        {tab === 'cart' && <div className="card">
          <p className="eyebrow">YOUR ORDER</p><h2>Cart & Checkout</h2>
          {cart.length ? <>
            {cart.map((product, index) => <div className="row" key={`${product.id}-${index}`}><span>{product.name}</span><strong>₹{product.price.toFixed(2)}</strong></div>)}
            <div className="total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
            <button onClick={checkout}>Proceed to Buy</button>
          </> : <p>Your cart is empty!</p>}
        </div>}
      </div>
      <footer>Made with 🧶 for crochet lovers.</footer>
    </main>
  );
}
