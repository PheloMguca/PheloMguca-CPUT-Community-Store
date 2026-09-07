import "./ProductCard.css";

export default function ProductCard({ category, name, price, rating, image }) {
  return (
    <div className="product-card">
      <div className="product-photo">
        {image ? <img src={image} alt={name} /> : <span>Item Photo</span>}
      </div>
      <p className="product-category">{category}</p>
      <p className="product-name">{name}</p>
      <div className="product-meta">
        <span className="product-price">{price}</span>
        <span className="product-rating">★ {rating}</span>
      </div>
    </div>
  );
}
