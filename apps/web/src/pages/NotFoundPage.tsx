import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage(): JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 text-center">
      <div className="neo-box flex max-w-xl flex-col items-center bg-danger p-8 md:p-12">
        <AlertCircle aria-hidden="true" className="mb-6" size={64} strokeWidth={3} />
        <p className="mb-4 font-mono text-sm font-bold uppercase tracking-widest">Error 404</p>
        <h1 className="mb-4 text-4xl md:text-6xl">Page not found</h1>
        <p className="text-lg font-medium">This page fell off the learning path.</p>
      </div>
      <Link to="/" className="neo-button bg-yellow px-8 py-4 text-lg">
        Return Home
      </Link>
    </div>
  );
}
