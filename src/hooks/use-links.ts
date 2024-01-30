import { createMemo, type Accessor } from "solid-js";
import { Cog, Link, Rotation } from "../model";
import { getNeighborsCogs, isSameCog } from "../utils/cog.utils";
import { isSamePoint } from "../utils/geometry.utils";

function isLinkBroken(a: Cog, b: Cog) {
  if (a.rotation === Rotation.None || b.rotation === Rotation.None) return false;
  return a.rotation === b.rotation;
}

export function useLinks(cogs: Accessor<Cog[]>) {
  return createMemo<Link[]>(() => {
    const links: Link[] = [];

    function addLink(link: Link) {
      const exists = links
        .map((l) => l.points)
        .some(([from, to]) => link.points.every((p) => isSamePoint(p, from) || isSamePoint(p, to)));

      if (!exists) links.push(link);
    }

    for (const cog of cogs()) {
      const others = cogs().filter((c) => !isSameCog(c, cog));

      for (const other of getNeighborsCogs(cog, others)) {
        addLink({
          points: [cog.position, other.position],
          broken: isLinkBroken(cog, other),
        });
      }
    }

    return links;
  });
}
