import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';

export function useLoginGate() {
  const { isLoggedIn } = useApp();
  const [gateVisible, setGateVisible] = useState(false);

  const guard = useCallback(
    (action: () => void) => {
      if (isLoggedIn) {
        action();
      } else {
        setGateVisible(true);
      }
    },
    [isLoggedIn],
  );

  const closeGate = useCallback(() => setGateVisible(false), []);

  return { gateVisible, closeGate, guard };
}
