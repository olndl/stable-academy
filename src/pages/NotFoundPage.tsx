import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <section className="empty-page">
      <p className="eyebrow">404 / Off the track</p>
      <h1>Let’s find our way back.</h1>
      <p className="empty-description">
        This page doesn’t exist. Head back to the overview to keep exploring.
      </p>
      <Link className="button button-primary" to="/">
        Back to overview <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
