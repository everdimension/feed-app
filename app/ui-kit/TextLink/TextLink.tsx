import React from "react";
import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";
import cx from "classnames";
import styles from "./styles.module.css";

export const TextLink = React.forwardRef(function UnstyledLink(
  { className, children, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Link ref={ref} className={cx(className, styles.link)} {...props}>
      {children}
    </Link>
  );
});
