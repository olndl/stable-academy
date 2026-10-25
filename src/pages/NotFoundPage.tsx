import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p className="page-description">This page doesn’t exist.</p>
      <Link className="button" to="/">
        Back to home
      </Link>
    </>
  );
}
