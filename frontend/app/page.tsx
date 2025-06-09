'use client';
import { Hero, Features, Container, Section, Heading, Text, Button, Grid, Card, CardHeader, CardTitle, CardDescription } from '@/components';
// import { IntegrationsPreview } from '@/components/sections/IntegrationsPreview';

// Landing page content
const landingContent = {
  hero: {
    badge: "Director of One",
    title: "Running a Department of One? Work Smarter, Not Harder",
    subtitle: "Turn your one-person department into a high-performing operation",
    description: "When you're the entire department, every task falls on your shoulders. Director of One gives you the AI-powered tools to automate routine operations, manage priorities, and finally have time for strategic thinking.",
    primaryAction: { label: "Get Your Free Workflow Audit", href: "/consultation" },
    secondaryAction: { label: "See How It Works", href: "/demo" }
  },
  painPoints: {
    title: "We Understand Your Challenges",
    subtitle: "Being a one-person department is overwhelming",
    items: [
      { 
        title: "Running a department alone is overwhelming", 
        description: "You're responsible for everything with no backup or support team",
        icon: "stress"
      },
      { 
        title: "Scheduling, budgeting, executing all at once", 
        description: "Juggling strategic planning while handling daily operations",
        icon: "multitask"
      },
      { 
        title: "Endless administrative tasks", 
        description: "Drowning in paperwork, emails, and routine processes",
        icon: "tasks"
      },
      { 
        title: "No time for big-picture thinking", 
        description: "Too busy fighting fires to focus on strategic initiatives",
        icon: "strategy"
      }
    ]
  },
  features: {
    title: "AI Tools to Transform Your Workflow",
    subtitle: "Save 10+ hours per week with intelligent automation",
    description: "Stop juggling everything manually. Get the tools that let you focus on what matters.",
    items: [
      { title: "Automated Dashboards & Reminders", description: "Never miss a deadline with intelligent alerts and visual tracking" },
      { title: "Process Automation Tools", description: "Turn repetitive tasks into one-click workflows" },
      { title: "Priority Management System", description: "AI-powered recommendations on what needs attention now" },
      { title: "Save 10+ Hours Per Week", description: "Reclaim your time for strategic thinking and growth" }
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
  FeatureIcons.dashboard,
  FeatureIcons.automation,
  FeatureIcons.workflow,
  FeatureIcons.analytics,
];

// Pain point icons
const PainPointIcons = {
  stress: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  multitask: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  tasks: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  strategy: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

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

      {/* Pain Points Section */}
      <Section className="bg-gray-50 animate-fade-in animation-delay-100">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Heading as="h2" className="text-3xl mb-4">{landingContent.painPoints.title}</Heading>
            <Text variant="lead" className="text-gray-600">{landingContent.painPoints.subtitle}</Text>
          </div>
          <Grid cols={2} gap="lg" className="max-w-5xl mx-auto">
            {landingContent.painPoints.items.map((pain, index) => (
              <Card key={index} variant="bordered" className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-red-500 mt-1">
                    {PainPointIcons[pain.icon as keyof typeof PainPointIcons]}
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-2">{pain.title}</CardTitle>
                    <CardDescription>{pain.description}</CardDescription>
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

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
