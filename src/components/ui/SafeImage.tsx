"use client";

import { ImageOff } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** Image avec repli visuel neutre aux couleurs de la boutique si le chargement échoue. */
export function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role={props.alt ? "img" : undefined}
        aria-label={props.alt || undefined}
        aria-hidden={props.alt ? undefined : true}
        className="absolute inset-0 flex items-center justify-center bg-[#fff0df] text-[#c1440e]"
      >
        <ImageOff aria-hidden className="size-6" />
      </div>
    );
  }
  return <Image {...props} onError={() => setFailed(true)} />;
}
