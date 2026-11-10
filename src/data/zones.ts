// Every stage of the dive. Oldest light first: the page reads top to bottom in this order.
// Facts here must match a source in `sources`. Unknown means TODO(musa), never a guess.
import type { ImageMetadata } from 'astro';
import mimic from '../assets/zones/mimic-octopus.jpg';
import hatchet from '../assets/zones/hatchetfish.jpg';
import siphon from '../assets/zones/siphonophore.jpg';
import angler from '../assets/zones/anglerfish.jpg';

export type Part = { text: string; tell?: boolean; why: string };
export type Check = {
  kind: 'text' | 'email' | 'device';
  from: string;          // sender line or device name, shown in the message bar
  parts: Part[];         // tappable pieces of the message; exactly one has `tell`
  right: string;         // shown when the visitor taps the giveaway
};
export type Zone = {
  id: string;
  zone: string;          // "Sunlight zone"
  depth: [number, number]; // metres covered while this stage is on screen
  ground: string;        // field colour for this stage
  animal: string;
  latin: string;
  facts: string[];
  trick: { name: string; text: string[] };
  check: Check;
  photo: { src: ImageMetadata; alt: string; credit: string; licence: string; href: string };
  // How the lens frames the photo: focus point (0-1), extra zoom, and an optional deep-water tint
  // (multiplied in) for studio shots on pale backgrounds.
  frame: { x: number; y: number; zoom: number; tint?: string };
  sources: string[];     // keys into `sources`
};

export const surface = { ground: '#0d5274', depth: 0 };

