"use client";

import { useEffect } from "react";
import { HOUSE_PARTNER_SLUG } from "@/lib/config";
import { useInterestStore } from "@/store/useInterestStore";

/** Conserve les signaux séparément pour chaque boutique visitée. */
export function InterestTracker({ partnerSlug }: { partnerSlug: string }): null {
  useEffect(() => {
    let cancelled = false;
    const storageKey = `forever-interest-v1:${partnerSlug}`;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey);
      if (saved === null && partnerSlug === HOUSE_PARTNER_SLUG) {
        saved = localStorage.getItem("forever-interest-v1");
      }
    } catch {
      // Le suivi non essentiel continue sans persistance.
    }

    useInterestStore.persist.setOptions({ name: storageKey });
    useInterestStore.setState({
      firstSeenAt: null,
      landingPath: null,
      campaign: null,
      source: null,
      referrer: null,
      lastAdKey: null,
      scores: {},
      origins: {},
      viewedProducts: [],
    });
    try {
      if (saved !== null) localStorage.setItem(storageKey, saved);
    } catch {
      // Le stockage peut être désactivé.
    }

    const capture = () => {
      if (cancelled) return;
      let referrer = "";
      try {
        const url = new URL(document.referrer);
        if (url.host !== window.location.host) referrer = url.hostname;
      } catch {
        // Pas de référent exploitable.
      }
      useInterestStore.getState().captureArrival({
        search: window.location.search,
        pathname: window.location.pathname,
        referrer,
      });
    };

    const hydration = useInterestStore.persist.rehydrate();
    if (hydration) void hydration.then(capture);
    else capture();

    return () => {
      cancelled = true;
    };
  }, [partnerSlug]);

  return null;
}
