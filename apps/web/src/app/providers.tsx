import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Toast } from '../components/ui/feedback';
import { AuthProvider } from '../features/auth/auth-context';

type ToastContextValue = {
  notify: (message: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const dismiss = useCallback(() => setMessage(null), []);
  const notify = useCallback((nextMessage: string): void => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setMessage(nextMessage);
    timeoutRef.current = window.setTimeout(() => setMessage(null), 5000);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        className="fixed bottom-5 left-5 right-5 z-50 mx-auto max-w-md md:left-auto md:right-8"
        message={message ?? ''}
        visible={message !== null}
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside Providers.');
  return context;
}

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