export const zones: Zone[] = [
  {
    id: 'sunlight',
    zone: 'Sunlight zone',
    depth: [0, 75],
    ground: '#0b4865',
    animal: 'The mimic octopus',
    latin: 'Thaumoctopus mimicus',
    facts: [
      'Most octopuses hide. This one hunts in broad daylight on open sand, in full view of the fish that eat octopuses. It was only discovered in 1998, off Sulawesi in Indonesia.',
      'Its defence is to become something else. It flattens into a flatfish, trails its arms like the venomous spines of a lionfish, or hides six arms in a burrow so the other two look like a banded sea snake.',
      'It seems to pick the disguise that will scare whichever predator is in front of it.',
    ],
    trick: {
      name: 'The scam: impersonation',
      text: [
        'A scam message wears a disguise too: your bank, a delivery company, a relative with a new number. The name at the top is the costume, and anyone can type any name.',
        'Like the octopus, the scammer picks whichever disguise you are most likely to trust.',
      ],
    },
    check: {
      kind: 'text',
      from: 'Northway Bank',
      parts: [
        { text: 'Northway Bank:', why: 'The name looks right, and that is the trick. Anyone can make a text show any sender name.' },
        { text: "we've stopped a payment of £849.00 to J. Harris.", why: 'A scary amount is meant to rush you, but on its own it proves nothing. Look at what they want you to do.' },
        { text: 'If this was not you,', why: 'This part is ordinary. The giveaway is in what comes next.' },
        { text: 'call our fraud team now on 07700 900123.', tell: true, why: '' },
      ],
      right: 'Your bank will never text you a mobile number to call. Hang up, and ring the number on the back of your card instead.',
    },
    photo: {
      src: mimic,
      alt: 'A mimic octopus on dark sand, its striped brown and cream arms spread out and its eyes raised on stalks.',
      credit: 'Rickard Zerpe',
      licence: 'CC BY-SA 2.0',
      href: 'https://commons.wikimedia.org/wiki/File:Mimic_octopus_(Thaumoctopus_mimicus)_(16059533407).jpg',
    },
    frame: { x: 0.5, y: 0.45, zoom: 1.05 },
    sources: ['norman2001', 'noaaLayers'],
  },
  {
    id: 'colony',
    zone: 'Sunlight zone, deeper',
    depth: [75, 200],
    ground: '#0b405d',
    animal: 'The giant siphonophore',
    latin: 'Praya dubia',
    facts: [
      'It looks like one long animal. It is really a colony of many small bodies called zooids, joined together. Each has one job: some swim, some catch prey, some eat.',
      'Working as one, the giant siphonophore can grow to 40 or 50 metres long, which makes it one of the longest animals on Earth. The whole colony glows a soft blue.',
    ],
    trick: {
      name: 'The scam: botnets',
      text: [
        'A botnet is a colony too. Criminals quietly take over thousands of ordinary devices, like cameras, routers and doorbells, and make them act as one, to knock websites offline or send scam messages.',
        'In 2016 a botnet called Mirai took over huge numbers of cameras and video recorders using a short list of about 60 factory passwords. Their owners never knew.',
      ],
    },
    check: {
      kind: 'device',
      from: 'Hallway camera · settings',
      parts: [
        { text: 'Software: up to date', why: 'Up-to-date software is good. Something else on this screen is the open door.' },
        { text: 'Wi-Fi: connected', why: 'Being online is normal. Look for the setting that anyone could guess.' },
        { text: 'Admin password: admin', tell: true, why: '' },
        { text: 'Night vision: on', why: 'Harmless. Look for the setting that anyone could guess.' },
      ],
      right: "A factory password like 'admin' is the first thing a botnet tries. Change it on every camera, router and smart device when you set it up.",
    },
    photo: {
      src: siphon,
      alt: 'A giant siphonophore glowing pale blue-green against black water: a long, thin, beaded chain looping across the frame.',
      credit: 'Catriona Munro, Stefan Siebert, Felipe Zapata, Mark Howison, Alejandro Damian-Serrano, Samuel H. Church, Freya E. Goetz, Philip R. Pugh, Steven H. D. Haddock and Casey W. Dunn',
      licence: 'CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Praya_dubia_(Giant_siphonophore).jpg',
    },
    frame: { x: 0.55, y: 0.5, zoom: 1.0 },
    sources: ['guinness', 'cisaMirai'],
  },
  {
    id: 'twilight',
    zone: 'Twilight zone',
    depth: [200, 1000],
    ground: '#082a3d',
    animal: 'The hatchetfish',
    latin: 'Sternoptychidae',
    facts: [
      'Below 200 metres the sunlight is almost gone. What little is left comes straight down from above, so predators hunt by looking up for a dark shape against the glow.',
      'The hatchetfish has a row of light organs, called photophores, along its belly. They glow to match the faint light from above and erase its shadow. This is called counter-illumination.',
      'Some even have light organs that shine back into their own eyes, so they can judge how brightly to glow.',
    ],
    trick: {
      name: 'The scam: look-alike addresses',
      text: [
        'A fake website hides the same way: by matching the real one almost perfectly. The page looks right and the logo looks right. Only the address is different, and only if you look closely.',
        'parcelpost-redelivery.co is not parcelpost.co.uk. A brand name with extra words bolted on is a different website.',
      ],
    },
    check: {
      kind: 'text',
      from: 'ParcelPost',
      parts: [
        { text: 'ParcelPost:', why: 'Any sender can use this name. Look at where the message wants to send you.' },
        { text: 'we could not deliver your parcel today.', why: 'Plenty of real parcels miss a delivery, so this line alone tells you nothing.' },
        { text: 'Pay the £1.45 redelivery fee', why: 'A tiny fee is a common hook, because nobody thinks twice about £1.45. But the clearest giveaway is the address.' },
        { text: 'at parcelpost-redelivery.co', tell: true, why: '' },
      ],
      right: 'The real company would use its own address, parcelpost.co.uk. Extra words bolted onto a brand name make it a different website. Type the address yourself instead of tapping a link.',
    },
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
    zone: 'Midnight zone',
    depth: [1000, 4000],
    ground: '#03121a',
    animal: 'The deep-sea anglerfish',
    latin: 'Melanocetus johnsonii',
    facts: [
      'Below 1,000 metres no sunlight reaches at all. The only light down here is made by animals.',
      'A female anglerfish carries a fishing rod: the first spine of her back fin, tipped with a small sac called an esca, full of glowing bacteria.',
      'She does not chase anything. In total darkness the light is the only thing to swim towards, so she waits for her prey to come to her.',
    ],
    trick: {
      name: 'The scam: phishing',
      text: [
        'Phishing works the same way. The bait is something you want: a refund, a prize, a parcel, or a warning you feel you must act on.',
        'The scammer does not have to break in. They dangle the light and wait for you to click.',
      ],
    },
    check: {
      kind: 'email',
      from: 'HM Tax Office',
      parts: [
        { text: 'Dear customer,', why: 'Vague, but not the lure itself. What is being dangled in front of you?' },
        { text: 'you are due a tax refund of £326.18.', tell: true, why: '' },
        { text: 'Claim it before midnight', why: 'The deadline is there to stop you thinking, but it only works because of the bait before it.' },
        { text: 'using the secure link below.', why: "Calling a link 'secure' does not make it so. What made you want to click in the first place?" },
      ],
      right: 'The free money is the lure. Tax refunds are never offered out of the blue by email or text with a link. If you think you are owed one, go to the official website yourself.',
    },
    photo: {
      src: angler,
      alt: 'A black deep-sea anglerfish with a huge jaw of needle teeth and a single thin rod rising from its head.',
      credit: 'Emőke Dénes',
      licence: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Hal_-_Melanocetus_johnsonii_-_4.jpg',
    },
    frame: { x: 0.66, y: 0.5, zoom: 1.0, tint: '#3e6670' },
    sources: ['mbariAngler', 'noaaLight', 'noaaLayers'],
  },
];

export const abyss = { ground: '#000000', depth: [4000, 4500] as [number, number] };

export const sunlightPhoto = {
  alt: 'Sunbeams slanting down through clear blue water onto a sandy sea floor.',
  credit: 'yawning hunter',
  licence: 'CC BY 2.0',
  href: 'https://www.flickr.com/photos/192679240@N05/53623127175',
};

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
  cisaMirai: { title: 'Heightened DDoS threat posed by Mirai and other botnets (TA16-288A)', by: 'CISA (2016)', href: 'https://www.cisa.gov/news-events/alerts/2016/10/14/heightened-ddos-threat-posed-mirai-and-other-botnets' },
};
