import "./Collage.css";

export default function Collage({ images = [], logo }) {
  return (
    <section className="home-collage">
      <div className="collage-grid">
        {images.map((src, idx) => (
          <div className="collage-item" key={idx}>
            <img src={src} alt={`collage-${idx + 1}`} loading="lazy" />
          </div>
        ))}

        {logo && (
          <div className="collage-logo">
            <img src={logo} alt="InPlay logo" />
          </div>
        )}
      </div>
    </section>
  );
}
