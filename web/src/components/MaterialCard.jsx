import { Link } from "react-router-dom";
import { categoryLabels, levelLabels, typeLabels } from "../labels.js";

export function MaterialCard({ material }) {
  return (
    <Link to={`/materi/${material.id}`} className={`card type-${material.type}`}>
      <div className="card-meta">
        <span className={`pill type-${material.type}`}>{typeLabels[material.type]}</span>
        <span>{categoryLabels[material.category]}</span>
        {material.favorited ? <span className="saved">Tersimpan</span> : null}
      </div>
      <h3>{material.title}</h3>
      <p>{material.summary}</p>
      <footer>
        <span>{levelLabels[material.level]}</span>
        <span>{material.durationMin} mnt</span>
      </footer>
    </Link>
  );
}
