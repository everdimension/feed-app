import { useId } from 'react';
import { VStack } from 'structure-kit';
import styles from './styles.module.css';

export function InputField({
  label,
  name,
  ...props
}: {
  label: React.ReactNode;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <fieldset className={styles.fieldset}>
      <VStack gap={4}>
        {label ? (
          <label
            style={{ fontSize: 12, color: 'var(--neutral-700)' }}
            htmlFor={id}
          >
            {label}
          </label>
        ) : null}
        <input
          className={styles.input}
          id={id}
          type="text"
          name={name}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
          }}
          {...props}
        />
      </VStack>
    </fieldset>
  );
}
