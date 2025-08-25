import { useEffect, useRef, useState } from 'react';

export function useRenderTimer(triggerKey: any) {
  const t0Ref = useRef<number | null>(null);
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    t0Ref.current = Date.now();
    setMs(null);
  }, [triggerKey]);

  const onContentSized = () => {
    if (t0Ref.current != null && ms == null) {
      setMs(Date.now() - t0Ref.current);
    }
  };

  return { renderMs: ms, onContentSized };
}
