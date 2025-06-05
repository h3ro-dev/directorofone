import React, { HTMLAttributes, forwardRef } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = '', size = 'lg', ...props }, ref) => {
    const sizes = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[1400px]',
      full: 'max-w-full',
    };
    
    return (
      <div
        ref={ref}
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className = '', spacing = 'lg', ...props }, ref) => {
    const spacings = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-24 md:py-32',
      xl: 'py-32 md:py-48',
    };
    
    return (
      <section
        ref={ref}
        className={`${spacings[spacing]} ${className}`}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className = '', cols = 3, gap = 'md', responsive = true, ...props }, ref) => {
    const gaps = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    };
    
    const responsiveCols = {
      1: 'grid-cols-1',
      2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
      3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
      4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
      5: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5' : 'grid-cols-5',
      6: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' : 'grid-cols-6',
      12: 'grid-cols-12',
    };
    
    return (
      <div
        ref={ref}
        className={`grid ${responsiveCols[cols]} ${gaps[gap]} ${className}`}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ 
    className = '', 
    direction = 'vertical', 
    gap = 'md', 
    align = 'stretch',
    justify = 'start',
    ...props 
  }, ref) => {
    const directions = {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    };
    
    const gaps = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };
    
    const alignments = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };
    
    const justifications = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };
    
    return (
      <div
        ref={ref}
        className={`flex ${directions[direction]} ${gaps[gap]} ${alignments[align]} ${justifications[justify]} ${className}`}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack';