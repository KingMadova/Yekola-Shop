"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  applySignal,
  goalFromText,
  type GoalOrigins,
  type GoalScores,
  type SignalOrigin,
} from "@/lib/interest";
import type { HealthGoal } from "@/lib/types";

const MAX_VIEWED = 8;

interface ArrivalInput {
  search: string;
  pathname: string;
  referrer: string;
}

interface InterestState {
  firstSeenAt: string | null;
  landingPath: string | null;
  campaign: string | null;
  source: string | null;
  referrer: string | null;
  lastAdKey: string | null;
  scores: GoalScores;
  origins: GoalOrigins;
  viewedProducts: string[];
  captureArrival: (input: ArrivalInput) => void;
  addSignal: (goal: HealthGoal, origin: SignalOrigin) => void;
  viewProduct: (product: { code: string; healthGoals: readonly HealthGoal[] }) => void;
}

/**
 * Mémoire silencieuse du parcours : d'où vient le visiteur et ce qu'il regarde.
 * Rien n'est demandé au visiteur ; ces signaux servent à deviner son besoin au moment du lead.
 */
export const useInterestStore = create<InterestState>()(
  persist(
    (set) => ({
      firstSeenAt: null,
      landingPath: null,
      campaign: null,
      source: null,
      referrer: null,
      lastAdKey: null,
      scores: {},
      origins: {},
      viewedProducts: [],

      captureArrival: ({ search, pathname, referrer }) =>
        set((state) => {
          const params = new URLSearchParams(search);
          const besoin = params.get("besoin");
          const campaign = params.get("utm_campaign");
          const content = params.get("utm_content");
          const source =
            [params.get("utm_source"), params.get("utm_medium")].filter(Boolean).join(" / ") || null;
          const adGoal = goalFromText(besoin) ?? goalFromText(campaign) ?? goalFromText(content);
          const adKey = [besoin, campaign, content].filter(Boolean).join("|") || null;

          const base = {
            firstSeenAt: state.firstSeenAt ?? new Date().toISOString(),
            landingPath: state.landingPath ?? pathname,
            referrer: state.referrer ?? (referrer || null),
            campaign: campaign ?? state.campaign,
            source: source ?? state.source,
          };
          if (adGoal && adKey !== state.lastAdKey) {
            return { ...base, lastAdKey: adKey, ...applySignal(state.scores, state.origins, adGoal, "pub") };
          }
          return base;
        }),

      addSignal: (goal, origin) =>
        set((state) => applySignal(state.scores, state.origins, goal, origin)),

      viewProduct: ({ code, healthGoals }) =>
        set((state) => {
          let next = { scores: state.scores, origins: state.origins };
          for (const goal of healthGoals) next = applySignal(next.scores, next.origins, goal, "produit");
          return {
            ...next,
            viewedProducts: [code, ...state.viewedProducts.filter((item) => item !== code)].slice(0, MAX_VIEWED),
          };
        }),
    }),
    { name: "forever-interest-v1", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
