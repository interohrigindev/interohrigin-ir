import { useRef, useState, useCallback } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number; // ms
  decimals?: number;
}

export default function useCountUp({ end, duration = 1800, decimals = 0 }: UseCountUpOptions) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo for a satisfying deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = parseFloat((eased * end).toFixed(decimals));

      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    }

    requestAnimationFrame(tick);
  }, [end, duration, decimals]);

  return { value, start };
}
