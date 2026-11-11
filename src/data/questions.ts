// The question bank: ten "spot the fake" questions for each scam. Every brand is invented.
// Phone numbers use Ofcom's ranges reserved for drama (07700 900xxx, 020 7946 0xxx), so none is real.
// Each question has exactly one card with `fake`, and its `tell` is a phrase that appears on that card.

export type Scam = 'disguise' | 'crowd' | 'lookalike' | 'bait';
export type Card = {
  kind: 'text' | 'email' | 'shop' | 'link' | 'profile';
  from: string;        // sender, shop, page title or account name
  meta?: string;       // email address, URL, rating line or follower count
  subject?: string;    // email subject or product name
  body: string[];
  fake?: true;
  tell?: string;       // the giveaway, highlighted after answering (fake card only)
  real?: string;       // why this card is genuine, shown if someone picks it
};
export type Question = { id: string; scam: Scam; goal: string; cards: Card[]; why: string };

export const scams: Record<Scam, { name: string; animal: string }> = {
  disguise: { name: 'Disguises', animal: 'mimic octopus' },
  crowd: { name: 'Fake crowds', animal: 'giant siphonophore' },
  lookalike: { name: 'Look-alike addresses', animal: 'hatchetfish' },
  bait: { name: 'Bait', animal: 'anglerfish' },
};

