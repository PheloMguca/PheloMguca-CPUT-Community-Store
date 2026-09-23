import { Link } from "react-router-dom";
import "./BulletinCard.css";

export default function BulletinCard({ id, category, title, author, date, excerpt, replies }) {
  return (
    <Link to={`/bulletin/${id}`} className="bulletin-card">
      <div className="bulletin-card-top">
        <span className="bulletin-tag">{category}</span>
        <span className="bulletin-date">{date}</span>
      </div>

      <h3 className="bulletin-title">{title}</h3>
      <p className="bulletin-excerpt">{excerpt}</p>

      <div className="bulletin-card-bottom">
        <span className="bulletin-author">by {author}</span>
        {typeof replies === "number" && (
          <span className="bulletin-replies">💬 {replies}</span>
        )}
      </div>
    </Link>
  );
}
