import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export default function Privacy() {
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
          <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground">
                Content Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              <p className="text-muted-foreground">We collect information that you provide directly to us:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (company name, bio, avatar)</li>
                <li>Content you create and schedule through our platform</li>
                <li>Social media account connections and credentials</li>
                <li>Payment information for subscription services</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <p className="text-muted-foreground">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect and prevent fraudulent activities</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Service providers who assist in operating our platform</li>
                <li>Social media platforms you choose to connect</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your explicit consent</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
              <p className="text-muted-foreground">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your experience, analyze trends, and administer the website. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Third-Party Links</h2>
              <p className="text-muted-foreground">
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">11. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our data practices, please contact us at{' '}
                <a href="mailto:privacy@contenthub.io" className="text-primary hover:underline">
                  privacy@contenthub.io
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
