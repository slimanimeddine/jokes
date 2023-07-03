import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

function Document({
  children,
  title = "Remix: So great, it's funny!",
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-purple-900 capitalize text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Unknown error";
  return (
    <Document title="Uh-oh!">
      <div className="bg-red-600 text-white">
        <h1 className="uppercase text-4xl font-extrabold">App Error</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}