import { useEffect, useRef, useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import { computeHoldTime, computeFlightTime, computeLatencyTime } from '@/lib/featureExtractor';
import { Card } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

export function TypingPad() {
  const { currentSession, addKeystroke } = useSessionStore();
  const [text, setText] = useState('');
  const pressTimestamps = useRef<Map<string, number>>(new Map());
  const lastReleaseTs = useRef<number | null>(null);
  const lastPressTs = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const targetText = currentSession?.promptText || '';

  useEffect(() => {
    if (currentSession?.status === 'recording') {
      textareaRef.current?.focus();
    }
  }, [currentSession?.status]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (currentSession?.status !== 'recording') return;

    const code = e.code;
    const key = e.key;

    // Only record if not already pressed (no repeat)
    if (!pressTimestamps.current.has(code)) {
      const pressTs = performance.now();
      pressTimestamps.current.set(code, pressTs);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (currentSession?.status !== 'recording') return;

    const code = e.code;
    const key = e.key;
    const releaseTs = performance.now();
    const pressTs = pressTimestamps.current.get(code);

    if (pressTs !== undefined) {
      const holdTime = computeHoldTime(pressTs, releaseTs);
      
      // Flight Time: press-to-press interval (KeyDown(next) - KeyDown(prev))
      const flightTime = lastPressTs.current !== null
        ? computeFlightTime(lastPressTs.current, pressTs)
        : null;
      
      // Latency Time: release-to-press interval (KeyDown(next) - KeyUp(prev))
      const latencyTime = lastReleaseTs.current !== null
        ? computeLatencyTime(lastReleaseTs.current, pressTs)
        : null;

      const isError = key === 'Backspace' || key === 'Delete';

      addKeystroke({
        key,
        code,
        pressTs,
        releaseTs,
        holdTime,
        flightTime,
        latencyTime,
        isError,
      });

      lastPressTs.current = pressTs;
      lastReleaseTs.current = releaseTs;
      pressTimestamps.current.delete(code);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const isDisabled = !currentSession || currentSession.status !== 'recording';

  const getMatchStatus = (index: number): 'correct' | 'incorrect' | 'pending' => {
    if (index >= text.length) return 'pending';
    return text[index] === targetText[index] ? 'correct' : 'incorrect';
  };

  const accuracy = targetText && text.length > 0
    ? Math.round((text.split('').filter((char, i) => char === targetText[i]).length / text.length) * 100)
    : 0;

  return (
    <Card className="p-8 bg-card shadow-soft border-border rounded-3xl animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
            <Keyboard className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">Typing Area</h3>
            <p className="text-sm text-muted-foreground">
              {isDisabled
                ? 'Click Start to begin typing'
                : 'Type the text below naturally — your timing is being recorded'}
            </p>
          </div>
        </div>

        {/* Reference Text */}
        {targetText && (
          <div className="p-6 rounded-2xl bg-secondary border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">Type this text:</p>
            <p className="font-mono text-base leading-relaxed">
              {targetText.split('').map((char, index) => {
                const status = getMatchStatus(index);
                return (
                  <span
                    key={index}
                    className={`${
                      status === 'correct'
                        ? 'text-green-600 bg-green-50'
                        : status === 'incorrect'
                        ? 'text-red-600 bg-red-50'
                        : 'text-muted-foreground'
                    } transition-colors duration-200`}
                  >
                    {char}
                  </span>
                );
              })}
            </p>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          disabled={isDisabled}
          className="w-full h-52 p-6 font-mono text-base rounded-2xl border-2 border-border bg-card focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 resize-none shadow-sm"
          placeholder={
            isDisabled
              ? 'Click Start to begin...'
              : 'Type the text shown above...'
          }
          aria-label="Typing area"
          role="textbox"
        />

        {currentSession && currentSession.raw.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground px-2 animate-fade-in">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {currentSession.raw.length} keystrokes captured
            </span>
            <div className="flex items-center gap-4">
              <span>{text.length} / {targetText.length} characters</span>
              {text.length > 0 && (
                <span className={`font-medium ${accuracy >= 90 ? 'text-green-600' : accuracy >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {accuracy}% accuracy
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
