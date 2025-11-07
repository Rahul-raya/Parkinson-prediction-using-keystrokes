import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSessionStore, Prediction } from '@/store/useSessionStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const Results = () => {
  const { currentSession, currentPrediction, setPrediction } = useSessionStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentSession || !currentSession.features) {
      navigate('/test');
      return;
    }

    // Simulate API call to /api/predict
    const mockPredict = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock prediction based on features
      const features = currentSession.features;
      
      // Simple heuristic for demo: high variance + high jitter = possible PD
      const riskScore = (
        (features.varHold / 1000) * 0.3 +
        (features.varFlight / 1000) * 0.3 +
        (features.jitterHold / 100) * 0.2 +
        (features.tremorIndex) * 0.2
      );

      const isPossiblePD = riskScore > 0.5;
      const confidence = Math.min(0.95, Math.max(0.55, riskScore));

      const prediction: Prediction = {
        label: isPossiblePD ? 'Possible Early PD' : 'Likely Healthy',
        confidence: confidence,
        feature_contributions: {
          varHold: features.varHold / 1000 * 0.34,
          varFlight: features.varFlight / 1000 * 0.29,
          jitterHold: features.jitterHold / 100 * 0.18,
          tremorIndex: features.tremorIndex * 0.16,
          wpm: -0.03,
        },
      };

      setPrediction(prediction);
      setLoading(false);
    };

    mockPredict();
  }, [currentSession, navigate, setPrediction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto animate-glow">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <p className="text-lg text-muted-foreground">Analyzing your typing patterns...</p>
        </div>
      </div>
    );
  }

  if (!currentPrediction) {
    navigate('/test');
    return null;
  }

  const isPossiblePD = currentPrediction.label === 'Possible Early PD';
  const contributionData = Object.entries(currentPrediction.feature_contributions)
    .map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').trim(),
      value: Math.abs(value) * 100,
      fill: value > 0 ? 'hsl(var(--chart-5))' : 'hsl(var(--chart-2))',
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-card sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/test">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Test
              </Button>
            </Link>
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold">Analysis Results</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Prediction Card */}
          <Card className="p-10 glass-card shadow-elegant border-primary/30 animate-scale-in">
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className={`h-20 w-20 rounded-2xl flex items-center justify-center shadow-glow ${
                  isPossiblePD ? 'bg-warning/10 animate-pulse-slow' : 'bg-success/10'
                }`}>
                  {isPossiblePD ? (
                    <AlertTriangle className="h-10 w-10 text-warning" />
                  ) : (
                    <CheckCircle className="h-10 w-10 text-success" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-3xl font-bold">Model Assessment</h2>
                    <Badge variant={isPossiblePD ? 'destructive' : 'secondary'} className="text-base px-4 py-1">
                      {currentPrediction.label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {isPossiblePD ? (
                      <>
                        The analysis detected some patterns that may warrant further attention from
                        a healthcare professional. This is not a diagnosis—please consult with a
                        medical expert for proper evaluation.
                      </>
                    ) : (
                      <>
                        Your typing patterns appear within normal ranges. Continue monitoring if
                        recommended by your healthcare provider.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Confidence Score</span>
                  <span className="text-lg font-bold gradient-text">
                    {(currentPrediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={currentPrediction.confidence * 100} className="h-4" />
              </div>
            </div>
          </Card>

          {/* Feature Contributions */}
          <Card className="p-10 glass-card shadow-elegant animate-fade-in">
            <h3 className="text-2xl font-semibold mb-6 gradient-text">Top Feature Contributions</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={contributionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" />
                <YAxis type="category" dataKey="name" className="text-xs" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-6 leading-relaxed">
              These metrics contributed most to the model's assessment. Higher values indicate
              greater influence on the prediction.
            </p>
          </Card>

          {/* Session Summary */}
          {currentSession?.features && (
            <Card className="p-10 glass-card shadow-elegant animate-fade-in">
              <h3 className="text-2xl font-semibold mb-6">Session Summary</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-4 rounded-xl bg-primary/5">
                  <p className="text-sm text-muted-foreground mb-2">Keystrokes</p>
                  <p className="text-3xl font-bold text-primary">{currentSession.features.sequenceLength}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-secondary/5">
                  <p className="text-sm text-muted-foreground mb-2">Average WPM</p>
                  <p className="text-3xl font-bold text-secondary">{currentSession.features.wpm.toFixed(1)}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-accent/5">
                  <p className="text-sm text-muted-foreground mb-2">Error Rate</p>
                  <p className="text-3xl font-bold text-accent">
                    {(currentSession.features.errorRate * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4 animate-fade-up">
            <Link to="/test" className="flex-1">
              <Button className="w-full gradient-primary border-0 shadow-elegant hover:shadow-glow transition-all duration-300" size="lg">
                Start New Test
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full hover:border-primary/50 hover:bg-primary/10 transition-all duration-300" size="lg">
                Return Home
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <Card className="p-6 glass-card border-warning/30">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-warning">Important:</strong> This tool is for research purposes only and is not
              intended to diagnose, treat, or prevent any disease. Always consult with qualified
              healthcare professionals for medical advice.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Results;