export const questions: Question[] = [
  /* ---------- Disguises: someone pretending to be someone you trust ---------- */
  {
    id: 'd-bank-text', scam: 'disguise',
    goal: "One of these texts isn't really from Northway Bank. Which one?",
    cards: [
      { kind: 'text', from: 'Northway Bank', body: ['Your card ending 4821 was used for £23.40 at Larkspur. Not you? Call the number on the back of your card.'], real: 'It tells you to use the number you already have, on your own card.' },
      { kind: 'text', from: 'Northway Bank', body: ["We've stopped a payment of £849.00. If this was not you, call our fraud team now on 07700 900123."], fake: true, tell: '07700 900123' },
    ],
    why: 'Banks never send you a mobile number to ring. Anyone can make a text show "Northway Bank" as the sender.',
  },
  {
    id: 'd-hi-mum', scam: 'disguise',
    goal: 'One of these messages is not really from your son. Which one?',
    cards: [
      { kind: 'text', from: 'Sam', body: ['Running late, train delayed. Home by 7, save me some dinner'], real: "It comes from Sam's saved number and asks for nothing." },
      { kind: 'text', from: '+44 7700 900461', body: ['Hi Mum, this is my new number, my phone broke. Can you send £280 for my rent today? Will pay you back'], fake: true, tell: 'this is my new number' },
    ],
    why: 'A "new number" plus an urgent money request is the classic disguise. Call the old number or ask something only they would know.',
  },
  {
    id: 'd-boss-email', scam: 'disguise',
    goal: 'One of these emails is not really from your manager, Priya. Which one?',
    cards: [
      { kind: 'email', from: 'Priya Shah', meta: 'priya.shah@kettleandco.co.uk', subject: 'Thursday meeting moved', body: ["Hi, I've moved Thursday's catch-up to 2pm. Same room. Thanks, Priya"], real: 'It comes from the company address and asks for nothing unusual.' },
      { kind: 'email', from: 'Priya Shah', meta: 'priya.shah.office@gmail.com', subject: 'Quick favour', body: ['Are you free? I need you to buy five £100 Larkspur gift cards for a client today. Keep this between us for now.'], fake: true, tell: 'gift cards' },
    ],
    why: 'Real managers never ask you to buy gift cards, and never from a personal email address. "Keep this between us" is the giveaway pressure.',
  },
  {
    id: 'd-safe-account', scam: 'disguise',
    goal: 'One of these calls-to-action is not really from your bank. Which one?',
    cards: [
      { kind: 'text', from: 'Northway Bank', body: ['Your new card is on its way and should arrive in 3 to 5 working days. Activate it in the Northway app.'], real: 'It points you to the app you already use and asks for nothing.' },
      { kind: 'text', from: 'Northway Bank', body: ['We have detected fraud on your account. To protect your money, move it to a safe account today: sort code 20-41-77.'], fake: true, tell: 'move it to a safe account' },
    ],
    why: 'There is no such thing as a "safe account". A bank will never ask you to move your money to protect it.',
  },
  {
    id: 'd-energy-details', scam: 'disguise',
    goal: 'One of these emails is not really from Brightside Energy. Which one?',
    cards: [
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Your November bill is ready', body: ['Your bill of £86.12 is ready to view in your online account. It will be collected by direct debit on 1 December.'], real: 'It tells you where to look yourself and asks for nothing.' },
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Action needed: direct debit', body: ['Your direct debit failed. Please reply to this email with your sort code and account number so we can update it.'], fake: true, tell: 'reply to this email with your sort code and account number' },
    ],
    why: 'No real company asks for bank details by email reply. The sender address can be faked too, so judge what they are asking for.',
  },
  {
    id: 'd-courier-police', scam: 'disguise',
    goal: 'One of these messages is not really from the police. Which one?',
    cards: [
      { kind: 'text', from: 'Fernhill Police', body: ['Thank you for your report. Your crime reference is FP/26/04417. An officer will contact you within 5 working days.'], real: 'It gives you a reference and asks you to do nothing.' },
      { kind: 'text', from: 'DC Hall, Fernhill Police', body: ['We are investigating fraud at your bank branch. We need you to withdraw £3,000 in cash. A courier will collect it from your home tonight.'], fake: true, tell: 'A courier will collect it' },
    ],
    why: 'Police never ask you to withdraw cash or hand money to a courier. Hang up, wait five minutes and call 101 from another phone.',
  },
  {
    id: 'd-mobile-pin', scam: 'disguise',
    goal: 'One of these texts is not really from Coastline Mobile. Which one?',
    cards: [
      { kind: 'text', from: 'Coastline', body: ['Your bill of £18.00 will be collected on 1 December. View it any time in the Coastline app.'], real: 'An ordinary bill reminder that asks for nothing.' },
      { kind: 'text', from: 'Coastline', body: ["Congratulations, you're due a free loyalty upgrade! To claim, reply with your account PIN and password."], fake: true, tell: 'reply with your account PIN and password' },
    ],
    why: 'No company ever needs your password or PIN by text. Once a scammer has them, they can move your number to their own SIM.',
  },
  {
    id: 'd-tech-support', scam: 'disguise',
    goal: 'One of these screens is not really from your computer. Which one?',
    cards: [
      { kind: 'text', from: 'System update', body: ['Updates are ready to install. Your computer will restart tonight at 2am, or you can restart now.'], real: 'A normal update notice with no phone number and no payment.' },
      { kind: 'text', from: 'Security alert', body: ['VIRUS DETECTED. Your files are at risk. Do not turn off your computer. Call support now on 020 7946 0182.'], fake: true, tell: 'Call support now on 020 7946 0182' },
    ],
    why: 'Real warnings never give you a phone number to call. Close the browser tab; if it will not close, restart the computer.',
  },
  {
    id: 'd-landlord', scam: 'disguise',
    goal: 'One of these emails is not really from your letting agent. Which one?',
    cards: [
      { kind: 'email', from: 'Ashgrove Lettings', meta: 'rentals@ashgrovelettings.co.uk', subject: 'Gas safety check', body: ['Our engineer will visit for the annual gas safety check on 18 November between 9am and 1pm.'], real: 'A routine visit notice, from the usual address, with no money involved.' },
      { kind: 'email', from: 'Ashgrove Lettings', meta: 'rentals@ashgrovelettings.co.uk', subject: 'New bank details for rent', body: ['Please note our bank details have changed. From this month, pay your rent to the new account below. Old payments will be returned.'], fake: true, tell: 'our bank details have changed' },
    ],
    why: 'Emails can be hacked or faked, so "our bank details have changed" is the oldest trick there is. Always ring the company on a number you already have.',
  },
  {
    id: 'd-streaming', scam: 'disguise',
    goal: 'One of these texts is not really from StreamBox. Which one?',
    cards: [
      { kind: 'text', from: 'StreamBox', body: ['Your StreamBox code is 482913. Never share this code with anyone, including us.'], real: 'A sign-in code you asked for, warning you not to share it.' },
      { kind: 'text', from: 'StreamBox', body: ["Hi, it's StreamBox support. We sent you a code by mistake. Please text it back to us so we can cancel it."], fake: true, tell: 'Please text it back to us' },
    ],
    why: 'A code sent to you is a key to your account. Nobody genuine will ever ask you to read it out or send it back.',
  },

  /* ---------- Fake crowds: many fake voices posing as one big crowd ---------- */
  {
    id: 'c-headphones', scam: 'crowd',
    goal: 'One of these shops is propped up by fake reviews. Which one?',
    cards: [
      { kind: 'shop', from: 'SoundNest', subject: 'Wireless headphones', meta: '★ 4.4 · 1,236 reviews', body: ['"Great sound. The case feels a bit cheap." ★★★★', '"Battery lasts a week. Took a while to pair." ★★★★'], real: 'Reviews mention small faults, and real buyers always do.' },
      { kind: 'shop', from: 'AudioMax Pro', subject: 'Wireless headphones', meta: '★ 5.0 · 9,812 reviews, all this week', body: ['"Great product! Highly recommend!" ★★★★★', '"Great product, highly recommend!!" ★★★★★'], fake: true, tell: 'all this week' },
    ],
    why: 'Thousands of perfect reviews, all in one week, saying the same words, are written by the seller, not by buyers. Fake reviews have been illegal in the UK since April 2025.',
  },
  {
    id: 'c-followers', scam: 'crowd',
    goal: 'One of these sellers bought their followers. Which one?',
    cards: [
      { kind: 'profile', from: 'Hollow Oak Candles', meta: '2,340 followers', body: ['Latest post: 86 likes, 14 comments', '"Ordered the cedar one, smells amazing" · "Do you ship to Ireland?"'], real: 'Likes and comments match the size of the following.' },
      { kind: 'profile', from: 'Luxe Glow Candles', meta: '184,000 followers', body: ['Latest post: 9 likes, 2 comments', '"Nice" · "Check my page!!"'], fake: true, tell: '9 likes' },
    ],
    why: '184,000 followers but nine likes means most of those followers are fake accounts. A real crowd talks back.',
  },
  {
    id: 'c-restaurant', scam: 'crowd',
    goal: 'One of these restaurants is padded with fake reviews. Which one?',
    cards: [
      { kind: 'shop', from: 'The Copper Pan', subject: 'Restaurant', meta: '★ 4.3 · 418 reviews', body: ['"Lovely roast, service was slow on a Sunday." Reviewer: 37 reviews', '"Great value lunch menu." Reviewer: 112 reviews'], real: 'Reviewers have long histories and mention real details.' },
      { kind: 'shop', from: 'Golden Fork', subject: 'Restaurant', meta: '★ 4.9 · 1,904 reviews', body: ['"Best restaurant ever!!!" Reviewer: 1 review', '"Amazing food amazing staff!" Reviewer: 1 review'], fake: true, tell: 'Reviewer: 1 review' },
    ],
    why: 'Accounts that have only ever written one glowing review are usually made for the job. Look at who is reviewing, not just the stars.',
  },
  {
    id: 'c-countdown', scam: 'crowd',
    goal: 'One of these shops is faking a rush of buyers. Which one?',
    cards: [
      { kind: 'shop', from: 'Fernway Outdoor', subject: 'Waterproof walking boots', meta: '★ 4.5 · 702 reviews', body: ['In stock. Free returns within 30 days.'], real: 'A plain listing with nothing pushing you to hurry.' },
      { kind: 'shop', from: 'TrailKing Deals', subject: 'Waterproof walking boots', meta: '★ 4.9 · 10,000+ sold', body: ['Only 2 left! 41 people are looking at this right now.', 'Offer ends in 04:59'], fake: true, tell: '41 people are looking at this right now' },
    ],
    why: 'Fake "people viewing" counters and timers that reset are made up to rush you. A real shop does not need to invent a crowd.',
  },
  {
    id: 'c-investment', scam: 'crowd',
    goal: 'One of these is a crowd of fake success stories. Which one?',
    cards: [
      { kind: 'shop', from: 'Northway Savings', subject: 'Easy access saver', meta: '4.1% interest a year · FSCS protected', body: ['Pay in from £1. Withdraw any time.'], real: 'A modest, protected rate with no promises.' },
      { kind: 'shop', from: 'CoinRise Club', subject: 'Join 25,000 members', meta: '"I made £4,000 in a week!" · Mark, Leeds', body: ['"Quit my job after a month!" · Jess, Bristol', '"Guaranteed profits every day" · Amir, London'], fake: true, tell: 'I made £4,000 in a week!' },
    ],
    why: 'A wall of testimonials promising huge, guaranteed returns is written by the scammers. Real investments never guarantee profit.',
  },
  {
    id: 'c-app', scam: 'crowd',
    goal: 'One of these apps has fake reviews. Which one?',
    cards: [
      { kind: 'shop', from: 'TideTimes', subject: 'Tide and weather app', meta: '★ 4.6 · 3,108 reviews', body: ['"Accurate for my beach. Wish it had a widget." ★★★★', '"Ads are annoying but it works." ★★★'], real: 'Real users complain about something, even when they like it.' },
      { kind: 'shop', from: 'PhoneCleaner Ultra', subject: 'Speed up your phone', meta: '★ 4.9 · 52,000 reviews', body: ['"Very good app very good app" ★★★★★', '"Best app. Best app. Download now" ★★★★★'], fake: true, tell: 'Very good app very good app' },
    ],
    why: 'Repeated, empty phrases are what review bots write. Read a few reviews instead of trusting the star count.',
  },
  {
    id: 'c-marketplace', scam: 'crowd',
    goal: 'One of these marketplace sellers has a fake reputation. Which one?',
    cards: [
      { kind: 'profile', from: 'Dave K.', meta: 'Joined 2019 · 87 ratings · ★ 4.8', body: ['Selling: road bike, collection only', '"Bike exactly as described, friendly seller"'], real: 'Years of history and a sensible collection-only sale.' },
      { kind: 'profile', from: 'BestPriceSeller22', meta: 'Joined 6 days ago · 312 ratings · ★ 5.0', body: ['Selling: brand-new games console, £120', '"Bank transfer only, I will post it"'], fake: true, tell: 'Joined 6 days ago' },
    ],
    why: '312 perfect ratings in six days is impossible for a real person. A too-cheap item and "bank transfer only" finish the picture.',
  },
  {
    id: 'c-mismatch', scam: 'crowd',
    goal: 'One of these listings has reviews copied from another product. Which one?',
    cards: [
      { kind: 'shop', from: 'ToolDepot', subject: 'Cordless drill, 18V', meta: '★ 4.5 · 640 reviews', body: ['"Powerful enough for brick. Battery is heavy." ★★★★'], real: 'The review is about a drill.' },
      { kind: 'shop', from: 'MegaTools Store', subject: 'Cordless drill, 18V', meta: '★ 4.9 · 2,210 reviews', body: ['"Love this dress, fits perfectly!" ★★★★★', '"Lovely colour, true to size" ★★★★★'], fake: true, tell: 'Love this dress, fits perfectly!' },
    ],
    why: 'Some sellers move reviews from an old listing onto a new product. Reviews about a dress on a drill page are a dead giveaway.',
  },
  {
    id: 'c-giveaway', scam: 'crowd',
    goal: 'One of these giveaway posts is a fake crowd. Which one?',
    cards: [
      { kind: 'profile', from: 'Larkspur Supermarket', meta: 'Official page · 312,000 followers', body: ['"Win a £50 voucher! Winner picked from comments on Friday. T&Cs on our website."', '1,204 comments, a mix of people chatting'], real: 'Posted by the official page, with terms on the real website.' },
      { kind: 'profile', from: 'Larkspur Rewards UK', meta: 'Page created yesterday', body: ['"Share and comment DONE to win a £500 voucher! Then claim at the link in our bio."', '4,812 comments, all saying "DONE"'], fake: true, tell: 'Page created yesterday' },
    ],
    why: 'A page made yesterday, thousands of identical comments and a "claim" link: the crowd is fake and the link is the real trap.',
  },
  {
    id: 'c-hotel', scam: 'crowd',
    goal: 'One of these holiday lets has fake reviews. Which one?',
    cards: [
      { kind: 'shop', from: 'Seaview Cottage', subject: 'Holiday let, 2 bedrooms', meta: '★ 4.7 · 96 reviews, verified stays', body: ['"Spotless, but the stairs are steep." Stayed March 2026'], real: 'Verified stays, honest details, dates.' },
      { kind: 'shop', from: 'Luxury Harbour Villa', subject: 'Holiday let, 4 bedrooms', meta: '★ 5.0 · 640 reviews, none verified', body: ['"Perfect perfect perfect" ', '"Pay by bank transfer to get the discount"'], fake: true, tell: 'none verified' },
    ],
    why: 'Hundreds of unverified perfect reviews, and a request to pay off-platform by bank transfer, mean the listing is likely fake.',
  },

  /* ---------- Look-alike addresses: blending in with the real thing ---------- */
  {
    id: 'l-parcel', scam: 'lookalike',
    goal: 'Which of these links is the fake ParcelPost?',
    cards: [
      { kind: 'link', from: 'ParcelPost: track a parcel', meta: 'parcelpost.co.uk/track', body: ['Enter your tracking number.'], real: 'The address ends in the real name: parcelpost.co.uk.' },
      { kind: 'link', from: 'ParcelPost: redelivery', meta: 'parcelpost-redelivery.co/pay', body: ['Pay the £1.45 redelivery fee.'], fake: true, tell: 'parcelpost-redelivery.co' },
      { kind: 'link', from: 'ParcelPost: help', meta: 'parcelpost.co.uk/help', body: ['Missed a delivery? Find out what to do.'], real: 'Same real address, parcelpost.co.uk, just a different page.' },
    ],
    why: 'The part right before .co.uk or .com is the website you are really on. "parcelpost-redelivery.co" is a different website that only borrows the name.',
  },
  {
    id: 'l-subdomain', scam: 'lookalike',
    goal: 'Which of these links is the fake Northway Bank?',
    cards: [
      { kind: 'link', from: 'Northway Bank: log in', meta: 'northwaybank.co.uk/login', body: ['Log in to online banking.'], real: 'The real name sits right before .co.uk.' },
      { kind: 'link', from: 'Northway Bank: secure login', meta: 'northwaybank.co.uk.secure-login.top/verify', body: ['Verify your account to avoid suspension.'], fake: true, tell: 'secure-login.top' },
    ],
    why: 'Read the address from the right. This one really belongs to "secure-login.top"; the bank name is just stacked in front to fool you.',
  },
  {
    id: 'l-tax', scam: 'lookalike',
    goal: 'Which of these links is the fake HM Tax Office?',
    cards: [
      { kind: 'link', from: 'HM Tax Office: sign in', meta: 'hmtaxoffice.gov.uk/sign-in', body: ['Manage your tax account.'], real: 'Government sites in the UK end in .gov.uk.' },
      { kind: 'link', from: 'HM Tax Office: claim refund', meta: 'hmtaxoffice-refund.com/claim', body: ['You are due £326.18. Claim now.'], fake: true, tell: 'hmtaxoffice-refund.com' },
    ],
    why: 'Real UK government websites end in .gov.uk. A ".com" with "refund" bolted on is not the tax office.',
  },
  {
    id: 'l-digit', scam: 'lookalike',
    goal: 'Which of these links is the fake Larkspur?',
    cards: [
      { kind: 'link', from: 'Larkspur: your orders', meta: 'larkspur.co.uk/orders', body: ['Track and manage your orders.'], real: 'Every letter matches: larkspur.co.uk.' },
      { kind: 'link', from: 'Larkspur: your orders', meta: 'iarkspur.co.uk/orders', body: ['Track and manage your orders.'], fake: true, tell: 'iarkspur.co.uk' },
    ],
    why: 'The first letter is a lowercase "i", not an "l". One swapped letter is enough to make a different website.',
  },
  {
    id: 'l-tld', scam: 'lookalike',
    goal: 'Which of these links is the fake Kettle & Co shop?',
    cards: [
      { kind: 'link', from: 'Kettle & Co: winter sale', meta: 'kettleandco.co.uk/sale', body: ['Up to 30% off homeware.'], real: 'The shop’s usual address, kettleandco.co.uk.' },
      { kind: 'link', from: 'Kettle & Co: clearance, 90% off', meta: 'kettleandco-clearance.shop', body: ['Everything must go. 90% off today only.'], fake: true, tell: 'kettleandco-clearance.shop' },
    ],
    why: 'A different ending (.shop) and extra words make it a different website, and 90% off is the lure.',
  },
  {
    id: 'l-at', scam: 'lookalike',
    goal: 'Which of these links is the fake StreamBox?',
    cards: [
      { kind: 'link', from: 'StreamBox: account', meta: 'streambox.com/account', body: ['Manage your plan and devices.'], real: 'Plain and simple: streambox.com.' },
      { kind: 'link', from: 'StreamBox: update payment', meta: 'streambox.com@billing-update.xyz', body: ['Update your card to keep watching.'], fake: true, tell: '@billing-update.xyz' },
    ],
    why: 'Everything before an @ in a web address is ignored. This link really goes to billing-update.xyz.',
  },
  {
    id: 'l-cyrillic', scam: 'lookalike',
    goal: 'These two look identical. Which one is the fake Northway Bank?',
    cards: [
      { kind: 'link', from: 'Northway Bank: log in', meta: 'northwaybank.co.uk', body: ['Typed by you into the address bar.'], real: 'You typed it yourself, which is the safest way.' },
      { kind: 'link', from: 'Northway Bank: log in', meta: 'northwаybank.co.uk', body: ['From a link in a text message.'], fake: true, tell: 'northwаybank.co.uk' },
    ],
    why: 'The second "a" is a Cyrillic letter that looks identical. Your browser may reveal it as "xn--northwybank-…". This is why typing the address yourself beats tapping a link.',
  },
  {
    id: 'l-hyphens', scam: 'lookalike',
    goal: 'Which of these links is the fake Brightside Energy?',
    cards: [
      { kind: 'link', from: 'Brightside Energy: my account', meta: 'brightside-energy.co.uk/account', body: ['See your bills and readings.'], real: 'The address they use on every bill.' },
      { kind: 'link', from: 'Brightside Energy: billing', meta: 'brightside-energy-billing-support.com', body: ['Your payment failed. Update now.'], fake: true, tell: 'brightside-energy-billing-support.com' },
    ],
    why: 'A long chain of words joined with hyphens is a different website pretending to be a department of the real one.',
  },
  {
    id: 'l-shortener', scam: 'lookalike',
    goal: 'A text says it is from ParcelPost. Which link should you not trust?',
    cards: [
      { kind: 'link', from: 'Typed it yourself', meta: 'parcelpost.co.uk', body: ['You went to the site and entered your tracking number.'], real: 'Going to the site yourself is always safe.' },
      { kind: 'link', from: 'Link in the text', meta: 'bit.ly/3pX9dQe', body: ['"Your parcel is on hold. Tap to release it."'], fake: true, tell: 'bit.ly/3pX9dQe' },
    ],
    why: 'A shortened link hides where it goes. Delivery companies use their own address. When in doubt, type the address yourself.',
  },
  {
    id: 'l-council', scam: 'lookalike',
    goal: 'Which email address is the fake Fernhill Council?',
    cards: [
      { kind: 'email', from: 'Fernhill Council', meta: 'counciltax@fernhill.gov.uk', subject: 'Your 2026/27 bill', body: ['Your council tax bill is ready in your online account.'], real: 'Councils use .gov.uk addresses.' },
      { kind: 'email', from: 'Fernhill Council', meta: 'refunds@fernhill-council-gov.com', subject: 'Council tax refund', body: ['You have overpaid. Claim your £212.60 refund today.'], fake: true, tell: 'fernhill-council-gov.com' },
    ],
    why: 'Putting "gov" inside the name does not make it government. Real councils use addresses ending in .gov.uk.',
  },

  /* ---------- Bait: something you want, dangled in front of you ---------- */
  {
    id: 'b-tax-refund', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'HM Tax Office', meta: 'noreply@hmtaxoffice.gov.uk', subject: 'Self Assessment reminder', body: ['The deadline for your tax return is 31 January. Sign in to your account to file.'], real: 'A reminder with no link and no money offered.' },
      { kind: 'email', from: 'HM Tax Office', meta: 'noreply@hmtaxoffice.gov.uk', subject: 'You are due a refund', body: ['You are due a tax refund of £326.18. Claim it before midnight using the secure link below.'], fake: true, tell: 'You are due a tax refund of £326.18' },
    ],
    why: 'Free money is the lure. Tax refunds are never offered out of the blue with a link. Go to the official site yourself.',
  },
  {
    id: 'b-voucher', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'text', from: 'Larkspur', body: ['You have 1,240 points (£12.40). Spend them at the till or in the app.'], real: 'It tells you what you have and points you to the app.' },
      { kind: 'text', from: 'Larkspur', body: ["Congratulations! You've won a £500 Larkspur voucher. Claim within 24 hours: larkspur-winners.co"], fake: true, tell: "You've won a £500 Larkspur voucher" },
    ],
    why: 'You cannot win a competition you never entered. The prize is the bait, and the deadline stops you thinking.',
  },
  {
    id: 'b-parcel-fee', scam: 'bait',
    goal: 'One of these delivery texts is bait. Which one?',
    cards: [
      { kind: 'text', from: 'ParcelPost', body: ['Your parcel from Kettle & Co arrives today between 10:00 and 11:00. Track it in the ParcelPost app.'], real: 'It asks for nothing and points to the app.' },
      { kind: 'text', from: 'ParcelPost', body: ['Your parcel is on hold due to unpaid postage. Pay £1.45 to release it.'], fake: true, tell: 'Pay £1.45 to release it' },
    ],
    why: 'The tiny fee is the bait. Paying it hands over your card details, which are then used for much bigger payments.',
  },
  {
    id: 'b-payment-failed', scam: 'bait',
    goal: 'One of these StreamBox emails is bait. Which one?',
    cards: [
      { kind: 'email', from: 'StreamBox', meta: 'billing@streambox.com', subject: 'Your receipt', body: ['Thanks for your payment of £10.99. Your plan renews on 9 December.'], real: 'A receipt that asks you to do nothing.' },
      { kind: 'email', from: 'StreamBox', meta: 'billing@streambox.com', subject: 'Account suspended', body: ['Your payment failed. Update your card within 12 hours or lose access to your account.'], fake: true, tell: 'within 12 hours or lose access' },
    ],
    why: 'Fear of losing something works as bait too. Open the app yourself; if there is a real problem it will say so there.',
  },
  {
    id: 'b-job', scam: 'bait',
    goal: 'One of these job messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'Ashgrove Lettings', meta: 'jobs@ashgrovelettings.co.uk', subject: 'Interview: lettings assistant', body: ['Thanks for applying. Could you come in for an interview on Tuesday at 11am?'], real: 'A reply to a job you applied for, from the company address.' },
      { kind: 'text', from: '+44 7700 900918', body: ['Hi! Earn £400 a day from home just by liking videos. No experience needed. Message me on WhatsApp to start.'], fake: true, tell: 'Earn £400 a day from home just by liking videos' },
    ],
    why: 'Easy money for no work is the lure. These "jobs" end with you paying a "deposit" or moving money for criminals.',
  },
  {
    id: 'b-energy-rebate', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Meter reading due', body: ['Please send us a meter reading in the app by 30 November.'], real: 'A routine request, done in the app you already have.' },
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Your £400 energy rebate', body: ['You are eligible for a £400 government energy rebate. Enter your card details to receive it.'], fake: true, tell: 'Enter your card details to receive it' },
    ],
    why: 'Nobody needs your card details to pay you money. That request is the hook inside the bait.',
  },
  {
    id: 'b-locked', scam: 'bait',
    goal: 'One of these security emails is bait. Which one?',
    cards: [
      { kind: 'email', from: 'Northway Bank', meta: 'alerts@northwaybank.co.uk', subject: 'Your password was changed', body: ['Your password was changed on 9 November. If this was you, ignore this email. If not, call the number on your card.'], real: 'No link to click: it sends you to a number you already have.' },
      { kind: 'email', from: 'Northway Bank', meta: 'alerts@northwaybank.co.uk', subject: 'Unusual sign-in detected', body: ['We noticed a sign-in from a new device. Click here and enter your login details to secure your account.'], fake: true, tell: 'Click here and enter your login details' },
    ],
    why: 'A scare plus a "fix it here" link is bait. Real alerts tell you to use the app or the number on your card.',
  },
  {
    id: 'b-crypto', scam: 'bait',
    goal: 'One of these posts is bait. Which one?',
    cards: [
      { kind: 'profile', from: 'Northway Bank', meta: 'Official page', body: ['"Reminder: we will never ask you to move money to a safe account."'], real: 'A safety reminder that asks for nothing.' },
      { kind: 'profile', from: 'Famous Entrepreneur Giveaway', meta: 'Verified-looking page', body: ['"Celebrating! Send any amount of crypto to this wallet and I will send DOUBLE back."'], fake: true, tell: 'I will send DOUBLE back' },
    ],
    why: 'Nobody doubles your money. "Send some, get double back" is pure bait, usually using a celebrity’s name.',
  },
  {
    id: 'b-voicemail', scam: 'bait',
    goal: 'One of these texts is bait. Which one?',
    cards: [
      { kind: 'text', from: 'Coastline', body: ['You have 1 new voicemail. Call 121 from your phone to listen.'], real: 'It tells you to dial your own voicemail number.' },
      { kind: 'text', from: '+44 7700 900233', body: ['You have a new voicemail. Listen here: vm-listen.top/a8f'], fake: true, tell: 'vm-listen.top/a8f' },
    ],
    why: 'Curiosity is bait. Voicemail is played by calling your network, never by tapping a link from a stranger.',
  },
  {
    id: 'b-licence', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'ViewLicence', meta: 'renewals@viewlicence.co.uk', subject: 'Renewal reminder', body: ['Your licence renews on 1 January. Your payment will be taken by direct debit as usual.'], real: 'Nothing to click and nothing new to pay.' },
      { kind: 'email', from: 'ViewLicence', meta: 'renewals@viewlicence.co.uk', subject: 'Final warning', body: ['Your licence has expired. Pay £169.50 now to avoid prosecution.'], fake: true, tell: 'Pay £169.50 now to avoid prosecution' },
    ],
    why: 'Threats of fines or court are bait made of fear. Check your account on the official website, never through the link.',
  },
];

export const byScam = (s: Scam) => questions.filter((q) => q.scam === s);
