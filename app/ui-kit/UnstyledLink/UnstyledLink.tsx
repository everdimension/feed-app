import React from "react";
import { Link } from "@remix-run/react";
import type { LinkProps } from "@remix-run/react";
import cx from "classnames";
import styles from "./styles.module.css";

export const UnstyledLink = React.forwardRef(function UnstyledLink(
  { className, children, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Link ref={ref} className={cx(className, styles.anchor)} {...props}>
      {children}
    </Link>
  );
});
