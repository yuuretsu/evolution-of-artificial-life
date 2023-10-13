import { useState } from 'react';

export const useForceRender = () => {
  // eslint-disable-next-line react/hook-use-state
  const [, setObject] = useState({});

  const render = () => setObject({});

  return render;
};
