import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/my-learning', label: 'My learning' },
  { to: '/diary', label: 'Diary' },
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
        <Link className="brand" to="/">
          Stable Academy
        </Link>
        <nav aria-label="Main navigation">
          {navigation.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
