import { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { extractFeatures, SessionFeatures } from '@/lib/featureExtractor';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Timer, Zap, AlertCircle } from 'lucide-react';

export function LiveDashboard() {
  const { currentSession, updateFeatures } = useSessionStore();
  const [features, setFeatures] = useState<SessionFeatures | null>(null);
  const [holdTimeHistory, setHoldTimeHistory] = useState<Array<{ index: number; value: number }>>([]);
  const [flightTimeHistory, setFlightTimeHistory] = useState<Array<{ index: number; value: number }>>([]);
  const [latencyTimeHistory, setLatencyTimeHistory] = useState<Array<{ index: number; value: number }>>([]);

  useEffect(() => {
    if (!currentSession || currentSession.raw.length === 0) {
      setFeatures(null);
      setHoldTimeHistory([]);
      setFlightTimeHistory([]);
      setLatencyTimeHistory([]);
      return;
    }

    const intervalId = setInterval(() => {
      const computed = extractFeatures(currentSession.raw);
      setFeatures(computed);
      updateFeatures(computed);

      // Update hold time history (last 30)
      const recentHoldTimes = currentSession.raw
        .slice(-30)
        .map((e, i) => ({
          index: currentSession.raw.length - 30 + i,
          value: e.holdTime,
        }));
      setHoldTimeHistory(recentHoldTimes);

      // Update flight time history (last 30)
      const recentFlightTimes = currentSession.raw
        .filter(e => e.flightTime !== null)
        .slice(-30)
        .map((e, i) => ({
          index: i,
          value: e.flightTime as number,
        }));
      setFlightTimeHistory(recentFlightTimes);

      // Update latency time history (last 30)
      const recentLatencyTimes = currentSession.raw
        .filter(e => e.latencyTime !== null)
        .slice(-30)
        .map((e, i) => ({
          index: i,
          value: e.latencyTime as number,
        }));
      setLatencyTimeHistory(recentLatencyTimes);
    }, 100);

    return () => clearInterval(intervalId);
  }, [currentSession, updateFeatures]);

  if (!features) {
    return (
      <Card className="p-12 bg-card shadow-soft rounded-3xl">
        <div className="text-center text-muted-foreground">
          <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-base">Start typing to see live metrics</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          icon={<Zap className="h-5 w-5" />}
          label="WPM"
          value={features.wpm.toFixed(1)}
          color="text-primary"
        />
        <MetricCard
          icon={<Timer className="h-5 w-5" />}
          label="Mean Hold"
          value={`${features.meanHold.toFixed(0)}ms`}
          color="text-primary"
        />
        <MetricCard
          icon={<Activity className="h-5 w-5" />}
          label="Mean Flight"
          value={`${features.meanFlight.toFixed(0)}ms`}
          color="text-accent"
        />
        <MetricCard
          icon={<Timer className="h-5 w-5" />}
          label="Mean Latency"
          value={`${features.meanLatency.toFixed(0)}ms`}
          color="text-primary"
        />
        <MetricCard
          icon={<AlertCircle className="h-5 w-5" />}
          label="Error Rate"
          value={`${(features.errorRate * 100).toFixed(1)}%`}
          color="text-warning"
        />
      </div>

      {/* Charts */}
      <Card className="p-8 bg-card shadow-soft rounded-3xl">
        <h3 className="text-base font-semibold mb-6 text-foreground">Hold Time (last 30 keystrokes)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={holdTimeHistory}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="index" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-8 bg-card shadow-soft rounded-3xl">
        <h3 className="text-base font-semibold mb-6 text-foreground">Flight Time (last 30 intervals)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={flightTimeHistory}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="index" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-8 bg-card shadow-soft rounded-3xl">
        <h3 className="text-base font-semibold mb-6 text-foreground">Latency Time (last 30 intervals)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={latencyTimeHistory}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="index" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Hold Variance"
          value={features.varHold.toFixed(2)}
          small
        />
        <MetricCard
          label="Flight Variance"
          value={features.varFlight.toFixed(2)}
          small
        />
        <MetricCard
          label="Latency Variance"
          value={features.varLatency.toFixed(2)}
          small
        />
        <MetricCard
          label="Hold Jitter"
          value={features.jitterHold.toFixed(2)}
          small
        />
        <MetricCard
          label="Flight Jitter"
          value={features.jitterFlight.toFixed(2)}
          small
        />
        <MetricCard
          label="Latency Jitter"
          value={features.jitterLatency.toFixed(2)}
          small
        />
        <MetricCard
          label="Tremor Index"
          value={features.tremorIndex.toFixed(3)}
          small
        />
        <MetricCard
          label="Keystrokes"
          value={features.sequenceLength.toString()}
          small
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  small?: boolean;
}

function MetricCard({ icon, label, value, color, small }: MetricCardProps) {
  return (
    <Card className={`${small ? 'p-5' : 'p-6'} bg-card shadow-soft rounded-2xl hover:shadow-glow transition-all duration-200 group`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={`text-2xl font-semibold ${color || 'text-foreground'} group-hover:scale-105 transition-transform`}>{value}</p>
        </div>
        {icon && (
          <div className={`${color || 'text-muted-foreground'} opacity-60`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
