import type { ServiceKey } from "@/data/site";
import {
  SchematicBoard,
  SchematicBreaker,
  SchematicLight,
  SchematicSocket,
} from "@/components/site/Schematics";

const art = {
  board: SchematicBoard,
  breaker: SchematicBreaker,
  light: SchematicLight,
  socket: SchematicSocket,
};

/* The technical drawing that stands for each service. */
export function ServiceArt({
  kind,
  className,
  title,
}: {
  kind: ServiceKey;
  className?: string;
  title?: string;
}) {
  const Art = art[kind];
  return <Art {...(className ? { className } : {})} {...(title ? { title } : {})} />;
}
