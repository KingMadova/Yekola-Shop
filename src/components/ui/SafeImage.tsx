"use client";

import { ImageOff } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** next/image avec repli : si la photo est absente ou cassée, on affiche un emplacement neutre au lieu d'une image brisée. */
export function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role={props.alt ? "img" : undefined}
        aria-label={props.alt || undefined}
        aria-hidden={props.alt ? undefined : true}
        className="absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-800"
      >
        <ImageOff aria-hidden className="size-6" />
      </div>
    );
  }
  return <Image {...props} onError={() => setFailed(true)} />;
}
