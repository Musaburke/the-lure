// Every stage of the dive, top to bottom. Each tells one story in three beats:
// the animal's trick, the same trick online, then a spot-the-fake challenge from the question bank.
// Facts here must match a source in `sources`. Unknown means TODO(musa), never a guess.
import type { ImageMetadata } from 'astro';
import type { Scam } from './questions';
import mimic from '../assets/zones/mimic-octopus.jpg';
import hatchet from '../assets/zones/hatchetfish.jpg';
import siphon from '../assets/zones/siphonophore.jpg';
import angler from '../assets/zones/anglerfish.jpg';
import sharks from '../assets/zones/surface-sharks.jpg';

export type Zone = {
  id: string;
  scam: Scam;
  zone: string;            // "Sunlight zone"
  depth: [number, number]; // metres covered while this stage is on screen
  ground: string;          // field colour for this stage
  animal: string;
  latin: string;
  trick: { head: string; facts: string[] };   // beat 1: what the animal does
  online: { head: string; text: string[] };   // beat 2: the same trick, done by scammers
  challenge: string;                          // beat 3: heading over the spot-the-fake question
  photo: { src: ImageMetadata; alt: string; credit: string; licence: string; href: string };
  // How the lens frames the photo: focus point (0-1), extra zoom, and an optional deep-water tint
  // (multiplied in) for studio shots on pale backgrounds.
  frame: { x: number; y: number; zoom: number; tint?: string };
  sources: string[];       // keys into `sources`
};

export const surface = {
  ground: '#0d5274',
  depth: 0,
  photo: {
    src: sharks,
    alt: 'Two Caribbean reef sharks gliding through bright blue water, with sunbeams slanting down onto rippled white sand.',
    credit: 'Dennis Hipp',
    licence: 'CC0',
    href: 'https://wordpress.org/photos/photo/45165a8fc8/',
  },
  frame: { x: 0.45, y: 0.4, zoom: 1.0 },
};

