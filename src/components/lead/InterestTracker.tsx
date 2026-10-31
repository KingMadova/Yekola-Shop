"use client";

import { useEffect } from "react";
import { useInterestStore } from "@/store/useInterestStore";

/** Lit ?besoin=…&utm_… à l'arrivée du visiteur : le besoin est connu avant même qu'il ne clique. */
export function InterestTracker(): null {
  useEffect(() => {
    let referrer = "";
    try {
      const url = new URL(document.referrer);
      if (url.host !== window.location.host) referrer = url.hostname;
    } catch {
      /* pas de référent */
    }
    useInterestStore.getState().captureArrival({
      search: window.location.search,
      pathname: window.location.pathname,
      referrer,
    });
  }, []);
  return null;
}
