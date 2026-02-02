import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">CH</span>
            </div>
            <span className="font-bold text-xl text-foreground">Content Hub</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Content Hub ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Content Hub is a content management and social media scheduling platform that allows users to create, schedule, and publish content across multiple social media platforms. The Service includes features such as automation, analytics, team collaboration, and AI-powered content assistance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
              <p className="text-muted-foreground">
                You must create an account to use the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Subscription Plans</h2>
              <p className="text-muted-foreground">
                We offer various subscription plans including Free, Pro, and Enterprise tiers. Each plan has different features and limitations. Paid subscriptions are billed on a monthly or annual basis. You may upgrade or downgrade your plan at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. User Content</h2>
              <p className="text-muted-foreground">
                You retain ownership of all content you create and upload to the Service. By using the Service, you grant us a limited license to store, process, and display your content as necessary to provide the Service. You are solely responsible for ensuring your content complies with applicable laws and third-party rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Prohibited Uses</h2>
              <p className="text-muted-foreground">
                You agree not to use the Service to: (a) violate any laws or regulations; (b) infringe on intellectual property rights; (c) transmit harmful or malicious content; (d) spam or harass others; (e) attempt to gain unauthorized access to the Service; or (f) interfere with the proper functioning of the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason at our sole discretion. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Content Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms of Service from time to time. We will notify you of any material changes by posting the new terms on this page. Your continued use of the Service after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@contenthub.io" className="text-primary hover:underline">
                  legal@contenthub.io
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