export const zones: Zone[] = [
  {
    id: 'sunlight',
    scam: 'disguise',
    zone: 'Sunlight zone',
    depth: [0, 75],
    ground: '#0b4865',
    animal: 'The mimic octopus',
    latin: 'Thaumoctopus mimicus',
    trick: {
      head: 'It survives by disguise',
      facts: [
        'Most octopuses hide. This one hunts in broad daylight on open sand, in full view of the fish that eat octopuses. It was only discovered in 1998, off Sulawesi in Indonesia.',
        'Instead of hiding, it pretends to be something dangerous. It flattens into a flatfish, trails its arms like the venomous spines of a lionfish, or hides six arms in a burrow so the other two look like a banded sea snake.',
        'It seems to pick whichever disguise will scare the predator in front of it.',
      ],
    },
    online: {
      head: 'Scammers use disguises too',
      text: [
        'They pretend to be someone you already trust: your bank, a delivery company, your boss, or your own child with "a new number". Anyone can make a text or email show any name.',
        'Like the octopus, they pick the disguise you are least likely to question, then ask for something that person never would: money, a code, your password.',
      ],
    },
    challenge: 'Find the disguise',
    photo: {
      src: mimic,
      alt: 'A mimic octopus on dark sand, its striped brown and cream arms spread out and its eyes raised on stalks.',
      credit: 'Rickard Zerpe',
      licence: 'CC BY-SA 2.0',
      href: 'https://commons.wikimedia.org/wiki/File:Mimic_octopus_(Thaumoctopus_mimicus)_(16059533407).jpg',
    },
    frame: { x: 0.5, y: 0.42, zoom: 1.0 },
    sources: ['norman2001', 'noaaLayers'],
  },
  {
    id: 'colony',
    scam: 'crowd',
    zone: 'Sunlight zone, deeper',
    depth: [75, 200],
    ground: '#0b405d',
    animal: 'The giant siphonophore',
    latin: 'Praya dubia',
    trick: {
      head: 'Many small bodies pose as one big animal',
      facts: [
        'It looks like one long creature. It is really a colony of tiny bodies called zooids, joined together. Each has one job: some swim, some catch prey, some eat.',
        'Together they can stretch 40 to 50 metres, one of the longest animals on Earth, and glow a soft blue to draw prey into a curtain of stinging threads.',
      ],
    },
    online: {
      head: 'Scammers fake a crowd',
      text: [
        'One seller can pose as thousands of happy customers: fake reviews, bought followers, "10,000 sold" counters and "41 people are looking at this" pop-ups.',
        'A big crowd feels safe, so a fake one makes a bad shop look popular. Fake reviews have been illegal in the UK since April 2025, but they are still everywhere.',
      ],
    },
    challenge: 'Find the fake crowd',
    photo: {
      src: siphon,
      alt: 'A giant siphonophore glowing pale blue-green against black water: a long, thin, beaded chain looping across the frame.',
      credit: 'Catriona Munro, Stefan Siebert, Felipe Zapata, Mark Howison, Alejandro Damian-Serrano, Samuel H. Church, Freya E. Goetz, Philip R. Pugh, Steven H. D. Haddock and Casey W. Dunn',
      licence: 'CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Praya_dubia_(Giant_siphonophore).jpg',
    },
    frame: { x: 0.56, y: 0.5, zoom: 1.0 },
    sources: ['guinness', 'cmaReviews'],
  },
  {
    id: 'twilight',
    scam: 'lookalike',
    zone: 'Twilight zone',
    depth: [200, 1000],
    ground: '#082a3d',
    animal: 'The hatchetfish',
    latin: 'Sternoptychidae',
    trick: {
      head: 'It blends into the light',
      facts: [
        'Below 200 metres, predators hunt by looking up for a dark shape against the last faint light from above.',
        'The hatchetfish has a row of light organs, called photophores, along its belly. They glow to match the light from above and erase its shadow. From below, it vanishes. This is called counter-illumination.',
      ],
    },
    online: {
      head: 'Fake websites blend in too',
      text: [
        'A fake site copies the real one so closely that nothing looks wrong: same logo, same colours. The only difference is the address, and it is made to look almost identical.',
        'parcelpost-redelivery.co is not parcelpost.co.uk. iarkspur.co.uk starts with an i, not an l. The part just before .co.uk or .com is the website you are really on.',
      ],
    },
    challenge: 'Find the fake address',
    photo: {
      src: hatchet,
      alt: 'A silvery hatchetfish seen side-on, with a deep, flat body, large eye and a row of light organs along its belly.',
      credit: 'NOAA/NMFS/SEFSC Pascagoula Laboratory; collection of Brandi Noble',
      licence: 'Public domain',
      href: 'https://commons.wikimedia.org/wiki/File:ArgyropelecusAculeatus.jpg',
    },
    frame: { x: 0.4, y: 0.5, zoom: 1.0, tint: '#5d8792' },
    sources: ['penn2017', 'duke2020', 'noaaLayers'],
  },
  {
    id: 'midnight',
    scam: 'bait',
    zone: 'Midnight zone',
    depth: [1000, 4000],
    ground: '#03121a',
    animal: 'The deep‑sea anglerfish',
    latin: 'Melanocetus johnsonii',
    trick: {
      head: 'It dangles a glowing lure',
      facts: [
        'Below 1,000 metres no sunlight reaches at all. The only light down here is made by animals.',
        'A female anglerfish carries a fishing rod: the first spine of her back fin, tipped with a small sac called an esca, full of glowing bacteria.',
        'She does not chase anything. In total darkness the light is the only thing to swim towards, so she waits for her prey to come to her.',
      ],
    },
    online: {
      head: 'Scammers dangle bait',
      text: [
        'The bait is something you want: a refund, a prize, a parcel, easy money, or a warning you feel you must fix right now.',
        'The scammer does not have to break in. They dangle the light, add a deadline, and wait for you to click.',
      ],
    },
    challenge: 'Find the bait',
    photo: {
      src: angler,
      alt: 'A black deep-sea anglerfish with a huge jaw of needle teeth and a single thin rod rising from its head.',
      credit: 'Emőke Dénes',
      licence: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Hal_-_Melanocetus_johnsonii_-_4.jpg',
    },
    frame: { x: 0.66, y: 0.5, zoom: 1.0, tint: '#4a7680' },
    sources: ['mbariAngler', 'noaaLight', 'noaaLayers'],
  },
];

