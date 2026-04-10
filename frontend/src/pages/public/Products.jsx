import { Link } from "react-router-dom";
import logo from "../../assets/logo/library.png";

// Imports dyal l-istylat b asma' mokhtalifa bach maykonch error
import styloBleu from "../../assets/products/stylo-a-bille-bleu-bic-cristal.jpg";
import styloRouge from "../../assets/products/stylo-a-bille-rouge-bic-cristal.jpg";
import styloVert from "../../assets/products/stylo-a-bille-vert-bic-cristal.jpg";
import styloNoir from "../../assets/products/stylos-a-bille-noir-bic-cristal.jpg";

function Products() {
  // Data fihom l-istylat b 1.5 DH
  const bookList = [
    { id: 1, name: "Stylo à bille Bleu - BIC", price: "1.5 DH", cat: "Supplies", img: styloBleu },
    { id: 2, name: "Stylo à bille Rouge - BIC", price: "1.5 DH", cat: "Supplies", img: styloRouge },
    { id: 3, name: "Stylo à bille Vert - BIC", price: "1.5 DH", cat: "Supplies", img: styloVert },
    { id: 4, name: "Stylo à bille Noir - BIC", price: "1.5 DH", cat: "Supplies", img: styloNoir },
    { id: 5, name: "Mathematics Grade 6", price: "120 DH", cat: "Textbooks", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500" },
    { id: 6, name: "Chemistry Starter Kit", price: "350 DH", cat: "Supplies", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=500" },
  ];

  return (
    <div className="products-wrapper">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-logo">
          <Link to="/">
            <img src={logo} alt="BOUGDIM" style={{ height: '40px' }} />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/products">Shop</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      </nav>

      {/* Header & Search */}
      <section className="search-filter-section">
        <div className="search-box">
          <input type="text" placeholder="Find your essentials..." />
        </div>

        <div className="filter-row" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <select className="custom-select">
            <option value="all">All Categories</option>
            <option value="textbooks">Textbooks</option>
            <option value="supplies">Supplies</option>
          </select>
          <select className="custom-select">
            <option value="active">Available Now</option>
            <option value="inactive">Special Order</option>
          </select>
          <button className="btn-elegant" style={{ padding: '10px 25px', fontSize: '12px' }}>Apply Filters</button>
        </div>
      </section>

      {/* Grid */}
      <section className="products-list-area">
        <div className="products-grid">
          {bookList.map((product) => (
            <Link to={`/ProductDetail`} className="product-item" key={product.id}>
              <div className="product-img-holder">
                <img src={product.img} alt={product.name} />
              </div>
              <div className="product-info">
                <span className="product-category" style={{ fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {product.cat}
                </span>
                <div className="product-meta">
                  <h4>{product.name}</h4>
                  <span className="price">{product.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Products;