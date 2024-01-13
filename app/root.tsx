import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import mainStylesheet from './styles/main.css';
import themeDarkStylesheet from './styles/theme-dark.css';
import { isTruthy } from 'is-truthy-ts';
import { PageColumn } from './components/PageColumn';
import { PageTop } from './components/PageTop';
import { UIText } from './ui-kit/UIText';

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

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <title>{caught.statusText}</title>

        <Links />
      </head>
      <body>
        <PageColumn>
          <PageTop />
          <UIText kind="headline/h1" as="h1" style={{ paddingBlock: '2rem' }}>
            {caught.status} {caught.statusText}
          </UIText>
        </PageColumn>
      </body>
    </html>
  );
}

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
