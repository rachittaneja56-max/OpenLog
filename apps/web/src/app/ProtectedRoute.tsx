import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ErrorState, LoadingBlock } from '../components/ui';
import { useAuthMe } from '../features/auth/hooks';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const location = useLocation();
  const auth = useAuthMe();

  if (auth.isLoading && !auth.data) {
    return <LoadingBlock label="Checking your account" />;
  }

  if (auth.error && !auth.data) {
    return (
      <ErrorState
        title="Could not verify your account"
        description={auth.error.message}
        onRetry={auth.refetch}
      />
    );
  }

  if (auth.data?.authenticated) {
    return <>{children}</>;
  }

  const returnTo = location.pathname + location.search;
  return <Navigate replace to={'/login?returnTo=' + encodeURIComponent(returnTo)} />;
}
