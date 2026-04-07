'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  GraduationCap,
  IndianRupee,
  Bell,
  Users,
  Smartphone,
  BarChart3,
  Shield,
  Check,
  ArrowRight,
  Star,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: IndianRupee,
    title: 'Fee Tracking',
    description: 'Track fee payments, installments, and pending dues with real-time updates.',
  },
  {
    icon: Bell,
    title: 'WhatsApp Reminders',
    description: 'Automated payment reminders via WhatsApp to parents and students.',
  },
  {
    icon: Smartphone,
    title: 'UPI Payments',
    description: 'Accept payments via UPI, cards, and bank transfers seamlessly.',
  },
  {
    icon: Users,
    title: 'Student Management',
    description: 'Manage student profiles, batches, and academic information in one place.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Get insights on collections, pending fees, and institute performance.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Bank-grade security with 99.9% uptime for your peace of mind.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Add Students',
    description: 'Import or add students with their fee structure and payment schedule.',
  },
  {
    number: '02',
    title: 'Track Fees',
    description: 'Monitor payments, generate receipts, and track installment progress.',
  },
  {
    number: '03',
    title: 'Get Paid',
    description: 'Receive payments via UPI/cards with automatic reconciliation.',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '999',
    period: '/month',
    description: 'Perfect for small coaching centers',
    features: [
      'Up to 50 students',
      'Basic fee tracking',
      'Manual reminders',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '2,499',
    period: '/month',
    description: 'Best for growing institutes',
    features: [
      'Up to 500 students',
      'Advanced fee tracking',
      'WhatsApp reminders',
      'UPI payment integration',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '4,999',
    period: '/month',
    description: 'For large coaching chains',
    features: [
      'Unlimited students',
      'Multi-branch support',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      '24/7 phone support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const testimonials = [
  {
    quote: "ClassDesk transformed how we manage fees. Collection improved by 40% in just 2 months!",
    author: 'Priya Sharma',
    role: 'Owner, Excel Academy, Delhi',
    rating: 5,
  },
  {
    quote: "The WhatsApp reminders are a game-changer. Parents love the convenience.",
    author: 'Rajesh Kumar',
    role: 'Director, Bright Future Classes, Mumbai',
    rating: 5,
  },
  {
    quote: "Finally, a software that understands Indian coaching institutes. Highly recommend!",
    author: 'Amit Patel',
    role: 'Founder, Vidya Coaching, Pune',
    rating: 5,
  },
]

const faqs = [
  {
    question: 'How long is the free trial?',
    answer: 'You get a 14-day free trial with full access to all features. No credit card required.',
  },
  {
    question: 'Can I import existing student data?',
    answer: 'Yes, you can easily import student data from Excel or CSV files. We also provide assisted migration support.',
  },
  {
    question: 'How does WhatsApp integration work?',
    answer: 'We integrate with the official WhatsApp Business API to send automated payment reminders. Messages are personalized with student name and due amount.',
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We support UPI, credit/debit cards, net banking, and cash payments. All digital payments are automatically reconciled.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-grade encryption, regular backups, and comply with Indian data protection regulations.',
  },
  {
    question: 'Can I use ClassDesk for multiple branches?',
    answer: 'Yes, our Professional and Enterprise plans support multi-branch management with centralized reporting.',
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">ClassDesk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/dashboard">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="gradient-bg border-0">Start Free Trial</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background p-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                How it Works
              </a>
              <a href="#pricing" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <div className="flex gap-2 pt-2">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full gradient-bg border-0">Start Trial</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 gradient-bg border-0 text-primary-foreground">
              Trusted by 500+ Coaching Institutes
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Fee Management</span>
              <span className="block gradient-text">Made Simple</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
              Automate fee collection, track payments, and send WhatsApp reminders. 
              The modern way to manage your coaching institute finances.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto gradient-bg border-0 text-base h-12 px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8">
                Book a Demo
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. 14-day free trial.
            </p>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden">
              <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground">ClassDesk Dashboard</span>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-background to-secondary/20">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Collected', value: '₹5,43,000' },
                    { label: 'Pending Fees', value: '₹1,15,500' },
                    { label: 'Overdue', value: '₹63,750' },
                    { label: 'Students', value: '127' },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-xl bg-card border border-border/50 p-4">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-bold gradient-text mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to manage fees
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed specifically for Indian coaching institutes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-bg">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple setup, powerful results. Start collecting fees efficiently today.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl gradient-bg shadow-lg">
                    <span className="text-3xl font-bold text-primary-foreground">{step.number}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Plans for every institute
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={cn(
                  'relative overflow-hidden rounded-2xl transition-all duration-300',
                  plan.highlighted
                    ? 'border-2 border-primary shadow-xl scale-105'
                    : 'border-border/50 hover:shadow-lg'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 gradient-bg py-1.5 text-center text-sm font-medium text-primary-foreground">
                    Recommended
                  </div>
                )}
                <CardHeader className={cn('pb-4', plan.highlighted && 'pt-10')}>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">₹{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard">
                    <Button
                      className={cn(
                        'w-full',
                        plan.highlighted
                          ? 'gradient-bg border-0'
                          : 'variant-outline'
                      )}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.cta}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by coaching institutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what institute owners are saying about ClassDesk.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="rounded-2xl border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about ClassDesk.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border/50 bg-card px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-bg px-6 py-16 sm:px-12 sm:py-20">
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to transform your fee collection?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join 500+ coaching institutes already using ClassDesk.
                Start your free trial today.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Talk to Sales
                </Button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold gradient-text">ClassDesk</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ClassDesk. Made in India.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
