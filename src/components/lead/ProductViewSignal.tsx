"use client";

import { useEffect, useRef } from "react";
import type { HealthGoal } from "@/lib/types";
import { useInterestStore } from "@/store/useInterestStore";

/** Enregistre la fiche consultée et les besoins qu'elle couvre. Ne rend rien. */
export function ProductViewSignal({ code, goals }: { code: string; goals: readonly HealthGoal[] }): null {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    useInterestStore.getState().viewProduct({ code, healthGoals: goals });
  }, [code, goals]);
  return null;
}
