'use client';
import { Container, Section, Heading, Text, Button, Grid, Card, CardHeader, CardTitle, CardDescription } from '@/components';
import Link from 'next/link';

export default function DemoPage() {
  const demoSteps = [
    {
      step: 1,
      title: "Automated Task Management",
      description: "See how AI prioritizes your tasks based on urgency, impact, and your goals",
      demo: "Interactive task board showing real-time prioritization"
    },
    {
      step: 2,
      title: "Smart Workflow Automation",
      description: "Watch routine processes get automated with one-click workflows",
      demo: "Live demonstration of expense approval automation"
    },
    {
      step: 3,
      title: "Real-time Analytics",
      description: "Track department performance with AI-generated insights",
      demo: "Dashboard showing time saved and productivity gains"
    },
    {
      step: 4,
      title: "Intelligent Reminders",
      description: "Never miss a deadline with context-aware notifications",
      demo: "Smart reminder system adapting to your work patterns"
    }
  ];

  const testimonials = [
    {
      quote: "Director of One saved me 15 hours per week. I finally have time for strategic planning.",
      author: "Sarah Chen",
      role: "Director of Operations",
      company: "TechStart Inc."
    },
    {
      quote: "The AI prioritization is a game-changer. I no longer feel overwhelmed by my task list.",
      author: "Michael Rodriguez",
      role: "Marketing Director",
      company: "Growth Labs"
    },
    {
      quote: "Automated reporting alone justified the investment. My CEO loves the weekly summaries.",
      author: "Emily Watson",
      role: "Finance Director",
      company: "Innovate Corp"
    }
  ];

  return (
    <main>
      <Section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Heading as="h1" className="text-4xl mb-6">See Director of One in Action</Heading>
            <Text variant="lead" className="mb-8 text-gray-700">
              Discover how our AI-powered platform transforms one-person departments into high-performing operations.
            </Text>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                View Live Dashboard
              </Button>
              <Button size="lg" variant="secondary" onClick={() => window.location.href = '/consultation'}>
                Get Your Free Workflow Audit
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Demo Steps */}
      <Section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-3xl mb-4">How It Works</Heading>
            <Text variant="lead" className="text-gray-600">Follow along with our interactive demo</Text>
          </div>
          
          <Grid cols={2} gap="lg" className="max-w-5xl mx-auto">
            {demoSteps.map((item) => (
              <Card key={item.step} variant="bordered" className="relative overflow-hidden">
                <div className="absolute top-4 left-4 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">{item.step}</span>
                </div>
                <CardHeader className="pt-20">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="mt-2">{item.description}</CardDescription>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Text variant="small" className="text-gray-600 italic">Demo: {item.demo}</Text>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Video Section */}
      <Section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Heading as="h2" className="text-3xl mb-4">Watch the Full Demo</Heading>
              <Text variant="lead" className="text-gray-600">See how Director of One can transform your workflow in just 5 minutes</Text>
            </div>
            
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Text className="text-gray-500">Demo video coming soon</Text>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="py-16">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-3xl mb-4">Trusted by Directors Like You</Heading>
            <Text variant="lead" className="text-gray-600">See what other one-person departments are saying</Text>
          </div>
          
          <Grid cols={3} gap="lg" className="max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="professional" hover>
                <CardHeader>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Text className="italic mb-4">"{testimonial.quote}"</Text>
                  <div>
                    <Text className="font-semibold">{testimonial.author}</Text>
                    <Text variant="small" className="text-gray-600">{testimonial.role}, {testimonial.company}</Text>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-16 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <Heading as="h2" className="text-white mb-4">
              Ready to Transform Your Department?
            </Heading>
            <Text variant="lead" className="text-white/90 mb-8">
              Join hundreds of directors who've automated their operations and reclaimed their time.
            </Text>
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-white/90"
              onClick={() => window.location.href = '/consultation'}
            >
              Get Your Free Workflow Audit
            </Button>
            <Text variant="small" className="text-white/70 mt-4">
              Free 30-minute consultation • No commitment required
            </Text>
          </div>
        </Container>
      </Section>
    </main>
  );
}