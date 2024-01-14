import { useUnit } from 'effector-react';
import { useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

import type { EventCallable, StoreWritable } from 'effector';

export const useForceRender = () => {
  // eslint-disable-next-line react/hook-use-state
  const [, setObject] = useState({});

  const render = () => setObject({});

  return render;
};

export const useThrottle = <T>(value: T, interval = 500): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
};

export const useWindowInnerHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);
  const updateAppHeight = () => setHeight(window.innerHeight);

  useEventListener('resize', updateAppHeight);
  useEventListener('orientationchange', updateAppHeight);

  return height;
};

export const useAccordionToggle = ($s: StoreWritable<boolean>, e: EventCallable<void>) => {
  return useUnit({
    isOpen: $s,
    onToggle: e
  });
};