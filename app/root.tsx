import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import mainStylesheet from './styles/main.css';
import themeDarkStylesheet from './styles/theme-dark.css';
import { isTruthy } from 'is-truthy-ts';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () =>
  [
    { rel: 'stylesheet', href: mainStylesheet },
    {
      rel: 'stylesheet',
      href: themeDarkStylesheet,
      media: '(prefers-color-scheme: dark)',
    },
    cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
  ].filter(isTruthy);

export default function App() {
  return (
    <html lang="en">
      <head>
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
