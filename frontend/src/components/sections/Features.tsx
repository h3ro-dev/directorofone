import React from 'react';
import { Container, Section, Grid } from '../layout/Container';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Heading, Text } from '../ui/Typography';

export interface Feature {
  icon?: React.ReactNode;
  title: string;
  description: string;
  link?: {
    label: string;
    href: string;
  };
}

export interface FeaturesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'cards' | 'minimal' | 'centered';
}

export const Features: React.FC<FeaturesProps> = ({
  title,
  subtitle,
  description,
  features,
  columns = 3,
  variant = 'cards',
}) => {
  const FeatureCard = ({ feature }: { feature: Feature }) => {
    if (variant === 'minimal') {
      return (
        <div className="space-y-3">
          {feature.icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {feature.icon}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <Text variant="muted">{feature.description}</Text>
            {feature.link && (
              <a
                href={feature.link.href}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                {feature.link.label}
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      );
    }

    if (variant === 'centered') {
      return (
        <div className="text-center space-y-3">
          {feature.icon && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
              {feature.icon}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <Text variant="muted">{feature.description}</Text>
            {feature.link && (
              <a
                href={feature.link.href}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                {feature.link.label}
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      );
    }

    // Default 'cards' variant
    return (
      <Card hover variant="bordered" className="h-full">
        <CardHeader>
          {feature.icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              {feature.icon}
            </div>
          )}
          <CardTitle>{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </CardHeader>
        {feature.link && (
          <CardContent>
            <a
              href={feature.link.href}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              {feature.link.label}
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <Section spacing="lg" className="bg-muted/30">
      <Container>
        {(title || subtitle || description) && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {subtitle && (
              <Text variant="muted" className="text-sm font-semibold uppercase tracking-wide mb-2">
                {subtitle}
              </Text>
            )}
            {title && (
              <Heading as="h2" className="mb-4">
                {title}
              </Heading>
            )}
            {description && (
              <Text variant="lead">{description}</Text>
            )}
          </div>
        )}
        
        <Grid cols={columns} gap="lg">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
};