export default function NotFound() {
  return (
    <div className="wrap nf">
      <span className="lbl">404</span>
      <h1 className="ptitle">Not found</h1>
      <p className="pintro">That page does not exist. The projects all live on one page now.</p>
      <p>
        <a className="btn solid mag" href="/projects">
          Explore all projects <span className="ar">→</span>
        </a>
      </p>
    </div>
  );
}
