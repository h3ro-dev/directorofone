import React, { HTMLAttributes, forwardRef } from 'react';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className = '', as, variant, gradient = false, children, ...props }, ref) => {
    const Component = as || variant || 'h1';
    const variantToUse = variant || as || 'h1';
    
    const variants = {
      h1: 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight',
      h2: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
      h3: 'text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight',
      h4: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
      h5: 'text-xl md:text-2xl lg:text-3xl font-semibold',
      h6: 'text-lg md:text-xl lg:text-2xl font-semibold',
    };
    
    const gradientClass = gradient
      ? 'bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent'
      : '';
    
    return (
      <Component
        ref={ref}
        className={`${variants[variantToUse]} ${gradientClass} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'lead' | 'small' | 'muted' | 'code';
  as?: 'p' | 'span' | 'div';
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className = '', variant = 'body', as: Component = 'p', ...props }, ref) => {
    const variants = {
      body: 'text-base',
      lead: 'text-xl text-muted-foreground',
      small: 'text-sm',
      muted: 'text-sm text-muted-foreground',
      code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
    };
    
    return (
      <Component
        ref={ref}
        className={`${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', required = false, children, ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
);

Label.displayName = 'Label';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border border-input bg-background',
      success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
      warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300',
    };
    
    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';