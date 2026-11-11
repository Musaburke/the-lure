// Real markers on the depth ruler, shown as you sink past them. Each one has a source in zones.ts.
// `short` labels the dot on the ruler; `text` is the full line the gauge shows once you pass it.
export type Landmark = { m: number; short: string; text: string; source: string };

export const landmarks: Landmark[] = [
  { m: 120, short: 'Siphonophores', text: 'Giant siphonophores drift here', source: 'guinness' },
  { m: 200, short: 'Sunlight fades', text: 'Most sunlight is gone', source: 'noaaLight' },
  { m: 332, short: 'Scuba record', text: 'Deepest scuba dive ever', source: 'guinnessScuba' },
  { m: 564, short: 'Penguin record', text: 'Deepest dive by a bird, an emperor penguin', source: 'guinnessBird' },
  { m: 610, short: 'Sperm whales', text: 'Sperm whales routinely hunt this deep', source: 'noaaSperm' },
  { m: 1000, short: 'Total darkness', text: 'No sunlight at all from here down', source: 'noaaLight' },
  { m: 3800, short: 'Titanic', text: 'The Titanic rests here', source: 'noaaTitanic' },
  { m: 4000, short: 'The abyss', text: 'The abyss begins', source: 'noaaLayers' },
  { m: 6000, short: 'Hadal zone', text: 'The hadal zone begins: the deepest trenches', source: 'noaaLayers' },
  { m: 10935, short: 'Challenger Deep', text: 'Challenger Deep, the deepest point in the ocean', source: 'noaaChallenger' },
];
