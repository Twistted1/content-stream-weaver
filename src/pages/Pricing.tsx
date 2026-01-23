import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Zap, Building2, Rocket } from 'lucide-react';

const plans = [
  {
    name: "Free",
    description: "Perfect for individuals getting started",
    price: "$0",
    period: "forever",
    icon: Rocket,
    features: [
      "Up to 3 connected platforms",
      "100 scheduled posts/month",
      "Basic analytics",
      "1 team member",
      "Community support",
      "Novee AI (10 requests/day)"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    description: "For growing creators and small teams",
    price: "$29",
    period: "/month",
    icon: Zap,
    features: [
      "Unlimited platforms",
      "Unlimited scheduled posts",
      "Advanced analytics & reports",
      "Up to 5 team members",
      "Priority email support",
      "Novee AI (unlimited)",
      "Custom automation workflows",
      "Content calendar",
      "API access"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    description: "For large teams and organizations",
    price: "$99",
    period: "/month",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO & advanced security",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 phone support",
      "SLA guarantee",
      "Custom training",
      "White-label options"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const faqs = [
  {
    question: "Can I change plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing."
  },
  {
    question: "What happens when my trial ends?",
    answer: "After your 14-day trial, you'll be moved to the Free plan unless you choose to upgrade. No credit card required to start."
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! Save 20% when you choose annual billing. Contact us for custom enterprise pricing."
  },
  {
    question: "Is there a limit on the number of platforms I can connect?",
    answer: "Free users can connect up to 3 platforms. Pro and Enterprise users have unlimited platform connections."
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl text-foreground">Novee</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/landing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs. Start free, upgrade as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative flex flex-col ${
                  plan.popular 
                    ? 'border-primary shadow-lg shadow-primary/10' 
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-card/50 border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our team is here to help. Contact us for personalized guidance.
          </p>
          <Button variant="outline" asChild>
            <a href="mailto:support@novee.app">Contact Support</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2025 Novee. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
