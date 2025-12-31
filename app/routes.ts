import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/splash.tsx"),
  route("landing", "routes/landing.tsx"),
  route("home", "routes/Homepage.jsx"),
  // Auth routes
  route("auth/login", "routes/auth/login.tsx"),
  route("auth/register", "routes/auth/register.tsx"),
  route("auth/verify", "routes/auth/verify.tsx"),
  // Profile routes
  route("profile", "routes/profile/index.tsx"),
  route("profile/edit", "routes/profile/edit.tsx"),
  route("profile/settings", "routes/profile/settings.tsx"),
  // Request routes
  route("requests", "routes/requests/index.tsx"),
  route("requests/create", "routes/requests/create.tsx"),
  route("requests/:requestId", "routes/requests/$requestId.tsx"),
  route("network", "routes/network.tsx"),
] satisfies RouteConfig;
