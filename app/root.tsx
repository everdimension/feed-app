import type { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";
import mainStylesheet from "./styles/main.css";
import themeDarkStylesheet from "./styles/theme-dark.css";
import { isTruthy } from "is-truthy-ts";
import { PageColumn } from "./components/PageColumn";
import { PageTop } from "./components/PageTop";
import { UIText } from "./ui-kit/UIText";

export const links: LinksFunction = () =>
  [
    { rel: "stylesheet", href: mainStylesheet },
    {
      rel: "stylesheet",
      href: themeDarkStylesheet,
      media: "(prefers-color-scheme: dark)",
    },
    cssBundleHref ? { rel: "stylesheet", href: cssBundleHref } : null,
  ].filter(isTruthy);

function DocumentLayout({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <Meta />
        <title>{title}</title>

        <Links />
      </head>
      <body>{children}</body>
    </html>
  );
}

export function ErrorBoundary() {
  // const caught = useCatch();
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <DocumentLayout title={error.statusText}>
        <PageColumn>
          <PageTop />
          <UIText kind="headline/h1" as="h1" style={{ paddingBlock: "2rem" }}>
            {error.status} {error.statusText}
          </UIText>
        </PageColumn>
      </DocumentLayout>
    );
  } else {
    return (
      <DocumentLayout title="Unknown Error">
        <PageColumn>
          <PageTop />
          <UIText kind="headline/h1" as="h1" style={{ paddingBlock: "2rem" }}>
            {error instanceof Error ? error.message : "Unknown Error"}
          </UIText>
        </PageColumn>
      </DocumentLayout>
    );
  }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
