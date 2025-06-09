'use client';
import { Container, Section, Heading, Text, Button, Card, CardHeader, CardTitle, CardDescription } from '@/components';

export default function ConsultationPage() {
  return (
    <main>
      <Section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Heading as="h1" className="text-4xl mb-6">Get Your Free Workflow Audit</Heading>
            <Text variant="lead" className="mb-8 text-gray-700">
              Discover how much time you could save every week with AI-powered automation tailored to your department's unique needs.
            </Text>
          </div>

          <div className="max-w-2xl mx-auto mt-12">
            <Card variant="professional" className="p-8">
              <CardHeader className="text-center mb-8">
                <CardTitle className="text-2xl">Schedule Your Free 30-Minute Consultation</CardTitle>
                <CardDescription className="text-lg mt-4">
                  Our experts will analyze your current workflow and show you exactly how Director of One can transform your operations.
                </CardDescription>
              </CardHeader>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="text-primary-600 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-semibold">Personalized Workflow Analysis</Text>
                    <Text variant="small" className="text-gray-600">We'll review your current processes and identify automation opportunities</Text>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-primary-600 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-semibold">Time Savings Estimate</Text>
                    <Text variant="small" className="text-gray-600">Get a realistic projection of hours saved per week</Text>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-primary-600 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-semibold">Custom Implementation Plan</Text>
                    <Text variant="small" className="text-gray-600">Receive a roadmap tailored to your department's priorities</Text>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-primary-600 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-semibold">No Commitment Required</Text>
                    <Text variant="small" className="text-gray-600">This consultation is completely free with no strings attached</Text>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button size="xl" className="mb-4" onClick={() => window.location.href = 'https://calendly.com/directorofone/consultation'}>
                  Schedule Your Free Consultation
                </Button>
                <Text variant="small" className="text-gray-600">
                  Available Monday-Friday, 9 AM - 5 PM EST
                </Text>
              </div>
            </Card>

            <div className="mt-8 text-center">
              <Text className="text-gray-600 mb-4">Not ready to schedule? Download our guide instead:</Text>
              <Button variant="secondary" onClick={() => window.location.href = '/resources/workflow-automation-guide'}>
                Download "10 Ways to Automate Your Department"
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}