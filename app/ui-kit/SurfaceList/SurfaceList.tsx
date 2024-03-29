import React from "react";
import cn from "classnames";
import { VStack } from "structure-kit";
import type { LinkProps } from "react-router-dom";
import { Surface } from "../Surface/Surface";
import { UnstyledAnchor } from "../UnstyledAnchor";
import { UnstyledButton } from "../UnstyledButton";
import { UnstyledLink } from "../UnstyledLink";
import s from "./styles.module.css";
import { Link } from "@remix-run/react";

export function ItemLink({
  to,
  onClick,
  children,
  style,
}: {
  to: LinkProps["to"];
  children: React.ReactNode;
  onClick?: React.AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
  style?: React.CSSProperties;
}) {
  return (
    <UnstyledLink
      prefetch="intent"
      style={{ color: "inherit", ...style }}
      to={to}
      onClick={onClick}
      className={s.option}
    >
      <div className={s.decoration}>{children}</div>
    </UnstyledLink>
  );
}

export function ItemAnchor({
  href,
  target,
  onClick,
  children,
  style,
}: {
  href: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  children: React.ReactNode;
  onClick?: React.AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
  style?: React.CSSProperties;
}) {
  return (
    <UnstyledAnchor
      style={{ color: "inherit", ...style }}
      href={href}
      target={target}
      onClick={onClick}
      className={s.option}
    >
      <div className={s.decoration}>{children}</div>
    </UnstyledAnchor>
  );
}

export const ItemButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    style?: React.CSSProperties;
    highlighted?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function ItemButton({ children, style, highlighted, ...props }, ref) {
  return (
    <UnstyledButton
      style={{ color: "inherit", ...style }}
      className={cn(s.option, highlighted ? s.highlighted : undefined)}
      ref={ref}
      {...props}
    >
      <div className={s.decoration}>{children}</div>
    </UnstyledButton>
  );
});

export const ItemLabel = React.forwardRef<
  HTMLLabelElement,
  {
    children: React.ReactNode;
    style?: React.CSSProperties;
    highlighted?: boolean;
  } & React.LabelHTMLAttributes<HTMLLabelElement>
>(function ItemLabel({ children, style, highlighted, ...props }, ref) {
  return (
    <label
      style={{ color: "inherit", ...style }}
      className={cn(s.option, highlighted ? s.highlighted : undefined)}
      ref={ref}
      {...props}
    >
      <div className={s.decoration}>{children}</div>
    </label>
  );
});

export interface Item {
  key: string | number;
  component: JSX.Element;
  to?: LinkProps["to"];
  href?: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  isInteractive?: boolean;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: React.ButtonHTMLAttributes<HTMLButtonElement>["disabled"];
  style?: React.CSSProperties;
  separatorTop?: boolean;
  separatorLeadingInset?: number;
  pad?: boolean;
}

function isInteractive(item: Item): boolean {
  return item.isInteractive ?? Boolean(item.to || item.href || item.onClick);
}

export function SurfaceList({
  items,
  style,
}: {
  items: Item[];
  style?: React.CSSProperties;
}) {
  const vGap = 8;
  const firstItemIsInteractive = items.length && isInteractive(items[0]);
  const lastItemIsInteractive =
    items.length && isInteractive(items[items.length - 1]);
  return (
    <Surface
      style={{
        paddingBlockStart: firstItemIsInteractive ? 6 : 0,
        paddingBlockEnd: lastItemIsInteractive ? 6 : 0,
        ...style,
      }}
    >
      <VStack gap={0}>
        {items.map((item, index) => {
          const {
            style,
            separatorTop = false,
            separatorLeadingInset = 0,
            pad = true,
          } = item;
          const isInteractiveItem = isInteractive(item);
          const component = item.to ? (
            <ItemLink
              to={item.to}
              onClick={
                item.onClick as React.AnchorHTMLAttributes<HTMLAnchorElement>["onClick"]
              }
            >
              {item.component}
            </ItemLink>
          ) : item.href ? (
            <ItemAnchor
              href={item.href}
              target={item.target}
              onClick={
                item.onClick as React.AnchorHTMLAttributes<HTMLAnchorElement>["onClick"]
              }
            >
              {item.component}
            </ItemAnchor>
          ) : item.onClick ? (
            <ItemButton disabled={item.disabled} onClick={item.onClick}>
              {item.component}
            </ItemButton>
          ) : pad === false ? (
            item.component
          ) : (
            <div style={{ paddingBlock: vGap }}>{item.component}</div>
          );
          if (item.key == null) {
            throw new Error("No key");
          }
          // const nextItemHasNoSeparator =
          //   index === items.length - 1 ||
          //   items[index + 1].separatorTop !== true;
          // const noSeparator = !separatorTop && nextItemHasNoSeparator;
          return (
            <div
              key={item.key}
              // not sure if this looks good yet. Seems too thick
              // className={noSeparator ? s.noSeparator : undefined}
              style={{
                padding: isInteractiveItem ? undefined : `0 16px`,
                ...style,
              }}
            >
              {index > 0 && separatorTop ? (
                <div
                  style={{
                    height: 1,
                    marginLeft:
                      (isInteractiveItem ? 16 : 0) + separatorLeadingInset,
                    marginRight: isInteractiveItem ? 16 : 0,
                    marginBottom: 4,
                    marginTop: 4,
                    backgroundColor: "var(--neutral-300)",
                  }}
                />
              ) : null}
              {component}
            </div>
          );
        })}
      </VStack>
    </Surface>
  );
}