export const abyss = { ground: '#000000', depth: [4000, 4500] as [number, number] };

export const sources: Record<string, { title: string; by: string; href: string }> = {
  noaaLayers: { title: 'Layers of the ocean', by: 'NOAA', href: 'https://www.noaa.gov/jetstream/ocean/layers-of-ocean' },
  noaaLight: { title: 'How far does light travel in the ocean?', by: 'NOAA Ocean Service', href: 'https://oceanservice.noaa.gov/facts/light_travel.html' },
  noaaPressure: { title: 'How does pressure change with ocean depth?', by: 'NOAA Ocean Service', href: 'https://oceanservice.noaa.gov/facts/pressure.html' },
  noaaDeep: { title: 'What is the deep ocean like?', by: 'NOAA Ocean Exploration', href: 'https://oceanexplorer.noaa.gov/facts/deep-habitat.html' },
  smithsonianGlow: { title: 'Bioluminescence', by: 'Smithsonian Ocean', href: 'https://ocean.si.edu/ocean-life/fish/bioluminescence' },
  norman2001: { title: 'Dynamic mimicry in an Indo-Malayan octopus', by: 'Norman, Finn and Tregenza, Proceedings of the Royal Society B (2001)', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1088805/' },
  penn2017: { title: 'How hatchetfish camouflage in the deep sea', by: 'Penn Today, University of Pennsylvania', href: 'https://penntoday.upenn.edu/news/penn-physicists-investigate-how-hatchetfish-camouflage-deep-sea' },
  duke2020: { title: 'Lights in the eyes for better disguise', by: 'Duke Today, Duke University (2020)', href: 'https://today.duke.edu/2020/06/lights-eyes-better-disguise' },
  guinness: { title: 'Longest bioluminescent animal', by: 'Guinness World Records', href: 'https://www.guinnessworldrecords.com/world-records/675993-longest-bioluminescent-animal' },
  mbariAngler: { title: 'Deep-sea anglerfish', by: 'Monterey Bay Aquarium Research Institute (MBARI)', href: 'https://www.mbari.org/animal/deep-sea-anglerfish/' },
  cmaReviews: { title: 'Fake reviews guidance (CMA208)', by: 'Competition and Markets Authority (2025)', href: 'https://assets.publishing.service.gov.uk/media/67eeb64fe9c76fa33048c790/CMA208_-_Fake_reviews_guidance.pdf' },
  guinnessScuba: { title: 'Ahmed Gabr breaks record for deepest scuba dive', by: 'Guinness World Records (2014)', href: 'https://www.guinnessworldrecords.com/news/2014/9/ahmed-gabr-breaks-record-for-deepest-scuba-dive-at-more-than-1000-feet-60537' },
  guinnessBird: { title: 'Deepest dive by a bird', by: 'Guinness World Records', href: 'https://www.guinnessworldrecords.com/world-records/deepest-dive-by-a-bird' },
  noaaSperm: { title: 'Sperm whale', by: 'NOAA Fisheries', href: 'https://www.fisheries.noaa.gov/species/sperm-whale' },
  noaaChallenger: { title: 'The depth of the Challenger Deep (2021 study)', by: 'NOAA', href: 'https://repository.library.noaa.gov/view/noaa/33477' },
  noaaTitanic: { title: 'Titanic bow', by: 'NOAA Ocean Exploration', href: 'https://oceanexplorer.noaa.gov/multimedia/daily-image-media-20210415/' },
};
