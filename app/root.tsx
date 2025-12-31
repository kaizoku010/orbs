import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useState, useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import { ToastProvider } from "~/components/ui";
import { useAuth } from "~/hooks/useAuth";
import Button from "~/components/ui/Button";
import { Link } from "react-router-dom";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ToastProvider>
      {/* <Header /> */}
      <Outlet />
    </ToastProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

function Header() {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hide header on profile and profile-related routes when logged in
  if (isLoggedIn && location.pathname.startsWith("/profile")) {
    return null;
  }

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-kizuna-green">
            絆 Kizuna
          </Link>
        </div>
      </header>
    );
  }

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-kizuna-green">
          絆 Kizuna
        </Link>
        {isLoggedIn ? (
          <nav className="flex items-center gap-4">
            <Link to="/profile" className="text-gray-700 hover:text-kizuna-green">Profile</Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-kizuna-green">Logout</button>
          </nav>
        ) : (
          <nav className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="sm">Create Account</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
