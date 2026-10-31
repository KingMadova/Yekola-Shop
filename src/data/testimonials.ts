export interface Testimonial {
  name: string;
  city: string;
  /** Capture WhatsApp réelle, dans /public/images/testimonials/ (avec l'accord du client). */
  image: string;
  caption?: string;
}

/** Laissez vide tant que vous n'avez pas de captures réelles : la section ne s'affiche pas. */
export const TESTIMONIALS: readonly Testimonial[] = [];
