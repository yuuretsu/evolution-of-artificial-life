import { useEffect, useRef, useState } from 'react';

import type { RefObject } from 'react';

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


export const useDrag = <T extends HTMLElement>(
  ref: RefObject<T>,
  dxdy: [number, number]
) => {
  const [startXY, setStartXY] = useState<[number, number] | null>(null);
  const [distXY, setDistXY] = useState<[number, number]>(dxdy);
  const [dx, dy] = distXY;

  useEffect(() => {
    const out = ref.current;
    if (!out) return;
    const handleMouseDown = (e: MouseEvent) => {
      const [x, y] = [e.clientX, e.clientY];
      setStartXY([x, y]);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const [x, y] = [e.touches[0]!.clientX, e.touches[0]!.clientY];
      setStartXY([x, y]);
    };

    const handleMouseUp = () => {
      setStartXY(null);
    };

    const reset = () => {
      out.removeEventListener('mousedown', handleMouseDown);
      out.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };

    out.addEventListener('mousedown', handleMouseDown);
    out.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return reset;
  }, [ref.current]);

  useEffect(() => {
    const out = ref.current;
    if (!out) return;
    const fn = (e: MouseEvent) => {
      if (!startXY) return;
      const [x, y] = [e.clientX, e.clientY];
      const [dx2, dy2] = [x - startXY[0] + dx, y - startXY[1] + dy];
      setDistXY([dx2, dy2]);
    };
    const fn2 = (e: TouchEvent) => {
      if (!startXY) return;
      const [x, y] = [e.touches[0]!.clientX, e.touches[0]!.clientY];
      const [dx2, dy2] = [x - startXY[0] + dx, y - startXY[1] + dy];
      setDistXY([dx2, dy2]);
    };
    window.addEventListener('mousemove', fn);
    window.addEventListener('touchmove', fn2);

    return () => {
      window.removeEventListener('mousemove', fn);
      window.removeEventListener('touchmove', fn2);
    };
  }, [startXY]);

  return [dx, dy, setDistXY] as const;
};