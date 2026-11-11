// Real markers on the depth ruler, shown as you sink past them. Each one has a source in zones.ts.
export type Landmark = { m: number; text: string; source: string };

export const landmarks: Landmark[] = [
  { m: 120, text: 'Giant siphonophores drift here', source: 'guinness' },
  { m: 200, text: 'Most sunlight is gone', source: 'noaaLight' },
  { m: 332, text: 'Deepest scuba dive ever', source: 'guinnessScuba' },
  { m: 564, text: 'Deepest dive by a bird, an emperor penguin', source: 'guinnessBird' },
  { m: 610, text: 'Sperm whales routinely hunt this deep', source: 'noaaSperm' },
  { m: 1000, text: 'No sunlight at all from here down', source: 'noaaLight' },
  { m: 3800, text: 'The Titanic rests here', source: 'noaaTitanic' },
  { m: 4000, text: 'The abyss begins', source: 'noaaLayers' },
  { m: 6000, text: 'The hadal zone begins: the deepest trenches', source: 'noaaLayers' },
  { m: 10935, text: 'Challenger Deep, the deepest point in the ocean', source: 'noaaChallenger' },
];
