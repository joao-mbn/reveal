import { useCallback, useMemo, useState } from 'react';

import { useLoginHints } from '@cognite/auth-react';
import { getUserInformation } from '@cognite/cdf-sdk-singleton';
import { Metrics } from '@cognite/metrics';

// fusion token
const mixpanelToken = '5c4d853e7c3b77b1eb4468d5329b278c'; // pragma: allowlist secret
const applicationId = 'apps.cognite.com';

export const checkUrl = (env: string) => window.location.hostname.includes(env);
export const isDevelopment = () => checkUrl('dev') || checkUrl('localhost');
export const isStaging = () =>
  checkUrl('staging') || checkUrl('pr') || checkUrl('next-release');
export const isProduction = () => !(isStaging() || isDevelopment());

// Because of privacy reasons, no events should be sent for these clusters.
const DONT_TRACK_ME_DOMAINS = ['statnett.fusion.cognite.com'];
const DONT_TRACK_ME_CLUSTERS = [
  'statnett.cognitedata.com',
  'power-no.cognitedata.com',
  'az-power-no-northeurope.cognitedata.com',
];

export type Tracker = {
  track: (name: string, options?: object) => void;
};

export const useTracker = (): Tracker => {
  const [identified, setIdentified] = useState(false);
  const { organization, cluster, project } = useLoginHints();
  const { hostname, pathname } = window.location;
  const isTrackingDisabled =
    DONT_TRACK_ME_CLUSTERS.includes(cluster || '') ||
    DONT_TRACK_ME_DOMAINS.includes(window.location.hostname) ||
    !isProduction();

  const metrics = useMemo<Metrics>(() => {
    Metrics.init({
      mixpanelToken,
      applicationId,
      hostname,
      organization,
      cluster,
      project,
    });
    Metrics.optIn();
    return Metrics.create();
  }, [cluster, hostname, organization, project]);

  const track = useCallback(
    (name: string, options?: object) => {
      if (isTrackingDisabled) return;

      const props = { ...options, pathname, organization, cluster, project };

      if (identified) {
        metrics.track(name, props);
      } else {
        getUserInformation()
          .then(({ id, mail, userPrincipalName, displayName }) => {
            setIdentified(true);
            if (id) {
              Metrics.identify(id);
              Metrics.people({
                id,
                name: displayName,
                email: mail || userPrincipalName,
              });
            }
            metrics.track(name, props);
          })
          .catch(() => {
            metrics.track(name, props);
          });
      }
    },
    [
      cluster,
      identified,
      isTrackingDisabled,
      metrics,
      organization,
      pathname,
      project,
    ]
  );

  return { track };
};
