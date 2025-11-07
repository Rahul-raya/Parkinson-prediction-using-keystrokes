export interface KeystrokeEvent {
  key: string;
  code: string;
  pressTs: number;
  releaseTs: number;
  holdTime: number;
  flightTime: number | null;  // Press-to-press: KeyDown(next) - KeyDown(prev)
  latencyTime: number | null; // Release-to-press: KeyDown(next) - KeyUp(prev)
  isError: boolean;
}

export interface SessionFeatures {
  meanHold: number;
  varHold: number;
  meanFlight: number;
  varFlight: number;
  meanLatency: number;
  varLatency: number;
  jitterHold: number;
  jitterFlight: number;
  jitterLatency: number;
  tremorIndex: number;
  wpm: number;
  errorRate: number;
  sequenceLength: number;
}

export function computeHoldTime(pressTs: number, releaseTs: number): number {
  return releaseTs - pressTs;
}

export function computeFlightTime(prevPressTs: number, currPressTs: number): number {
  return currPressTs - prevPressTs;
}

export function computeLatencyTime(prevReleaseTs: number, currPressTs: number): number {
  return currPressTs - prevReleaseTs;
}

export function calcStats(series: number[]): {
  mean: number;
  variance: number;
  std: number;
  iqr: number;
} {
  if (series.length === 0) {
    return { mean: 0, variance: 0, std: 0, iqr: 0 };
  }

  const mean = series.reduce((sum, val) => sum + val, 0) / series.length;
  const variance = series.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / series.length;
  const std = Math.sqrt(variance);

  // Calculate IQR
  const sorted = [...series].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const iqr = sorted[q3Index] - sorted[q1Index];

  return { mean, variance, std, iqr };
}

export function calcJitter(series: number[]): number {
  if (series.length < 2) return 0;

  let sum = 0;
  for (let i = 1; i < series.length; i++) {
    sum += Math.abs(series[i] - series[i - 1]);
  }

  return sum / (series.length - 1);
}

export function calcTremorIndex(holdSeries: number[]): number {
  if (holdSeries.length < 3) return 0;

  // Simple tremor proxy: rolling standard deviation z-scored
  const stats = calcStats(holdSeries);
  if (stats.std === 0) return 0;

  const windowSize = Math.min(10, holdSeries.length);
  let maxRollingStd = 0;

  for (let i = 0; i <= holdSeries.length - windowSize; i++) {
    const window = holdSeries.slice(i, i + windowSize);
    const windowStats = calcStats(window);
    maxRollingStd = Math.max(maxRollingStd, windowStats.std);
  }

  return maxRollingStd / stats.std;
}

export function calcWPM(chars: number, elapsedMs: number): number {
  if (elapsedMs === 0) return 0;
  const minutes = elapsedMs / 60000;
  // Assuming average word length of 5 characters
  return (chars / 5) / minutes;
}

export function calcErrorRate(events: KeystrokeEvent[]): number {
  if (events.length === 0) return 0;
  const errorCount = events.filter(e => e.isError).length;
  return errorCount / events.length;
}

export function extractFeatures(events: KeystrokeEvent[]): SessionFeatures {
  if (events.length === 0) {
    return {
      meanHold: 0,
      varHold: 0,
      meanFlight: 0,
      varFlight: 0,
      meanLatency: 0,
      varLatency: 0,
      jitterHold: 0,
      jitterFlight: 0,
      jitterLatency: 0,
      tremorIndex: 0,
      wpm: 0,
      errorRate: 0,
      sequenceLength: 0,
    };
  }

  const holdTimes = events.map(e => e.holdTime);
  const flightTimes = events
    .filter(e => e.flightTime !== null)
    .map(e => e.flightTime as number);
  const latencyTimes = events
    .filter(e => e.latencyTime !== null)
    .map(e => e.latencyTime as number);

  const holdStats = calcStats(holdTimes);
  const flightStats = calcStats(flightTimes);
  const latencyStats = calcStats(latencyTimes);

  const elapsedMs = events[events.length - 1].releaseTs - events[0].pressTs;
  const totalChars = events.filter(e => !e.isError).length;

  return {
    meanHold: holdStats.mean,
    varHold: holdStats.variance,
    meanFlight: flightStats.mean,
    varFlight: flightStats.variance,
    meanLatency: latencyStats.mean,
    varLatency: latencyStats.variance,
    jitterHold: calcJitter(holdTimes),
    jitterFlight: calcJitter(flightTimes),
    jitterLatency: calcJitter(latencyTimes),
    tremorIndex: calcTremorIndex(holdTimes),
    wpm: calcWPM(totalChars, elapsedMs),
    errorRate: calcErrorRate(events),
    sequenceLength: events.length,
  };
}
