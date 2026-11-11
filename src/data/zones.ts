// Every stage of the dive, top to bottom. Each tells one story in five beats: the animal's trick,
// the same trick online, how one real scam of that kind plays out, the real UK numbers, then a
// spot-the-fake challenge from the question bank.
// Facts here must match a source in `sources`. Unknown means TODO(musa), never a guess.
import type { ImageMetadata } from 'astro';
import type { Scam } from './questions';
import mimic from '../assets/zones/mimic-octopus.jpg';
import hatchet from '../assets/zones/hatchetfish.jpg';
import siphon from '../assets/zones/siphonophore.jpg';
import angler from '../assets/zones/anglerfish.jpg';
import sharks from '../assets/zones/surface-sharks.jpg';
import beluga from '../assets/zones/beluga.jpg';

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
  // beat 3: one realistic scam, step by step; `stop` is the step where you could have walked away
  playout: { head: string; steps: string[]; stop: number; stopText: string };
  numbers: { figure: string; text: string; source: string }[]; // beat 4: sourced UK figures
  challenge: string;                          // beat 5: heading over the spot-the-fake question
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
    ground: '#0c4a5f',
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
    playout: {
      head: 'How a safe-account scam plays out',
      steps: [
        'A text from "Northway Bank" lands in the same thread as your real bank texts. It says a £849 payment has been stopped and gives a number to call.',
        'A calm "fraud team" answers. They know your name, your address and the last four digits of your card. Details like these are sold from old data leaks.',
        'They say your account has been compromised, possibly by someone inside the bank, so you must not mention it to branch staff.',
        'To protect your savings, you are asked to move them today to a new "safe account" in your name.',
        'The money leaves in minutes and is split across accounts run by the criminals. The "fraud team" stops answering.',
      ],
      stop: 0,
      stopText: 'A bank never asks you to ring a number sent by text. Use the one on the back of your card.',
    },
    numbers: [
      { figure: 'Down 12%', text: 'Losses to impersonation scams fell 12% in 2025 and cases fell 11%, while purchase, investment and romance scams all grew.', source: 'ukf2026' },
    ],
    challenge: 'Find the disguise',
    photo: {
      src: mimic,
      alt: 'A mimic octopus on dark sand, its striped brown and cream arms spread out and its eyes raised on stalks.',
      credit: 'Rickard Zerpe',
      licence: 'CC BY-SA 2.0',
      href: 'https://commons.wikimedia.org/wiki/File:Mimic_octopus_(Thaumoctopus_mimicus)_(16059533407).jpg',
    },
    frame: { x: 0.5, y: 0.42, zoom: 1.0 },
    sources: ['norman2001', 'noaaLayers', 'ukf2026'],
  },
  {
    id: 'colony',
    scam: 'crowd',
    zone: 'Sunlight zone, deeper',
    depth: [75, 200],
    ground: '#0f4048',
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
    playout: {
      head: 'How a fake shop plays out',
      steps: [
        'An advert offers walking boots at 60% off. The shop has a 4.9-star rating from more than 2,000 reviews.',
        'The reviews were all posted within two weeks, and many repeat the same few phrases.',
        'At checkout there is an extra 10% off if you pay by bank transfer instead of card.',
        'An order confirmation arrives. The tracking number never updates.',
        'A month later the website has gone. A card payment could be charged back; for a bank transfer you have to make a scam claim and hope.',
      ],
      stop: 2,
      stopText: 'A shop that wants a bank transfer instead of a card is asking you to give up your protection.',
    },
    numbers: [
      { figure: '71%', text: 'of all bank-transfer scam cases in the UK in 2025 were purchase scams: paying for something that never arrived.', source: 'ukf2026' },
      { figure: '£118.1m', text: 'lost to purchase scams in 2025, up 20% on the year before.', source: 'ukf2026' },
    ],
    challenge: 'Find the fake crowd',
    photo: {
      src: siphon,
      alt: 'A giant siphonophore glowing pale blue-green against black water: a long, thin, beaded chain looping across the frame.',
      credit: 'Catriona Munro, Stefan Siebert, Felipe Zapata, Mark Howison, Alejandro Damian-Serrano, Samuel H. Church, Freya E. Goetz, Philip R. Pugh, Steven H. D. Haddock and Casey W. Dunn',
      licence: 'CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Praya_dubia_(Giant_siphonophore).jpg',
    },
    frame: { x: 0.56, y: 0.5, zoom: 1.0 },
    sources: ['guinness', 'cmaReviews', 'ukf2026'],
  },
  {
    id: 'twilight',
    scam: 'lookalike',
    zone: 'Twilight zone',
    depth: [200, 600],
    ground: '#11302e',
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
    playout: {
      head: 'How a parcel text plays out',
      steps: [
        'A text says ParcelPost could not deliver your parcel. To rebook, pay £1.45 at parcelpost-redelivery.co.',
        'The website is a perfect copy of the real one: logo, colours, tracking page.',
        'You enter your card details. The payment "fails" and asks you to try again, so they get your details twice.',
        'Days later, "your bank" calls about a suspicious £1.45 payment. They know about it because they took it.',
        'From here it becomes a safe-account call, and your savings are the target.',
      ],
      stop: 0,
      stopText: 'Read the address before you tap: the name right before .co is the website you are really on.',
    },
    numbers: [
      { figure: '£423.5m', text: 'taken in 2025 using stolen card details online, across 3.2 million cases. Card details are what fake websites are built to collect.', source: 'ukf2026' },
      { figure: '66%', text: 'of bank-transfer scam cases in 2025 started online.', source: 'ukf2026' },
    ],
    challenge: 'Find the fake address',
    photo: {
      src: hatchet,
      alt: 'A silvery hatchetfish seen side-on, with a deep, flat body, large eye and a row of light organs along its belly.',
      credit: 'NOAA/NMFS/SEFSC Pascagoula Laboratory; collection of Brandi Noble',
      licence: 'Public domain',
      href: 'https://commons.wikimedia.org/wiki/File:ArgyropelecusAculeatus.jpg',
    },
    frame: { x: 0.4, y: 0.5, zoom: 1.0, tint: '#4c7466' },
    sources: ['penn2017', 'duke2020', 'noaaLayers', 'ukf2026'],
  },
  {
    id: 'voices',
    scam: 'voice',
    zone: 'Twilight zone, deeper',
    depth: [600, 1000],
    ground: '#0f2826',
    animal: 'The beluga whale',
    latin: 'Delphinapterus leucas',
    trick: {
      head: 'One learned to speak like us',
      facts: [
        'Belugas spend the summer in shallow Arctic coastal water, but they hunt deep. NOAA says they dive to 1,000 metres for up to 25 minutes, and one tagged male reached 956 metres.',
        'In 1984, people at the US Navy\'s marine mammal programme in San Diego heard what sounded like people talking near the whale pens. Nobody was there. A diver surfaced asking who had told him to get out.',
        'It was a beluga called NOC. Recordings showed he dropped his calls several octaves and copied the rhythm of human speech. He kept it up for about four years.',
      ],
    },
    online: {
      head: 'Scammers borrow a voice',
      text: [
        'A phone call feels more real than a text, so scammers make it sound right: your bank\'s real number on the screen, a calm "fraud team", or a voice cloned from a few seconds of someone\'s social media video.',
        'Caller ID can be faked, so a familiar number proves nothing. The only safe check is to hang up and call back on a number you already have, ideally from a different phone.',
      ],
    },
    playout: {
      head: 'How a cloned-voice call plays out',
      steps: [
        'An unknown number rings. It is your son\'s voice, panicked: he has crashed the car and his phone is broken.',
        'A "solicitor" takes over the call. To keep him out of a cell tonight, £2,000 is needed for the other driver.',
        'You are told not to tell anyone yet, to spare him the embarrassment.',
        'You send the money. Then you ring your son on his usual number, and he is at work, fine.',
      ],
      stop: 0,
      stopText: 'Hang up and call him on the number you have saved. A family safe phrase settles it in seconds.',
    },
    numbers: [
      { figure: '17%', text: 'of bank-transfer scam cases in 2025 started with a call or text, yet they made up 28% of all the money lost.', source: 'ukf2026' },
      { figure: '28%', text: 'of UK adults in a 2024 survey of 3,000 people believed they had been targeted by an AI voice-cloning scam in the past year.', source: 'starling2024' },
    ],
    challenge: 'Find the borrowed voice',
    photo: {
      src: beluga,
      alt: 'A white beluga whale in an aquarium, swimming face-on towards the camera through dim green water, its rounded forehead catching the light.',
      credit: 'Versions111',
      licence: 'CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Beluga_Whale_02.jpg',
    },
    frame: { x: 0.42, y: 0.5, zoom: 1.0 },
    sources: ['ridgway2012', 'noaaBeluga', 'physBeluga', 'ofcomSpoof', 'starling2024', 'ukf2026'],
  },
  {
    id: 'midnight',
    scam: 'bait',
    zone: 'Midnight zone',
    depth: [1000, 4000],
    ground: '#0b1716',
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
    playout: {
      head: 'How an investment scam plays out',
      steps: [
        'An advert shows a famous TV presenter "revealing" the trading platform that made them rich.',
        'You put in £250. A dashboard shows it growing every day, and a friendly "account manager" calls to check in.',
        'You withdraw £100 and it arrives. The payout is there to win your trust.',
        'You invest your savings. When you try to take it out, there is a "tax" or "release fee" to pay first.',
        'You pay it, and another fee appears. The dashboard was never real.',
      ],
      stop: 0,
      stopText: 'Celebrities are used in these adverts without their knowledge. Check any firm on the FCA register before you pay a penny.',
    },
    numbers: [
      { figure: '£221.5m', text: 'lost to investment scams in 2025, the biggest share of all bank-transfer scam losses.', source: 'ukf2026' },
      { figure: 'Up 40%', text: 'on the year before, from 14,893 cases.', source: 'ukf2026' },
    ],
    challenge: 'Find the bait',
    photo: {
      src: angler,
      alt: 'A black deep-sea anglerfish with a huge jaw of needle teeth and a single thin rod rising from its head.',
      credit: 'Emőke Dénes',
      licence: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Hal_-_Melanocetus_johnsonii_-_4.jpg',
    },
    frame: { x: 0.66, y: 0.5, zoom: 1.0, tint: '#365a4f' },
    sources: ['mbariAngler', 'noaaLight', 'noaaLayers', 'ukf2026', 'fcaRegister'],
  },
];

