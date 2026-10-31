import { HEALTH_GOAL_SLUGS } from "./config";
import { HEALTH_GOALS, type HealthGoal } from "./types";

/** D'où vient le signal de besoin : plus il est explicite, plus il pèse. */
export type SignalOrigin = "choix" | "pub" | "catalogue" | "panier" | "produit";
export type GoalScores = Partial<Record<HealthGoal, number>>;
export type GoalOrigins = Partial<Record<HealthGoal, SignalOrigin[]>>;

export const SIGNAL_WEIGHTS: Record<SignalOrigin, number> = {
  choix: 100,
  pub: 5,
  catalogue: 3,
  panier: 2,
  produit: 1,
};

export const ORIGIN_LABELS: Record<SignalOrigin, string> = {
  choix: "choisi dans le pop-up",
  pub: "publicité",
  catalogue: "filtre catalogue",
  panier: "panier",
  produit: "fiche produit",
};

const KEYWORDS: ReadonlyArray<readonly [HealthGoal, RegExp]> = [
  ["Digestion & Ventre plat", /digest|ventre|intestin|transit/],
  ["Articulations & Mobilité", /articul|mobilit|\bdos\b|genou/],
  ["Vitalité & Forme Masculine", /vitalit|masculin|homme|energie|énergie/],
  ["Peau & Teint Éclatant", /peau|teint|beaut/],
  ["Détox & Perte de Poids", /detox|détox|minceur|poids|\bc9\b|clean ?9/],
  ["Défenses Immunitaires", /immun|defense|défense|tonus/],
];

/** Reconnaît un besoin dans un slug (?besoin=digestion) ou un nom de campagne (utm_campaign=digestion-30-jours). */
export function goalFromText(text: string | null | undefined): HealthGoal | null {
  if (!text) return null;
  const value = text.toLowerCase();
  const bySlug = HEALTH_GOALS.find((goal) => HEALTH_GOAL_SLUGS[goal] === value);
  if (bySlug) return bySlug;
  return KEYWORDS.find(([, pattern]) => pattern.test(value))?.[0] ?? null;
}

export function applySignal(
  scores: GoalScores,
  origins: GoalOrigins,
  goal: HealthGoal,
  origin: SignalOrigin,
): { scores: GoalScores; origins: GoalOrigins } {
  const known = origins[goal] ?? [];
  return {
    scores: { ...scores, [goal]: (scores[goal] ?? 0) + SIGNAL_WEIGHTS[origin] },
    origins: { ...origins, [goal]: known.includes(origin) ? known : [...known, origin] },
  };
}

/** Besoins classés du plus au moins probable (à égalité : ordre officiel). */
export function rankGoals(scores: GoalScores): HealthGoal[] {
  return HEALTH_GOALS.filter((goal) => (scores[goal] ?? 0) > 0).sort(
    (a, b) => (scores[b] ?? 0) - (scores[a] ?? 0),
  );
}

export interface NeedProfile {
  need: HealthGoal | null;
  origins: SignalOrigin[];
  others: HealthGoal[];
}

/** Synthèse au moment du lead : parcours du visiteur + panier + choix explicite éventuel. */
export function buildNeedProfile(input: {
  scores: GoalScores;
  origins: GoalOrigins;
  chosen: HealthGoal | null;
  cartGoals: readonly HealthGoal[];
}): NeedProfile {
  let state = { scores: input.scores, origins: input.origins };
  for (const goal of input.cartGoals) state = applySignal(state.scores, state.origins, goal, "panier");
  if (input.chosen) state = applySignal(state.scores, state.origins, input.chosen, "choix");

  const [need = null, ...others] = rankGoals(state.scores);
  return { need, origins: need ? (state.origins[need] ?? []) : [], others: others.slice(0, 3) };
}
