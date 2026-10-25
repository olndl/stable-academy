import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { BrandMark } from './BrandMark';

const navigation = [
  { to: '/', label: 'Overview' },
  { to: '/courses', label: 'Courses' },
  { to: '/my-learning', label: 'My learning' },
  { to: '/diary', label: 'Training diary' },
  { to: '/statistics', label: 'Statistics' },
];

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      mainRef.current?.focus();
      window.scrollTo(0, 0);
      previousPath.current = pathname;
    }
    const currentPage = navigation.find((item) => item.to === pathname)?.label;
    document.title = `${currentPage ?? 'Page not found'} · Stable Academy`;
  }, [pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Stable Academy home">
          <span className="brand-mark">
            <BrandMark />
          </span>
          <span>
            stable<span className="brand-subtitle">ACADEMY</span>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          {navigation.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="preview-label">
          <span /> Early preview
        </span>
      </header>
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>Stable Academy</span>
        <span>For the love of learning. And horses.</span>
      </footer>
    </div>
  );
}