export const abyss = { ground: '#030706', depth: [4000, 4500] as [number, number] };

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
  ukf2026: { title: 'Annual Fraud Report 2026 (figures for 2025)', by: 'UK Finance', href: 'https://www.ukfinance.org.uk/news-and-insight/press-release/fraud-report-2026-press-release' },
  ridgway2012: { title: 'Captive beluga whale imitated human voices (on Ridgway et al., Current Biology, 2012)', by: 'Scientific American', href: 'https://www.scientificamerican.com/article/captive-beluga-whale-imitated-human-voices/' },
  noaaBeluga: { title: 'Beluga whale', by: 'NOAA Fisheries', href: 'https://www.fisheries.noaa.gov/species/beluga-whale' },
  physBeluga: { title: 'Beluga whales dive to great depth to catch cod (2016)', by: 'Associated Press, via Phys.org', href: 'https://phys.org/news/2016-02-beluga-whales-great-depth-cod.html' },
  ofcomSpoof: { title: 'Cracking down on scam calls from abroad', by: 'Ofcom', href: 'https://www.ofcom.org.uk/phones-and-broadband/scam-calls-and-messages/cracking-down-on-scam-calls-from-abroad' },
  starling2024: { title: 'AI voice cloning scam warning issued by bank (2024)', by: 'ITV News, on Starling Bank research', href: 'https://www.itv.com/news/2024-09-17/ai-voice-cloning-scam-warning-issued-by-bank' },
  fcaRegister: { title: 'The Financial Services Register', by: 'Financial Conduct Authority', href: 'https://register.fca.org.uk/' },
  stopScams159: { title: 'Call 159', by: 'Stop Scams UK', href: 'https://stopscamsuk.org.uk/159' },
  ofcom7726: { title: 'What to do about a scam call, text or message', by: 'Ofcom', href: 'https://www.ofcom.org.uk/phones-and-broadband/scam-calls-and-messages/what-to-do-about-a-scam-call-text-or-message' },
  ncscReport: { title: 'Report a scam email', by: 'National Cyber Security Centre', href: 'https://www.ncsc.gov.uk/collection/phishing-scams/report-scam-email' },
  reportFraud: { title: 'Report Fraud', by: 'City of London Police', href: 'https://www.reportfraud.police.uk/' },
  noaaTitanic: { title: 'Titanic bow', by: 'NOAA Ocean Exploration', href: 'https://oceanexplorer.noaa.gov/multimedia/daily-image-media-20210415/' },
};
