import { Link } from 'react-router-dom';
import { Card, Sticker } from '../../../components/ui';

export function PublicLogNotFound(): JSX.Element {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <Card variant="orange" className="text-center">
        <Sticker tone="pink">404 PUBLIC LOG</Sticker>
        <h1 className="mt-8 text-5xl leading-[0.92] md:text-7xl">THIS LOG DOES NOT EXIST.</h1>
        <p className="mx-auto mt-5 max-w-lg font-medium leading-relaxed">
          That public learning link is not available. Start a new log and make your own trail.
        </p>
        <Link className="neo-button mt-8 inline-flex bg-surface px-5 py-4" to="/">
          GO TO OPENLOG
        </Link>
      </Card>
    </div>
  );
}
