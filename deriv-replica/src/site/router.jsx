import React from 'react';

// Minimal history router for the marketing site. The trading app lives at
// /trader and manages its own internal state, so this only needs to handle
// top-level paths.

const RouterContext = React.createContext({ path: '/', navigate: () => {} });

export function RouterProvider({ children }) {
  const [path, setPath] = React.useState(() => window.location.pathname || '/');

  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = React.useCallback(to => {
    if (/^https?:\/\//.test(to)) {
      window.open(to, '_blank', 'noopener,noreferrer');
      return;
    }
    if (to === window.location.pathname) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, []);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return React.useContext(RouterContext);
}

export function useRoute() {
  return React.useContext(RouterContext).path;
}

export function Link({ to, className, children, onClick, ...rest }) {
  const { navigate } = useRouter();
  if (/^https?:\/\//.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={to}
      className={className}
      onClick={e => {
        e.preventDefault();
        onClick?.(e);
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
