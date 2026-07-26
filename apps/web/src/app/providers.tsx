import { createContext, useCallback, useMemo, type ReactNode } from 'react';

type ToastContextValue = {
  notify: (message: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

function ToastProvider({ children }: { children: ReactNode }) {
  const notify = useCallback((_message: string): void => {
    void _message;
    // Toast UI will be introduced with the first mutation flow.
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return <ToastProvider>{children}</ToastProvider>;
}
