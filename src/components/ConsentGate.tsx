import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface ConsentGateProps {
  open: boolean;
  onAccept: () => void;
}

export function ConsentGate({ open, onAccept }: ConsentGateProps) {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (checked) {
      onAccept();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[650px] glass-card border-primary/30 shadow-elegant">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-3 animate-fade-in">
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <DialogTitle className="text-3xl gradient-text">Consent Required</DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-4 animate-fade-up">
            This research application analyzes your typing patterns to explore early detection
            of motor changes. We collect <strong className="text-foreground">only timing data</strong> from your keystrokes—no
            actual text content is stored or transmitted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6 animate-scale-in">
          <div className="rounded-2xl glass-card p-5 space-y-2 border-primary/20">
            <h4 className="font-semibold text-base text-primary">What we collect:</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Keystroke timing (press & release timestamps)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Computed metrics (hold time, flight time, etc.)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Device information (browser, platform)
              </li>
            </ul>
          </div>

          <div className="rounded-2xl glass-card p-5 space-y-2 border-accent/20">
            <h4 className="font-semibold text-base text-accent">What we DON'T collect:</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                The actual text you type
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Personal identifying information
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Your location or IP address
              </li>
            </ul>
          </div>

          <div className="flex items-start space-x-3 pt-4">
            <Checkbox
              id="consent"
              checked={checked}
              onCheckedChange={(checked) => setChecked(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
              I consent to the anonymous collection of my keystroke timing data for research and
              model evaluation. I understand that no actual text content will be stored.
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAccept}
            disabled={!checked}
            size="lg"
            className="w-full sm:w-auto gradient-primary border-0 shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            I Agree & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
