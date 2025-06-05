import React from 'react';
import { Container } from '../layout/Container';
import { Stack } from '../layout/Container';
import Button from '../ui/Button';
import { Heading, Text, Badge } from '../ui/Typography';

export interface HeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  image?: {
    src: string;
    alt: string;
  };
  align?: 'left' | 'center' | 'right';
  variant?: 'simple' | 'withImage' | 'split';
}

export const Hero: React.FC<HeroProps> = ({
  badge,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  image,
  align = 'center',
  variant = 'simple',
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  };

  const HeroContent = () => (
    <Stack gap="lg" align={align === 'center' ? 'center' : 'start'} className={`max-w-3xl ${alignmentClasses[align]}`}>
      {badge && (
        <Badge variant="secondary" className="inline-block">
          {badge}
        </Badge>
      )}
      
      <Stack gap="md">
        <Heading as="h1" gradient>
          {title}
        </Heading>
        
        {subtitle && (
          <Heading as="h2" variant="h3" className="text-muted-foreground font-normal">
            {subtitle}
          </Heading>
        )}
        
        {description && (
          <Text variant="lead" className="max-w-2xl">
            {description}
          </Text>
        )}
      </Stack>
      
      {(primaryAction || secondaryAction) && (
        <Stack direction="horizontal" gap="md" className="flex-wrap">
          {primaryAction && (
            <Button
              size="lg"
              onClick={primaryAction.onClick}
              {...(primaryAction.href && { as: 'a', href: primaryAction.href })}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryAction.onClick}
              {...(secondaryAction.href && { as: 'a', href: secondaryAction.href })}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );

  if (variant === 'simple') {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <Container size="lg" className="relative py-24 md:py-32 lg:py-40">
          <HeroContent />
        </Container>
      </section>
    );
  }

  if (variant === 'withImage' && image) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <Container size="lg" className="relative py-24 md:py-32 lg:py-40">
          <Stack gap="xl" align="center">
            <HeroContent />
            <div className="relative w-full max-w-5xl mx-auto mt-8">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </Stack>
        </Container>
      </section>
    );
  }

  if (variant === 'split' && image) {
    return (
      <section className="relative overflow-hidden">
        <Container size="xl" className="relative py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={align === 'right' ? 'lg:order-2' : ''}>
              <HeroContent />
            </div>
            <div className={`relative ${align === 'right' ? 'lg:order-1' : ''}`}>
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return null;
};