import React from 'react';
import cx from 'classnames';
import styles from './UnstyledButton.module.css';

export const UnstyledButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function UnstyledButton({ className, ...props }, ref) {
  return (
    <button className={cx(styles.button, className)} {...props} ref={ref} />
  );
});
