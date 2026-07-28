import { zodResolver } from '@hookform/resolvers/zod';
import { authCredentialsSchema, type AuthCredentialsInput } from '@openlog/shared';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../app/providers';
import { Button, Card, LoadingBlock, TextInput } from '../components/ui';
import { isApiError } from '../lib/api-error';
import { useAuthMe, useLogin, useRegister } from '../features/auth/hooks';
import { getSafeReturnPath } from '../features/auth/auth-navigation';

export function LoginPage(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuthMe();
  const isRegister = new URLSearchParams(location.search).get('mode') === 'register';
  const returnPath = getSafeReturnPath(location.search);
  const login = useLogin();
  const register = useRegister();
  const form = useForm<AuthCredentialsInput>({
    resolver: zodResolver(authCredentialsSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const isPending = isRegister ? register.isPending : login.isPending;
  const authError = isRegister ? register.error : login.error;

  const onSubmit = async (values: AuthCredentialsInput): Promise<void> => {
    try {
      const result = isRegister ? await register.mutate(values) : await login.mutate(values);
      const attachedMessage =
        result.claimedTrackers > 0
          ? ` ${result.claimedTrackers} ${result.claimedTrackers === 1 ? 'log is' : 'logs are'} now attached to your account.`
          : '';
      toast.notify((isRegister ? 'Account created.' : 'You are signed in.') + attachedMessage);
      navigate(returnPath, { replace: true });
    } catch {
      // The safe mutation error is rendered below.
    }
  };

  if (auth.isLoading && !auth.data) {
    return <LoadingBlock label="Checking your session" />;
  }

  if (auth.data?.authenticated) {
    return <Navigate replace to={returnPath} />;
  }

  const usernameError = form.formState.errors.username?.message;
  const passwordError = form.formState.errors.password?.message;
  const errorMessage =
    isApiError(authError) && authError.code === 'USERNAME_TAKEN'
      ? 'That username is already in use. Choose another.'
      : isApiError(authError) && authError.code === 'INVALID_CREDENTIALS'
        ? 'That username and password do not match.'
        : authError?.message;

  const alternateModePath =
    '/login?' + (isRegister ? '' : 'mode=register&') + 'returnTo=' + encodeURIComponent(returnPath);

  return (
    <div className="mx-auto grid min-h-[65vh] w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="mx-auto w-full max-w-md">
        <p className="font-mono text-xs font-bold uppercase tracking-widest">OPENLOG ACCESS</p>
        <h1 className="mt-5 text-6xl leading-[0.9]">
          {isRegister ? (
            <>
              KEEP YOUR
              <br />
              RECORD.
            </>
          ) : (
            <>
              YOUR LOGS,
              <br />
              YOUR RECORD.
            </>
          )}
        </h1>
        <p className="mt-6 max-w-sm font-medium leading-relaxed">
          {isRegister
            ? 'Create one account to return to your logs from any browser.'
            : 'Sign in to keep writing, editing, and sharing the learning history attached to your account.'}
        </p>
      </div>
      <Card variant="blue" className="mx-auto w-full max-w-none">
        <div className="flex items-center gap-3">
          <span className="border-2 border-border bg-yellow p-2">
            <LockKeyhole aria-hidden="true" size={22} strokeWidth={3} />
          </span>
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest">
              {isRegister ? 'Create account' : 'Welcome back'}
            </p>
            <h1 className="mt-1 text-3xl">
              {isRegister ? 'Keep your logs.' : 'Sign in to OpenLog.'}
            </h1>
          </div>
        </div>
        <form className="mt-7 grid gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <TextInput
            id="login-username"
            label="Username"
            autoComplete="username"
            required
            error={usernameError}
            {...form.register('username')}
          />
          <TextInput
            id="login-password"
            label="Password"
            type="password"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
            helperText={isRegister ? 'At least 12 characters.' : undefined}
            error={passwordError}
            {...form.register('password')}
          />
          {errorMessage ? (
            <p className="border-[3px] border-border bg-danger p-3 font-bold" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button type="submit" loading={isPending} className="w-full">
            {isPending ? (isRegister ? 'CREATING ACCOUNT' : 'SIGNING YOU IN') : null}
            {!isPending ? (isRegister ? 'CREATE ACCOUNT \u2192' : 'SIGN IN \u2192') : null}
          </Button>
        </form>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t-2 border-border pt-5 font-mono text-xs font-bold uppercase">
          <Link className="underline-offset-4 hover:underline" to={alternateModePath}>
            {isRegister ? 'Sign in instead' : 'Create an account'}
          </Link>
          <Link
            className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
            to="/"
          >
            Back home <ArrowRight aria-hidden="true" size={15} strokeWidth={3} />
          </Link>
        </div>
      </Card>
    </div>
  );
}
