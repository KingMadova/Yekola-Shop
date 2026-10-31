"use client";

import { useEffect, useRef } from "react";
import type { SignalOrigin } from "@/lib/interest";
import type { HealthGoal } from "@/lib/types";
import { useInterestStore } from "@/store/useInterestStore";

/** Enregistre un besoin quand le visiteur filtre le catalogue. Ne rend rien. */
export function InterestSignal({ goal, origin }: { goal: HealthGoal; origin: SignalOrigin }): null {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    useInterestStore.getState().addSignal(goal, origin);
  }, [goal, origin]);
  return null;
}
