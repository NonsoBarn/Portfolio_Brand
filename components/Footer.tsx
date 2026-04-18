export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="site-footer">
      <div className="footer-logo">
        <i className="ri-earth-line" />
      </div>
      {/* <nav className="footer-links">
        {["Twitter", "YouTube", "Instagram", "Newsletter", "GitHub"].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()}>
            {l}
          </a>
        ))}
      </nav> */}
      <span className="footer-copy">© {year} Nonso Barn. Lagos, NG</span>
    </footer>
  );
}
