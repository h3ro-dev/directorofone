'use client';
import { Hero, Features, Container, Section, Heading, Text, Button, Grid, Card, CardHeader, CardTitle, CardDescription } from '@/components';
// import { IntegrationsPreview } from '@/components/sections/IntegrationsPreview';

// Landing page content
const landingContent = {
  hero: {
    badge: "Director of One",
    title: "You're the Director of Everything",
    subtitle: "Turn your one-person department into a high-performing operation",
    description: "When you're the entire department, every task falls on your shoulders. Director of One gives you the AI-powered tools to automate routine operations, manage priorities, and finally have time for strategic thinking.",
    primaryAction: { label: "Start Your Free Consultation", href: "/consultation" },
    secondaryAction: { label: "See How It Works", href: "/demo" }
  },
  features: {
    title: "Everything You Need to Run Your Department",
    subtitle: "AI-powered automation for one-person teams",
    description: "Stop juggling everything manually. Get the tools that let you focus on what matters.",
    items: [
      { title: "Smart Automation", description: "Automate routine tasks and workflows" },
      { title: "Priority Management", description: "AI-powered task prioritization" },
      { title: "Analytics Dashboard", description: "Track performance and identify bottlenecks" },
      { title: "AI Assistant", description: "Get intelligent recommendations" },
      { title: "Integrations", description: "Connect your existing tools" },
      { title: "Reporting", description: "Automated status reports" }
    ]
  },
  benefits: {
    title: "Save 10+ Hours Per Week",
    items: [
      { title: "Focus on Strategy", description: "Less time on admin, more on big picture thinking" },
      { title: "Never Miss Deadlines", description: "Automated reminders and priority management" },
      { title: "Data-Driven Decisions", description: "Clear insights into your department's performance" }
    ]
  },
  cta: {
    title: "Ready to Transform Your Department?",
    description: "Join hundreds of directors who've automated their operations.",
    primaryAction: { label: "Get Started Today", href: "/consultation" },
    note: "Free 30-minute consultation • No commitment required"
  }
};

// Icons for features
const FeatureIcons = {
  automation: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  workflow: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  dashboard: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  assistant: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  integrations: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  analytics: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const featureIconMap = [
  FeatureIcons.automation,
  FeatureIcons.workflow,
  FeatureIcons.dashboard,
  FeatureIcons.assistant,
  FeatureIcons.integrations,
  FeatureIcons.analytics,
];

export default function Home() {
  const featuresWithIcons = landingContent.features.items.map((feature, index) => ({
    ...feature,
    icon: featureIconMap[index],
  }));

  // Override the secondary action to point to dashboard
  const heroWithDashboardLink = {
    ...landingContent.hero,
    secondaryAction: {
      label: "View Dashboard Demo",
      href: "/dashboard"
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <div className="animate-fade-in">
        <Hero
          badge={heroWithDashboardLink.badge}
          title={heroWithDashboardLink.title}
          subtitle={heroWithDashboardLink.subtitle}
          description={heroWithDashboardLink.description}
          primaryAction={heroWithDashboardLink.primaryAction}
          secondaryAction={heroWithDashboardLink.secondaryAction}
          align="center"
          variant="simple"
        />
      </div>

      {/* Features Section */}
      <div className="animate-fade-in animation-delay-200">
        <Features
          title={landingContent.features.title}
          subtitle={landingContent.features.subtitle}
          description={landingContent.features.description}
          features={landingContent.features.items}
          variant="cards"
        />
      </div>

      {/* <IntegrationsPreview /> */}

      {/* Benefits Section */}
      <Section className="bg-gradient-to-br from-gray-50 to-primary-50 animate-fade-in animation-delay-400">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Heading as="h2" className="gradient-text text-4xl">{landingContent.benefits.title}</Heading>
          </div>
          <Grid cols={3} gap="lg">
            {landingContent.benefits.items.map((benefit, index) => (
              <Card 
                key={index} 
                variant="professional" 
                hover
                className={`animate-slide-up animation-delay-${600 + index * 200}`}
              >
                <CardHeader>
                  <CardTitle className="text-primary-700">{benefit.title}</CardTitle>
                  <CardDescription className="text-gray-600">{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white animate-fade-in animation-delay-800">
        <Container>
          <div className="text-center max-w-3xl mx-auto relative">
            {/* Floating elements for visual interest */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-400/20 rounded-full blur-2xl animate-pulse animation-delay-400" />
            
            <Heading as="h2" className="text-white mb-4 animate-slide-up">
              {landingContent.cta.title}
            </Heading>
            <Text variant="lead" className="text-white/90 mb-8 animate-slide-up animation-delay-200">
              {landingContent.cta.description}
            </Text>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-white/90 shadow-accent hover-lift animate-slide-up animation-delay-400"
            >
              {landingContent.cta.primaryAction.label}
            </Button>
            <Text variant="small" className="text-white/70 mt-4 animate-fade-in animation-delay-600">
              {landingContent.cta.note}
            </Text>
          </div>
        </Container>
      </Section>
    </main>
  );
}
