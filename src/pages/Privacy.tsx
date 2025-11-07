import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Activity, ArrowLeft, Shield, Database, Lock, Download } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold">Privacy & Consent</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Intro */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Your Privacy Matters</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This application is designed with privacy as a core principle. We collect only the
              minimum data necessary for research purposes and give you full control over your
              information.
            </p>
          </div>

          {/* What We Collect */}
          <Card className="p-8">
            <div className="flex gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center shrink-0">
                <Database className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What We Collect</h3>
                <p className="text-muted-foreground">
                  We collect anonymous keystroke timing data to analyze typing patterns.
                </p>
              </div>
            </div>
            <ul className="space-y-3 ml-16">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Keystroke timing:</strong> Press and release timestamps for each key</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Computed metrics:</strong> Hold time, flight time, jitter, tremor index</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Device info:</strong> Browser user agent and platform for technical analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Session metadata:</strong> Timestamp, session ID, and consent status</span>
              </li>
            </ul>
          </Card>

          {/* What We DON'T Collect */}
          <Card className="p-8 bg-success/5 border-success/20">
            <div className="flex gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What We DON'T Collect</h3>
                <p className="text-muted-foreground">
                  Your actual text content and personal information remain private.
                </p>
              </div>
            </div>
            <ul className="space-y-3 ml-16">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-success mt-2 shrink-0" />
                <span><strong>Text content:</strong> We never store what you actually type</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-success mt-2 shrink-0" />
                <span><strong>Personal information:</strong> No names, emails, or contact details</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-success mt-2 shrink-0" />
                <span><strong>Location data:</strong> No GPS, IP addresses, or geographical information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-success mt-2 shrink-0" />
                <span><strong>Identifiers:</strong> Session IDs are pseudonymous and cannot be linked to you</span>
              </li>
            </ul>
          </Card>

          {/* Data Storage */}
          <Card className="p-8">
            <div className="flex gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-chart-3/10 flex items-center justify-center shrink-0">
                <Activity className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Storage & Control</h3>
                <p className="text-muted-foreground">
                  You maintain full control over your data.
                </p>
              </div>
            </div>
            <div className="space-y-4 ml-16">
              <p className="leading-relaxed">
                <strong>Local Storage:</strong> Your session data is stored locally in your browser.
                It never leaves your device unless you explicitly choose to analyze or export it.
              </p>
              <p className="leading-relaxed">
                <strong>Export & Delete:</strong> You can export your data as JSON or CSV files at
                any time, and you can delete individual sessions whenever you want.
              </p>
              <p className="leading-relaxed">
                <strong>Analysis:</strong> When you click "Analyze," only computed features (not raw
                keystrokes) may be sent to a backend service for model inference.
              </p>
            </div>
          </Card>

          {/* Your Rights */}
          <Card className="p-8">
            <div className="flex gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center shrink-0">
                <Download className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Your Rights</h3>
                <p className="text-muted-foreground">
                  You have complete rights to your data.
                </p>
              </div>
            </div>
            <ul className="space-y-3 ml-16">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Consent withdrawal:</strong> Stop recording at any time</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Data portability:</strong> Export your data in standard formats</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Right to erasure:</strong> Delete any session from your device</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span><strong>Transparency:</strong> Full disclosure of what data we collect and why</span>
              </li>
            </ul>
          </Card>

          {/* Research Use */}
          <Card className="p-8 bg-muted/50">
            <h3 className="text-lg font-semibold mb-3">Research Purpose</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This application is designed for research into early detection of motor pattern
              changes. The timing data collected may help researchers understand how typing dynamics
              correlate with movement health.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This tool is not a medical device and does not provide
              medical diagnoses. Always consult qualified healthcare professionals for medical
              advice and diagnosis.
            </p>
          </Card>

          {/* CTA */}
          <div className="flex gap-4">
            <Link to="/test" className="flex-1">
              <Button className="w-full" size="lg">
                Start Test
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
