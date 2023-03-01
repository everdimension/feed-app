import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
} from 'react';
import React from 'react';

export const textParams = {
  // [font-size, line-height, weight, letter-spacing]
  'headline/hero': [40, 48, 500, '-1.8px'],
  'headline/h1': [36, 48, 500, '-1px'],
  'headline/h2': [24, 28, 500, '-1px'],
  'headline/h3': [20, 24, 500, '-0.4px'],
  'body/accent': [16, 24, 500, 'normal'],
  'body/regular': [16, 24, 400, 'normal'],
  'small/accent': [14, 20, 500, '-0.2px'],
  'small/regular': [14, 20, 400, '-0.2px'],
  'caption/accent': [12, 16, 500, 'normal'],
  'caption/regular': [12, 16, 400, '0.01em'],
} as const;

export type Kind = keyof typeof textParams;

const getStyles = (kind: Kind) => {
  const result = textParams[kind];
  if (!result) {
    throw new Error(`Unsupported text kind: ${kind}`);
  }
  return result;
};

export interface Props {
  inline?: boolean;
  kind: Kind;
  color?: string;
}

const TextComponent = <As extends ElementType = 'div'>(
  {
    as,
    inline = false,
    kind,
    color = 'currentColor',
    style,
    ...props
  }: Props & { as?: As } & ComponentPropsWithoutRef<As> & {
      ref?: ComponentPropsWithRef<As>['ref'];
    },
  ref: React.Ref<ComponentPropsWithRef<As>['ref']>
) => {
  const [fontSize, lineHeight, fontWeight, letterSpacing] = getStyles(kind);
  return React.createElement(as || 'div', {
    ref,
    style: {
      display: inline ? 'inline-block' : undefined,
      fontSize,
      lineHeight: `${lineHeight}px`,
      fontWeight,
      letterSpacing,
      color,
      ...style,
    },
    ...props,
  });
};

export const UIText = React.forwardRef(TextComponent) as typeof TextComponent;
