import React from 'react';
import cx from 'classnames';
import styles from './styles.module.css';

export function UnstyledAnchor({
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cx(className, styles.anchor)} {...props}>
      {children}
    </a>
  );
}
