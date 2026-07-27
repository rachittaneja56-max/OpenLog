import { useEffect } from 'react';
import type { PublicTracker } from '../api/tracker-api';

export function usePublicTrackerMetadata(tracker: PublicTracker | null): void {
  useEffect(() => {
    if (!tracker) return;

    const previousTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content');
    const learner = tracker.displayName?.trim() || 'Someone';
    const description =
      tracker.description?.trim() ||
      `${learner} is learning ${tracker.topic} in public with OpenLog.`;
    let descriptionMeta = meta;

    document.title = `${tracker.topic} \u00b7 OpenLog`;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', description.slice(0, 160));

    return () => {
      document.title = previousTitle;
      if (meta) {
        if (previousDescription === null) meta.removeAttribute('content');
        else meta.setAttribute('content', previousDescription ?? '');
      } else {
        descriptionMeta?.remove();
      }
    };
  }, [tracker]);
}
