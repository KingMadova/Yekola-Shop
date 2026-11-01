export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35]";
const base = `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-center font-semibold transition-colors ${focusRing}`;
export const btn = base;
export const btnPrimary = `${base} bg-[#173f35] text-white hover:bg-[#10352d]`;
export const btnOutline = `${base} border border-[#173f35] bg-white text-[#173f35] hover:bg-[#f0f2eb]`;
export const btnWhatsApp = `${base} bg-[#176b55] text-white hover:bg-[#125640]`;
export const card = "rounded-2xl border border-[#e9e5d9] bg-white";
export const container = "mx-auto w-full max-w-6xl px-4";
