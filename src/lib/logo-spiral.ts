// The logo mark: an S-shaped double spiral, nodding to the Euler spiral
// (clothoid). Two Archimedean coils, point-symmetric around the centre of the
// 32 unit logo grid, are joined by their common tangent through that centre.
// Shared by the header logo (src/components/Logo.tsx) and the favicon and PWA
// icons (scripts/generate-icons.mjs).

const TURNS = 2;
const CENTRE = 16;
// Centre of the upper coil, relative to the grid centre (y pointing up).
const COIL_X = 6;
const COIL_Y = 6;
const RADIUS = 6;
// Where each coil ends inside, so its centre stays open.
const INNER_ANGLE = Math.PI;
const SAMPLES = 240;

export const SPIRAL_STROKE_WIDTH = 1.45;

function spiralPath() {
  const sweep = TURNS * 2 * Math.PI;
  const spacing = RADIUS / sweep;
  // Pick the coil's outer end so its tangent points back through the grid
  // centre. An Archimedean spiral's tangent leans atan(1 / sweep) off the circle.
  let exit = -Math.PI / 2;
  for (let i = 0; i < 20; i++) {
    const towardCentre = Math.atan2(
      COIL_Y + RADIUS * Math.sin(exit),
      COIL_X + RADIUS * Math.cos(exit),
    );
    exit = towardCentre - Math.atan(1 / sweep) - Math.PI / 2;
  }

  // Upper coil, from its outer end winding inward.
  const coil = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const angle = sweep - ((sweep - INNER_ANGLE) * i) / SAMPLES;
    const r = spacing * angle;
    return [
      COIL_X + r * Math.cos(exit + sweep - angle),
      COIL_Y + r * Math.sin(exit + sweep - angle),
    ] as const;
  });
  const points = [
    ...coil.toReversed().map(([x, y]) => [-x, -y] as const),
    ...coil,
  ];
  const format = (n: number) => Number(n.toFixed(2));
  return `M${points
    .map(([x, y]) => `${format(CENTRE + x)} ${format(CENTRE - y)}`)
    .join('L')}`;
}

export const SPIRAL_PATH = spiralPath();
