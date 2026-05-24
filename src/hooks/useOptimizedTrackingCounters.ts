import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_STATS = {
  visitors: 12450,
  clicks: 8720,
  shares: 1050,
};

type Stats = typeof DEFAULT_STATS;

const sendIdleTask = (task: () => void) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout: 2000 });
    return;
  }

  window.setTimeout(task, 250);
};

export const useOptimizedTrackingCounters = () => {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const clickSyncTimer = useRef<number | null>(null);
  const pendingClicks = useRef(0);

  useEffect(() => {
    let isMounted = true;

    if (!supabase) return;

    sendIdleTask(() => {
      supabase
        .from('stats')
        .select('visitors, clicks, shares')
        .eq('id', 1)
        .single()
        .then(({ data, error }) => {
          if (!isMounted || error || !data) return;

          setStats({
            visitors: data.visitors || DEFAULT_STATS.visitors,
            clicks: data.clicks || DEFAULT_STATS.clicks,
            shares: data.shares || DEFAULT_STATS.shares,
          });
        })
        .catch((error) => {
          console.error('Error fetching stats:', error);
        });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;

    sendIdleTask(() => {
      const hasVisited = localStorage.getItem('has_visited');
      if (hasVisited) return;

      supabase
        .rpc('increment_visitors')
        .then(({ error }) => {
          if (!error) localStorage.setItem('has_visited', 'true');
        })
        .catch((error) => {
          console.error('Error incrementing visitor:', error);
        });
    });
  }, []);

  const flushClicks = useCallback(() => {
    if (!supabase || pendingClicks.current === 0) return;

    pendingClicks.current = 0;
    supabase.rpc('increment_clicks').catch((error) => {
      console.error('Error tracking click:', error);
    });
  }, []);

  const trackClick = useCallback(() => {
    pendingClicks.current += 1;
    setStats((prev) => ({ ...prev, clicks: prev.clicks + 1 }));

    if (clickSyncTimer.current) return;

    clickSyncTimer.current = window.setTimeout(() => {
      clickSyncTimer.current = null;
      flushClicks();
    }, 1500);
  }, [flushClicks]);

  const trackShare = useCallback(() => {
    setStats((prev) => ({ ...prev, shares: prev.shares + 1 }));

    if (!supabase) return;

    sendIdleTask(() => {
      supabase.rpc('increment_shares').catch((error) => {
        console.error('Error tracking share:', error);
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (clickSyncTimer.current) {
        window.clearTimeout(clickSyncTimer.current);
      }
      flushClicks();
    };
  }, [flushClicks]);

  return { stats, trackShare, trackClick };
};
