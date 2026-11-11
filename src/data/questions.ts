// The question bank: ten "spot the fake" questions for each scam, plus the hard-mode set. Every brand is invented.
// Phone numbers use Ofcom's ranges reserved for drama (07700 900xxx, 020 7946 0xxx), so none is real.
// Each question has three or four cards, exactly one with `fake`, and its `tell` is a phrase that appears on that card.

export type Scam = 'disguise' | 'crowd' | 'lookalike' | 'voice' | 'bait';
export type Card = {
  kind: 'text' | 'email' | 'shop' | 'link' | 'profile' | 'call' | 'popup' | 'qr' | 'notify' | 'search';
  from: string;        // sender, shop, page title or account name
  meta?: string;       // email address, URL, rating line or follower count
  subject?: string;    // email subject or product name
  body: string[];
  fake?: true;
  tell?: string;       // the giveaway, highlighted after answering (fake card only)
  real?: string;       // why this card is genuine, shown if someone picks it
};
// `attack` names a hard-mode attack; `none` marks a hard question where every card is real.
export type Question = { id: string; scam: Scam; goal: string; cards: Card[]; why: string; attack?: string; none?: true };

export const scams: Record<Scam, { name: string; type: string; animal: string; about: string }> = {
  disguise: { name: 'Disguises', type: 'Disguise scam', animal: 'mimic octopus', about: 'someone pretending to be a person or company you trust.' },
  crowd: { name: 'Fake crowds', type: 'Fake crowd scam', animal: 'giant siphonophore', about: 'fake reviews, followers or buyers dressed up as a real crowd.' },
  lookalike: { name: 'Look-alike addresses', type: 'Look-alike address scam', animal: 'hatchetfish', about: 'a web or email address made to blend in with the real one.' },
  voice: { name: 'Borrowed voices', type: 'Borrowed voice scam', animal: 'beluga whale', about: 'a call that sounds like your bank or someone you love, from a number or a voice that has been faked.' },
  bait: { name: 'Bait', type: 'Bait scam', animal: 'anglerfish', about: 'something you want, or fear losing, dangled to make you act fast.' },
};

export const questions: Question[] = [
  /* ---------- Disguises: someone pretending to be someone you trust ---------- */
  {
    id: 'd-bank-text', scam: 'disguise',
    goal: "One of these texts isn't really from Northway Bank. Which one?",
    cards: [
      { kind: 'text', from: 'Northway Bank', body: ['Your card ending 4821 was used for £23.40 at Larkspur. Not you? Call the number on the back of your card.'], real: 'It tells you to use the number you already have, on your own card.' },
      { kind: 'text', from: 'Northway Bank', body: ["We've stopped a payment of £849.00. If this was not you, call our fraud team now on 07700 900123."], fake: true, tell: '07700 900123' },
      { kind: 'text', from: 'Northway Bank', body: ['Did you try to pay £64.99 to Tidewell Ltd? Reply YES or NO. We will never ask for your PIN or passcode.'], real: 'A yes or no check that asks for no details and no call to a new number.' },
    ],
    why: 'Banks never send you a mobile number to ring. Anyone can make a text show "Northway Bank" as the sender.',
  },
  {
    id: 'd-hi-mum', scam: 'disguise',
    goal: 'One of these messages is not really from your son. Which one?',
    cards: [
      { kind: 'text', from: 'Sam', body: ['Running late, train delayed. Home by 7, save me some dinner'], real: "It comes from Sam's saved number and asks for nothing." },
      { kind: 'text', from: '+44 7700 900461', body: ['Hi Mum, this is my new number, my phone broke. Can you send £280 for my rent today? Will pay you back'], fake: true, tell: 'this is my new number' },
      { kind: 'text', from: 'Sam', body: ["Mum, can you send me £20 for the train home? I'll pay you back Friday x"], real: "It asks for money, but from Sam's saved number, the one you've always had. If unsure, ring him on it." },
    ],
    why: 'A "new number" plus an urgent money request is the classic disguise. Call the old number or ask something only they would know.',
  },
  {
    id: 'd-boss-email', scam: 'disguise',
    goal: 'One of these emails is not really from your manager, Priya. Which one?',
    cards: [
      { kind: 'email', from: 'Priya Shah', meta: 'priya.shah@kettleandco.co.uk', subject: 'Thursday meeting moved', body: ["Hi, I've moved Thursday's catch-up to 2pm. Same room. Thanks, Priya"], real: 'It comes from the company address and asks for nothing unusual.' },
      { kind: 'email', from: 'Priya Shah', meta: 'priya.shah.office@gmail.com', subject: 'Quick favour', body: ['Are you free? I need you to buy five £100 Larkspur gift cards for a client today. Keep this between us for now.'], fake: true, tell: 'gift cards' },
      { kind: 'email', from: 'Priya Shah', meta: 'priya.shah@kettleandco.co.uk', subject: 'Urgent: report by 5pm', body: ["Sorry for the short notice, the board wants the sales report today. Can you send it by 5pm? It's on the shared drive."], real: 'Urgent, but from the company address, and it asks for normal work, not money.' },
    ],
    why: 'Real managers never ask you to buy gift cards, and never from a personal email address. "Keep this between us" is the giveaway pressure.',
  },
  {
    id: 'd-safe-account', scam: 'disguise',
    goal: 'One of these calls-to-action is not really from your bank. Which one?',
    cards: [
      { kind: 'text', from: 'Northway Bank', body: ['Your new card is on its way and should arrive in 3 to 5 working days. Activate it in the Northway app.'], real: 'It points you to the app you already use and asks for nothing.' },
      { kind: 'text', from: 'Northway Bank', body: ['We have detected fraud on your account. To protect your money, move it to a safe account today: sort code 20-41-77.'], fake: true, tell: 'move it to a safe account' },
      { kind: 'text', from: 'Northway Bank', body: ["We've blocked a payment of £1,200 to Harbourline Ltd. Open the Northway app to tell us if this was you."], real: 'It sends you to the app you already use, not to a phone number or a new account.' },
    ],
    why: 'There is no such thing as a "safe account". A bank will never ask you to move your money to protect it.',
  },
  {
    id: 'd-energy-details', scam: 'disguise',
    goal: 'One of these emails is not really from Brightside Energy. Which one?',
    cards: [
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Your November bill is ready', body: ['Your bill of £86.12 is ready to view in your online account. It will be collected by direct debit on 1 December.'], real: 'It tells you where to look yourself and asks for nothing.' },
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Action needed: direct debit', body: ['Your direct debit failed. Please reply to this email with your sort code and account number so we can update it.'], fake: true, tell: 'reply to this email with your sort code and account number' },
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Your tariff is changing', body: ['From 1 January your unit rate goes up to 24.5p per kWh. You can compare tariffs in your online account.'], real: 'Unwelcome news, but it asks for nothing and points you to your own account.' },
    ],
    why: 'No real company asks for bank details by email reply. The sender address can be faked too, so judge what they are asking for.',
  },
  {
    id: 'd-courier-police', scam: 'disguise',
    goal: 'One of these messages is not really from the police. Which one?',
    cards: [
      { kind: 'text', from: 'Fernhill Police', body: ['Thank you for your report. Your crime reference is FP/26/04417. An officer will contact you within 5 working days.'], real: 'It gives you a reference and asks you to do nothing.' },
      { kind: 'text', from: 'DC Hall, Fernhill Police', body: ['We are investigating fraud at your bank branch. We need you to withdraw £3,000 in cash. A courier will collect it from your home tonight.'], fake: true, tell: 'A courier will collect it' },
      { kind: 'text', from: 'Fernhill Police', body: ['Officers will patrol Mill Lane this week after reports of car break-ins. Please keep valuables out of sight.'], real: 'A local alert that asks you for nothing.' },
    ],
    why: 'Police never ask you to withdraw cash or hand money to a courier. Hang up, wait five minutes and call 101 from another phone.',
  },
  {
    id: 'd-mobile-pin', scam: 'disguise',
    goal: 'One of these texts is not really from Coastline Mobile. Which one?',
    cards: [
      { kind: 'text', from: 'Coastline', body: ['Your bill of £18.00 will be collected on 1 December. View it any time in the Coastline app.'], real: 'An ordinary bill reminder that asks for nothing.' },
      { kind: 'text', from: 'Coastline', body: ["Congratulations, you're due a free loyalty upgrade! To claim, reply with your account PIN and password."], fake: true, tell: 'reply with your account PIN and password' },
      { kind: 'text', from: 'Coastline', body: ["You've used 90% of your monthly data. Add more in the Coastline app, or wait until it resets on 1 December."], real: 'It points you to the app and asks for no details.' },
    ],
    why: 'No company ever needs your password or PIN by text. Once a scammer has them, they can move your number to their own SIM.',
  },
  {
    id: 'd-tech-support', scam: 'disguise',
    goal: 'One of these screens is not really from your computer. Which one?',
    cards: [
      { kind: 'text', from: 'System update', body: ['Updates are ready to install. Your computer will restart tonight at 2am, or you can restart now.'], real: 'A normal update notice with no phone number and no payment.' },
      { kind: 'text', from: 'Security alert', body: ['VIRUS DETECTED. Your files are at risk. Do not turn off your computer. Call support now on 020 7946 0182.'], fake: true, tell: 'Call support now on 020 7946 0182' },
      { kind: 'text', from: 'Antivirus', body: ['Scan complete. 1 threat found and removed. No action needed.'], real: 'It sounds alarming, but there is no number to call and nothing to pay.' },
    ],
    why: 'Real warnings never give you a phone number to call. Close the browser tab; if it will not close, restart the computer.',
  },
  {
    id: 'd-landlord', scam: 'disguise',
    goal: 'One of these emails is not really from your letting agent. Which one?',
    cards: [
      { kind: 'email', from: 'Ashgrove Lettings', meta: 'rentals@ashgrovelettings.co.uk', subject: 'Gas safety check', body: ['Our engineer will visit for the annual gas safety check on 18 November between 9am and 1pm.'], real: 'A routine visit notice, from the usual address, with no money involved.' },
      { kind: 'email', from: 'Ashgrove Lettings', meta: 'rentals@ashgrovelettings.co.uk', subject: 'New bank details for rent', body: ['Please note our bank details have changed. From this month, pay your rent to the new account below. Old payments will be returned.'], fake: true, tell: 'our bank details have changed' },
      { kind: 'email', from: 'Ashgrove Lettings', meta: 'rentals@ashgrovelettings.co.uk', subject: 'Rent increase from January', body: ['Following your annual review, your rent will rise to £1,050 a month from 1 January. Your payment details stay the same.'], real: 'Bad news, but the bank details stay the same.' },
    ],
    why: 'Emails can be hacked or faked, so "our bank details have changed" is the oldest trick there is. Always ring the company on a number you already have.',
  },
  {
    id: 'd-streaming', scam: 'disguise',
    goal: 'One of these texts is not really from StreamBox. Which one?',
    cards: [
      { kind: 'text', from: 'StreamBox', body: ['Your StreamBox code is 482913. Never share this code with anyone, including us.'], real: 'A sign-in code you asked for, warning you not to share it.' },
      { kind: 'text', from: 'StreamBox', body: ["Hi, it's StreamBox support. We sent you a code by mistake. Please text it back to us so we can cancel it."], fake: true, tell: 'Please text it back to us' },
      { kind: 'text', from: 'StreamBox', body: ['Someone signed in to your StreamBox account on a TV in Bristol. Not you? Change your password in the StreamBox app.'], real: 'It sends you to the app and asks for no code.' },
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
      { kind: 'shop', from: 'EchoWave', subject: 'Wireless headphones', meta: '★ 4.7 · 3,402 reviews', body: ['"Comfy on long flights. Noise cancelling is decent, not amazing." ★★★★★', '"Stopped charging after a year, but support replaced them." ★★★★'], real: 'A high score, but the reviews are specific and admit faults.' },
    ],
    why: 'Thousands of perfect reviews, all in one week, saying the same words, are written by the seller, not by buyers. Fake reviews have been illegal in the UK since April 2025.',
  },
  {
    id: 'c-followers', scam: 'crowd',
    goal: 'One of these sellers bought their followers. Which one?',
    cards: [
      { kind: 'profile', from: 'Hollow Oak Candles', meta: '2,340 followers', body: ['Latest post: 86 likes, 14 comments', '"Ordered the cedar one, smells amazing" · "Do you ship to Ireland?"'], real: 'Likes and comments match the size of the following.' },
      { kind: 'profile', from: 'Luxe Glow Candles', meta: '184,000 followers', body: ['Latest post: 9 likes, 2 comments', '"Nice" · "Check my page!!"'], fake: true, tell: '9 likes' },
      { kind: 'profile', from: 'Fernway Pottery', meta: '58,900 followers', body: ['Latest post: 3,120 likes, 214 comments', '"The blue glaze is stunning" · "When is the next restock?"'], real: 'A big following, and the likes and comments are big too.' },
    ],
    why: '184,000 followers but nine likes means most of those followers are fake accounts. A real crowd talks back.',
  },
  {
    id: 'c-restaurant', scam: 'crowd',
    goal: 'One of these restaurants is padded with fake reviews. Which one?',
    cards: [
      { kind: 'shop', from: 'The Copper Pan', subject: 'Restaurant', meta: '★ 4.3 · 418 reviews', body: ['"Lovely roast, service was slow on a Sunday." Reviewer: 37 reviews', '"Great value lunch menu." Reviewer: 112 reviews'], real: 'Reviewers have long histories and mention real details.' },
      { kind: 'shop', from: 'Golden Fork', subject: 'Restaurant', meta: '★ 4.9 · 1,904 reviews', body: ['"Best restaurant ever!!!" Reviewer: 1 review', '"Amazing food amazing staff!" Reviewer: 1 review'], fake: true, tell: 'Reviewer: 1 review' },
      { kind: 'shop', from: 'Basil & Brine', subject: 'Restaurant', meta: '★ 4.8 · 1,212 reviews', body: ['"Best fish and chips I\'ve had in years." Reviewer: 64 reviews', '"Pricey, but worth it for a birthday." Reviewer: 209 reviews'], real: 'Very high stars, but from reviewers with long histories.' },
    ],
    why: 'Accounts that have only ever written one glowing review are usually made for the job. Look at who is reviewing, not just the stars.',
  },
  {
    id: 'c-countdown', scam: 'crowd',
    goal: 'One of these shops is faking a rush of buyers. Which one?',
    cards: [
      { kind: 'shop', from: 'Fernway Outdoor', subject: 'Waterproof walking boots', meta: '★ 4.5 · 702 reviews', body: ['In stock. Free returns within 30 days.'], real: 'A plain listing with nothing pushing you to hurry.' },
      { kind: 'shop', from: 'TrailKing Deals', subject: 'Waterproof walking boots', meta: '★ 4.9 · 10,000+ sold', body: ['Only 2 left! 41 people are looking at this right now.', 'Offer ends in 04:59'], fake: true, tell: '41 people are looking at this right now' },
      { kind: 'shop', from: 'Hillside Gear', subject: 'Waterproof walking boots', meta: '★ 4.6 · 1,830 reviews', body: ['Low stock: 3 left in size 9.', 'Free returns within 30 days.'], real: 'Stock levels can be real. Nothing is counting down and no viewers are invented.' },
    ],
    why: 'Fake "people viewing" counters and timers that reset are made up to rush you. A real shop does not need to invent a crowd.',
  },
  {
    id: 'c-investment', scam: 'crowd',
    goal: 'One of these is a crowd of fake success stories. Which one?',
    cards: [
      { kind: 'shop', from: 'Northway Savings', subject: 'Easy access saver', meta: '4.1% interest a year · FSCS protected', body: ['Pay in from £1. Withdraw any time.'], real: 'A modest, protected rate with no promises.' },
      { kind: 'shop', from: 'CoinRise Club', subject: 'Join 25,000 members', meta: '"I made £4,000 in a week!" · Mark, Leeds', body: ['"Quit my job after a month!" · Jess, Bristol', '"Guaranteed profits every day" · Amir, London'], fake: true, tell: 'I made £4,000 in a week!' },
      { kind: 'shop', from: 'Harbour Invest', subject: 'Stocks and shares ISA', meta: 'FCA authorised · Capital at risk', body: ['"The value of investments can go down as well as up."'], real: 'It warns you that you could lose money, which real firms must do.' },
    ],
    why: 'A wall of testimonials promising huge, guaranteed returns is written by the scammers. Real investments never guarantee profit.',
  },
  {
    id: 'c-app', scam: 'crowd',
    goal: 'One of these apps has fake reviews. Which one?',
    cards: [
      { kind: 'shop', from: 'TideTimes', subject: 'Tide and weather app', meta: '★ 4.6 · 3,108 reviews', body: ['"Accurate for my beach. Wish it had a widget." ★★★★', '"Ads are annoying but it works." ★★★'], real: 'Real users complain about something, even when they like it.' },
      { kind: 'shop', from: 'PhoneCleaner Ultra', subject: 'Speed up your phone', meta: '★ 4.9 · 52,000 reviews', body: ['"Very good app very good app" ★★★★★', '"Best app. Best app. Download now" ★★★★★'], fake: true, tell: 'Very good app very good app' },
      { kind: 'shop', from: 'BudgetBuddy', subject: 'Money tracker app', meta: '★ 4.8 · 21,400 reviews', body: ['"Finally see where my money goes. Bank sync breaks now and then." ★★★★★', '"Good, but the subscription is pricey." ★★★★'], real: 'Lots of reviews, each one saying something different and specific.' },
    ],
    why: 'Repeated, empty phrases are what review bots write. Read a few reviews instead of trusting the star count.',
  },
  {
    id: 'c-marketplace', scam: 'crowd',
    goal: 'One of these marketplace sellers has a fake reputation. Which one?',
    cards: [
      { kind: 'profile', from: 'Dave K.', meta: 'Joined 2019 · 87 ratings · ★ 4.8', body: ['Selling: road bike, collection only', '"Bike exactly as described, friendly seller"'], real: 'Years of history and a sensible collection-only sale.' },
      { kind: 'profile', from: 'BestPriceSeller22', meta: 'Joined 6 days ago · 312 ratings · ★ 5.0', body: ['Selling: brand-new games console, £120', '"Bank transfer only, I will post it"'], fake: true, tell: 'Joined 6 days ago' },
      { kind: 'profile', from: 'Helen M.', meta: 'Joined 2024 · 6 ratings · ★ 5.0', body: ["Selling: kids' bike, £40, collection only", '"Lovely seller, bike as pictured"'], real: 'Only a few ratings, but a fair price and you collect in person.' },
    ],
    why: '312 perfect ratings in six days is impossible for a real person. A too-cheap item and "bank transfer only" finish the picture.',
  },
  {
    id: 'c-mismatch', scam: 'crowd',
    goal: 'One of these listings has reviews copied from another product. Which one?',
    cards: [
      { kind: 'shop', from: 'ToolDepot', subject: 'Cordless drill, 18V', meta: '★ 4.5 · 640 reviews', body: ['"Powerful enough for brick. Battery is heavy." ★★★★'], real: 'The review is about a drill.' },
      { kind: 'shop', from: 'MegaTools Store', subject: 'Cordless drill, 18V', meta: '★ 4.9 · 2,210 reviews', body: ['"Love this dress, fits perfectly!" ★★★★★', '"Lovely colour, true to size" ★★★★★'], fake: true, tell: 'Love this dress, fits perfectly!' },
      { kind: 'shop', from: 'BuildRight', subject: 'Cordless drill, 18V', meta: '★ 4.7 · 1,510 reviews', body: ['"Lighter than my old one, the chuck is solid." ★★★★★', '"Charger is slow." ★★★'], real: 'The reviews are about a drill, faults and all.' },
    ],
    why: 'Some sellers move reviews from an old listing onto a new product. Reviews about a dress on a drill page are a dead giveaway.',
  },
  {
    id: 'c-giveaway', scam: 'crowd',
    goal: 'One of these giveaway posts is a fake crowd. Which one?',
    cards: [
      { kind: 'profile', from: 'Larkspur Supermarket', meta: 'Official page · 312,000 followers', body: ['"Win a £50 voucher! Winner picked from comments on Friday. T&Cs on our website."', '1,204 comments, a mix of people chatting'], real: 'Posted by the official page, with terms on the real website.' },
      { kind: 'profile', from: 'Larkspur Rewards UK', meta: 'Page created yesterday', body: ['"Share and comment DONE to win a £500 voucher! Then claim at the link in our bio."', '4,812 comments, all saying "DONE"'], fake: true, tell: 'Page created yesterday' },
      { kind: 'profile', from: 'Hollow Oak Candles', meta: 'Page since 2019 · 2,340 followers', body: ['"Giveaway! Comment your favourite scent to win a gift box. We will message the winner from this page."', '96 comments, all naming different scents'], real: 'An old page, real comments, and no link to claim anything.' },
    ],
    why: 'A page made yesterday, thousands of identical comments and a "claim" link: the crowd is fake and the link is the real trap.',
  },
  {
    id: 'c-hotel', scam: 'crowd',
    goal: 'One of these holiday lets has fake reviews. Which one?',
    cards: [
      { kind: 'shop', from: 'Seaview Cottage', subject: 'Holiday let, 2 bedrooms', meta: '★ 4.7 · 96 reviews, verified stays', body: ['"Spotless, but the stairs are steep." Stayed March 2026'], real: 'Verified stays, honest details, dates.' },
      { kind: 'shop', from: 'Luxury Harbour Villa', subject: 'Holiday let, 4 bedrooms', meta: '★ 5.0 · 640 reviews, none verified', body: ['"Perfect perfect perfect" ', '"Pay by bank transfer to get the discount"'], fake: true, tell: 'none verified' },
      { kind: 'shop', from: 'Old Mill Barn', subject: 'Holiday let, 3 bedrooms', meta: '★ 4.9 · 212 reviews, verified stays', body: ['"Gorgeous spot. The wi-fi is patchy." Stayed August 2026', 'Pay securely on the booking site'], real: 'Near-perfect, but every review is a verified stay and you pay on the site.' },
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
      { kind: 'link', from: 'Northway Bank: lost card', meta: 'help.northwaybank.co.uk/cards', body: ['Report a lost or stolen card.'], real: 'Read from the right: it ends in northwaybank.co.uk. "help." at the front is just a part of the real site.' },
    ],
    why: 'Read the address from the right. This one really belongs to "secure-login.top"; the bank name is just stacked in front to fool you.',
  },
  {
    id: 'l-tax', scam: 'lookalike',
    goal: 'Which of these links is the fake HM Tax Office?',
    cards: [
      { kind: 'link', from: 'HM Tax Office: sign in', meta: 'hmtaxoffice.gov.uk/sign-in', body: ['Manage your tax account.'], real: 'Government sites in the UK end in .gov.uk.' },
      { kind: 'link', from: 'HM Tax Office: claim refund', meta: 'hmtaxoffice-refund.com/claim', body: ['You are due £326.18. Claim now.'], fake: true, tell: 'hmtaxoffice-refund.com' },
      { kind: 'link', from: 'HM Tax Office: refunds', meta: 'hmtaxoffice.gov.uk/refunds', body: ['Check if you can claim a refund.'], real: 'It mentions refunds, but it ends in .gov.uk.' },
    ],
    why: 'Real UK government websites end in .gov.uk. A ".com" with "refund" bolted on is not the tax office.',
  },
  {
    id: 'l-digit', scam: 'lookalike',
    goal: 'Which of these links is the fake Larkspur?',
    cards: [
      { kind: 'link', from: 'Larkspur: your orders', meta: 'larkspur.co.uk/orders', body: ['Track and manage your orders.'], real: 'Every letter matches: larkspur.co.uk.' },
      { kind: 'link', from: 'Larkspur: your orders', meta: 'iarkspur.co.uk/orders', body: ['Track and manage your orders.'], fake: true, tell: 'iarkspur.co.uk' },
      { kind: 'link', from: 'Larkspur: delivery slots', meta: 'larkspur.co.uk/delivery', body: ['Book a home delivery slot.'], real: 'Every letter matches: larkspur.co.uk.' },
    ],
    why: 'The first letter is a lowercase "i", not an "l". One swapped letter is enough to make a different website.',
  },
  {
    id: 'l-tld', scam: 'lookalike',
    goal: 'Which of these links is the fake Kettle & Co shop?',
    cards: [
      { kind: 'link', from: 'Kettle & Co: winter sale', meta: 'kettleandco.co.uk/sale', body: ['Up to 30% off homeware.'], real: 'The shop’s usual address, kettleandco.co.uk.' },
      { kind: 'link', from: 'Kettle & Co: clearance, 90% off', meta: 'kettleandco-clearance.shop', body: ['Everything must go. 90% off today only.'], fake: true, tell: 'kettleandco-clearance.shop' },
      { kind: 'link', from: 'Kettle & Co: clearance', meta: 'kettleandco.co.uk/clearance', body: ['Last few items, up to 50% off.'], real: 'A clearance page, but on the real address, kettleandco.co.uk.' },
    ],
    why: 'A different ending (.shop) and extra words make it a different website, and 90% off is the lure.',
  },
  {
    id: 'l-at', scam: 'lookalike',
    goal: 'Which of these links is the fake StreamBox?',
    cards: [
      { kind: 'link', from: 'StreamBox: account', meta: 'streambox.com/account', body: ['Manage your plan and devices.'], real: 'Plain and simple: streambox.com.' },
      { kind: 'link', from: 'StreamBox: update payment', meta: 'streambox.com@billing-update.xyz', body: ['Update your card to keep watching.'], fake: true, tell: '@billing-update.xyz' },
      { kind: 'link', from: 'StreamBox: billing help', meta: 'help.streambox.com/billing', body: ['Questions about a payment.'], real: 'It ends in streambox.com. "help." is a part of the real site.' },
    ],
    why: 'Everything before an @ in a web address is ignored. This link really goes to billing-update.xyz.',
  },
  {
    id: 'l-cyrillic', scam: 'lookalike',
    goal: 'These three look identical. Which one is the fake Northway Bank?',
    cards: [
      { kind: 'link', from: 'Northway Bank: log in', meta: 'northwaybank.co.uk', body: ['Typed by you into the address bar.'], real: 'You typed it yourself, which is the safest way.' },
      { kind: 'link', from: 'Northway Bank: log in', meta: 'northwаybank.co.uk', body: ['From a link in a text message.'], fake: true, tell: 'northwаybank.co.uk' },
      { kind: 'link', from: 'Northway Bank: log in', meta: 'northwaybank.co.uk', body: ['From a bookmark you saved on the real site.'], real: 'A bookmark you saved yourself is as safe as typing it.' },
    ],
    why: 'The second "a" is a Cyrillic letter that looks identical. Your browser may reveal it as "xn--northwybank-…". This is why typing the address yourself beats tapping a link.',
  },
  {
    id: 'l-hyphens', scam: 'lookalike',
    goal: 'Which of these links is the fake Brightside Energy?',
    cards: [
      { kind: 'link', from: 'Brightside Energy: my account', meta: 'brightside-energy.co.uk/account', body: ['See your bills and readings.'], real: 'The address they use on every bill.' },
      { kind: 'link', from: 'Brightside Energy: billing', meta: 'brightside-energy-billing-support.com', body: ['Your payment failed. Update now.'], fake: true, tell: 'brightside-energy-billing-support.com' },
      { kind: 'link', from: 'Brightside Energy: billing help', meta: 'brightside-energy.co.uk/help/billing', body: ['Questions about your bill.'], real: 'The usual address, brightside-energy.co.uk, then a page on it.' },
    ],
    why: 'A long chain of words joined with hyphens is a different website pretending to be a department of the real one.',
  },
  {
    id: 'l-shortener', scam: 'lookalike',
    goal: 'A text says it is from ParcelPost. Which link should you not trust?',
    cards: [
      { kind: 'link', from: 'Typed it yourself', meta: 'parcelpost.co.uk', body: ['You went to the site and entered your tracking number.'], real: 'Going to the site yourself is always safe.' },
      { kind: 'link', from: 'Link in the text', meta: 'bit.ly/3pX9dQe', body: ['"Your parcel is on hold. Tap to release it."'], fake: true, tell: 'bit.ly/3pX9dQe' },
      { kind: 'link', from: 'In the ParcelPost app', meta: 'ParcelPost app', body: ['You opened the app you already had and checked the tracking.'], real: 'An app you installed yourself goes to the real company.' },
    ],
    why: 'A shortened link hides where it goes. Delivery companies use their own address. When in doubt, type the address yourself.',
  },
  {
    id: 'l-council', scam: 'lookalike',
    goal: 'Which email address is the fake Fernhill Council?',
    cards: [
      { kind: 'email', from: 'Fernhill Council', meta: 'counciltax@fernhill.gov.uk', subject: 'Your 2026/27 bill', body: ['Your council tax bill is ready in your online account.'], real: 'Councils use .gov.uk addresses.' },
      { kind: 'email', from: 'Fernhill Council', meta: 'refunds@fernhill-council-gov.com', subject: 'Council tax refund', body: ['You have overpaid. Claim your £212.60 refund today.'], fake: true, tell: 'fernhill-council-gov.com' },
      { kind: 'email', from: 'Fernhill Council', meta: 'binservices@fernhill.gov.uk', subject: 'Christmas bin collections', body: ['Collections move by one day over Christmas. See the dates on our website.'], real: 'It ends in .gov.uk, like every council address.' },
    ],
    why: 'Putting "gov" inside the name does not make it government. Real councils use addresses ending in .gov.uk.',
  },

  /* ---------- Borrowed voices: a call that sounds like someone you trust ---------- */
  {
    id: 'v-bank-call', scam: 'voice',
    goal: 'Three calls from "Northway Bank". Which one is the scam?',
    cards: [
      { kind: 'call', from: 'Northway Bank', meta: 'Incoming call · 020 7946 0500', body: ["\"Hello, it's Northway Bank. We'd like to check a payment. Please hang up and call the number on the back of your card.\""], real: 'It tells you to hang up and ring the number you already have.' },
      { kind: 'call', from: 'Northway Bank', meta: 'Incoming call · 020 7946 0500', body: ['"This is the Northway fraud team. Your account is under attack. Stay on the line and move your money to a safe account now."'], fake: true, tell: 'Stay on the line' },
      { kind: 'call', from: 'Northway Bank', meta: 'Voicemail · 0:18', body: ["\"Hi, it's Northway about your mortgage appointment on Thursday. No need to call back unless you want to change it.\""], real: 'A reminder that asks for nothing.' },
    ],
    why: 'A real bank is happy for you to hang up and call back. "Stay on the line" is how scammers stop you checking.',
  },
  {
    id: 'v-clone-son', scam: 'voice',
    goal: 'Three calls about your son, Sam. Which one is a cloned voice?',
    cards: [
      { kind: 'call', from: 'Sam', meta: 'Incoming call · saved contact', body: ["\"Mum, I've missed the last train. Can you pick me up from the station?\""], real: 'From his saved number, asking for a lift, not money.' },
      { kind: 'call', from: 'Unknown number', meta: 'Incoming call · +44 7700 900742', body: ["\"Mum, it's me, I've crashed the car and my phone's broken. A solicitor needs £2,000 now. Please don't tell Dad.\""], fake: true, tell: "Please don't tell Dad" },
      { kind: 'call', from: 'Fernhill Hospital', meta: 'Incoming call · 020 7946 0311', body: ["\"Hello, it's the fracture clinic confirming Sam's follow-up on Monday at 10am.\""], real: 'An appointment reminder with nothing to pay.' },
    ],
    why: 'A few seconds of video is enough to clone a voice. An unknown number, a crisis, money now and secrecy: hang up and call him on his saved number.',
  },
  {
    id: 'v-tax-arrest', scam: 'voice',
    goal: 'Which of these is not really HM Tax Office?',
    cards: [
      { kind: 'call', from: 'HM Tax Office', meta: 'Recorded message · 020 7946 0905', body: ['"A lawsuit has been filed in your name. Press 1 now, or a warrant will be issued for your arrest."'], fake: true, tell: 'a warrant will be issued for your arrest' },
      { kind: 'email', from: 'HM Tax Office', meta: 'noreply@hmtaxoffice.gov.uk', subject: 'Your tax return is due', body: ['Sign in to your account to file before 31 January.'], real: 'A reminder from a .gov.uk address with nothing to click.' },
      { kind: 'call', from: 'HM Tax Office', meta: 'You called them · number from the .gov.uk site', body: ['"Thanks for holding. Can I take your reference so I can look at your account?"'], real: 'You rang them on a number you looked up yourself.' },
    ],
    why: 'The tax office does not threaten arrest by robocall. Threats of police and court are bait made of fear.',
  },
  {
    id: 'v-courier', scam: 'voice',
    goal: 'Which call is not really the police?',
    cards: [
      { kind: 'call', from: 'DC Hall', meta: 'Incoming call · 020 7946 0129', body: ["\"We've arrested someone using your card. Withdraw £3,000 so we can check the notes for fingerprints. An officer will collect it.\""], fake: true, tell: 'Withdraw £3,000' },
      { kind: 'call', from: 'Fernhill Police', meta: 'Incoming call · 020 7946 0100', body: ["\"It's about the bike theft you reported. We've recovered a bike and would like you to come in and identify it.\""], real: 'It is about something you reported, and asks for no money.' },
      { kind: 'call', from: 'Fernhill Police', meta: 'You dialled 101', body: ['"Fernhill Police, how can I help?"'], real: 'You called them yourself.' },
    ],
    why: 'Police never ask you to withdraw cash or hand it to a courier. Hang up, wait five minutes and call 101 from another phone.',
  },
  {
    id: 'v-spoofed', scam: 'voice',
    goal: "All three show the number on your bank card. Which one is the scam?",
    cards: [
      { kind: 'call', from: 'Northway Bank', meta: 'Incoming call · 020 7946 0500 (matches your card)', body: ["\"We're checking a new payee you added today. If it wasn't you, end this call and ring the number on your card.\""], real: 'It sends you back to your card to call them yourself.' },
      { kind: 'call', from: 'Northway Bank', meta: 'Incoming call · 020 7946 0500 (matches your card)', body: ['"You can see our number, so you know it\'s us. Read me the code we just texted so we can block the payment."'], fake: true, tell: 'Read me the code' },
      { kind: 'call', from: 'Northway Bank', meta: 'Incoming call · 020 7946 0500 (matches your card)', body: ['"Your replacement card has been posted. There\'s nothing you need to do."'], real: 'It asks for nothing at all.' },
    ],
    why: 'Caller ID can be faked to show any number, even the one on your card. A real bank never asks you to read out a code it sent you.',
  },
  {
    id: 'v-remote', scam: 'voice',
    goal: 'Three calls from "Coastline Broadband". Which one is the scam?',
    cards: [
      { kind: 'call', from: 'Coastline Broadband', meta: 'Incoming call · 020 7946 0377', body: ['"We\'ve found hackers on your router. Install the RemoteHelp app so our engineer can take control of your computer and fix it."'], fake: true, tell: 'take control of your computer' },
      { kind: 'call', from: 'Coastline Broadband', meta: 'Incoming call · 020 7946 0300', body: ['"Confirming your engineer visit tomorrow, 8 till 12. Reply to our text if you need to change it."'], real: 'A visit you booked, with nothing to install.' },
      { kind: 'call', from: 'Coastline Broadband', meta: 'You called them', body: ['"I can see a fault on our side. It should be fixed within four hours, no need to do anything."'], real: 'You rang them, and they ask nothing of you.' },
    ],
    why: 'Nobody genuine cold-calls to take control of your computer. Remote access lets them see your banking and install anything.',
  },
  {
    id: 'v-voicemail', scam: 'voice',
    goal: 'Which voicemail is the scam?',
    cards: [
      { kind: 'call', from: 'Unknown number', meta: 'Voicemail · 0:21', body: ['"This is ParcelPost. Your parcel is held at customs. Press 1 to pay the £2.99 fee by card now."'], fake: true, tell: 'Press 1 to pay' },
      { kind: 'call', from: 'ParcelPost driver', meta: 'Voicemail · 0:12', body: ['"Hi, I\'m outside but there\'s no answer. I\'ll leave it with number 14."'], real: 'A driver telling you where your parcel is.' },
      { kind: 'call', from: 'Mill Lane Surgery', meta: 'Voicemail · 0:30', body: ['"Your blood test results are back and normal. Nothing else to do."'], real: 'Good news, with nothing to pay or press.' },
    ],
    why: 'Robocalls that ask for card details by keypad are scams. Delivery companies do not phone you to collect fees.',
  },
  {
    id: 'v-boss', scam: 'voice',
    goal: 'Which call is not really your manager, Priya?',
    cards: [
      { kind: 'call', from: 'Priya Shah', meta: 'Incoming call · unknown number', body: ["\"It's Priya, I'm on a different phone. The deal closes today: pay the £18,400 invoice I'm emailing you, and keep it confidential.\""], fake: true, tell: 'keep it confidential' },
      { kind: 'call', from: 'Priya Shah', meta: 'Incoming call · saved contact', body: ['"Running ten minutes late. Can you start the meeting without me?"'], real: 'From her saved number, asking for something normal.' },
      { kind: 'call', from: 'Priya Shah', meta: 'Video call · work chat', body: ['"Quick one: the client approved the design, so go ahead and send the final files."'], real: 'Through your work system, about normal work.' },
    ],
    why: 'A new number, an urgent payment and "keep it confidential" is the pattern of CEO fraud. Check through a second channel before moving money.',
  },
  {
    id: 'v-energy', scam: 'voice',
    goal: 'Three calls from "Brightside Energy". Which one is the scam?',
    cards: [
      { kind: 'call', from: 'Brightside Energy', meta: 'Incoming call · 020 7946 0612', body: ["\"You're owed a £400 rebate. To send it, I just need the long number on your card and the three digits on the back.\""], fake: true, tell: 'the three digits on the back' },
      { kind: 'call', from: 'Brightside Energy', meta: 'Incoming call · 020 7946 0600', body: ['"Your smart meter fitting is due. Shall I book you in for next week?"'], real: 'Booking a visit, with no payment details.' },
      { kind: 'call', from: 'Brightside Energy', meta: 'You called them', body: ['"I can take a meter reading over the phone. What does your meter say?"'], real: 'You called, and a meter reading is not sensitive.' },
    ],
    why: 'Nobody needs your card details to pay money into your account. A refund goes back the way you paid.',
  },
  {
    id: 'v-pension', scam: 'voice',
    goal: 'Which call is the scam?',
    cards: [
      { kind: 'call', from: 'Pension Review Service', meta: 'Incoming call · 020 7946 0840', body: ['"Free pension review! We can unlock your pension early, before 55, with a guaranteed 8% return."'], fake: true, tell: 'unlock your pension early' },
      { kind: 'call', from: 'Harbour Invest', meta: 'You called them', body: ['"Your pension is worth £42,310 today. Would you like this year\'s statement posted?"'], real: 'You called your own provider.' },
      { kind: 'call', from: 'Harbour Invest', meta: 'Voicemail · 0:25', body: ['"Returning your call about changing your address. Call us back whenever suits you."'], real: 'Returning a call you made, with no pressure.' },
    ],
    why: 'Pension cold calls are illegal in the UK, and early access before minimum pension age is a scam. "Guaranteed" returns are the bait.',
  },

  /* ---------- Bait: something you want, dangled in front of you ---------- */
  {
    id: 'b-tax-refund', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'HM Tax Office', meta: 'noreply@hmtaxoffice.gov.uk', subject: 'Self Assessment reminder', body: ['The deadline for your tax return is 31 January. Sign in to your account to file.'], real: 'A reminder with no link and no money offered.' },
      { kind: 'email', from: 'HM Tax Office', meta: 'noreply@hmtaxoffice.gov.uk', subject: 'You are due a refund', body: ['You are due a tax refund of £326.18. Claim it before midnight using the secure link below.'], fake: true, tell: 'You are due a tax refund of £326.18' },
      { kind: 'email', from: 'HM Tax Office', meta: 'noreply@hmtaxoffice.gov.uk', subject: 'Your tax code has changed', body: ['Your tax code for 2026/27 has changed. Sign in to your account to see why.'], real: 'No link and no money offered. It tells you to sign in yourself.' },
    ],
    why: 'Free money is the lure. Tax refunds are never offered out of the blue with a link. Go to the official site yourself.',
  },
  {
    id: 'b-voucher', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'text', from: 'Larkspur', body: ['You have 1,240 points (£12.40). Spend them at the till or in the app.'], real: 'It tells you what you have and points you to the app.' },
      { kind: 'text', from: 'Larkspur', body: ["Congratulations! You've won a £500 Larkspur voucher. Claim within 24 hours: larkspur-winners.co"], fake: true, tell: "You've won a £500 Larkspur voucher" },
      { kind: 'text', from: 'Larkspur', body: ["There's a £5 off coupon on your Larkspur card for your next shop over £40. It's already on your card, nothing to claim."], real: 'A small reward that is already on your card, with no link.' },
    ],
    why: 'You cannot win a competition you never entered. The prize is the bait, and the deadline stops you thinking.',
  },
  {
    id: 'b-parcel-fee', scam: 'bait',
    goal: 'One of these delivery texts is bait. Which one?',
    cards: [
      { kind: 'text', from: 'ParcelPost', body: ['Your parcel from Kettle & Co arrives today between 10:00 and 11:00. Track it in the ParcelPost app.'], real: 'It asks for nothing and points to the app.' },
      { kind: 'text', from: 'ParcelPost', body: ['Your parcel is on hold due to unpaid postage. Pay £1.45 to release it.'], fake: true, tell: 'Pay £1.45 to release it' },
      { kind: 'text', from: 'ParcelPost', body: ['Sorry we missed you. Your parcel is at the Mill Lane depot. Collect it with photo ID within 7 days.'], real: 'It asks for no money and no details.' },
    ],
    why: 'The tiny fee is the bait. Paying it hands over your card details, which are then used for much bigger payments.',
  },
  {
    id: 'b-payment-failed', scam: 'bait',
    goal: 'One of these StreamBox emails is bait. Which one?',
    cards: [
      { kind: 'email', from: 'StreamBox', meta: 'billing@streambox.com', subject: 'Your receipt', body: ['Thanks for your payment of £10.99. Your plan renews on 9 December.'], real: 'A receipt that asks you to do nothing.' },
      { kind: 'email', from: 'StreamBox', meta: 'billing@streambox.com', subject: 'Account suspended', body: ['Your payment failed. Update your card within 12 hours or lose access to your account.'], fake: true, tell: 'within 12 hours or lose access' },
      { kind: 'email', from: 'StreamBox', meta: 'billing@streambox.com', subject: 'Prices are changing', body: ['From 1 January your plan will cost £11.99 a month. You can change or cancel your plan in the app.'], real: 'A price rise, but no deadline, no threat and nothing to click.' },
    ],
    why: 'Fear of losing something works as bait too. Open the app yourself; if there is a real problem it will say so there.',
  },
  {
    id: 'b-job', scam: 'bait',
    goal: 'One of these job messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'Ashgrove Lettings', meta: 'jobs@ashgrovelettings.co.uk', subject: 'Interview: lettings assistant', body: ['Thanks for applying. Could you come in for an interview on Tuesday at 11am?'], real: 'A reply to a job you applied for, from the company address.' },
      { kind: 'text', from: '+44 7700 900918', body: ['Hi! Earn £400 a day from home just by liking videos. No experience needed. Message me on ChatLine to start.'], fake: true, tell: 'Earn £400 a day from home just by liking videos' },
      { kind: 'email', from: 'Fernway Outdoor', meta: 'jobs@fernwayoutdoor.co.uk', subject: 'Weekend staff wanted', body: ['We are hiring weekend shop staff at £12.60 an hour. Apply on the careers page of our website.'], real: 'A normal wage, and you apply on the company’s own website.' },
    ],
    why: 'Easy money for no work is the lure. These "jobs" end with you paying a "deposit" or moving money for criminals.',
  },
  {
    id: 'b-energy-rebate', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Meter reading due', body: ['Please send us a meter reading in the app by 30 November.'], real: 'A routine request, done in the app you already have.' },
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Your £400 energy rebate', body: ['You are eligible for a £400 government energy rebate. Enter your card details to receive it.'], fake: true, tell: 'Enter your card details to receive it' },
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Help with winter bills', body: ['You may qualify for help with your winter bills. If you do, we take it off your bill for you. You do not need to do anything.'], real: 'Money off, but it asks for no details at all.' },
    ],
    why: 'Nobody needs your card details to pay you money. That request is the hook inside the bait.',
  },
  {
    id: 'b-locked', scam: 'bait',
    goal: 'One of these security emails is bait. Which one?',
    cards: [
      { kind: 'email', from: 'Northway Bank', meta: 'alerts@northwaybank.co.uk', subject: 'Your password was changed', body: ['Your password was changed on 9 November. If this was you, ignore this email. If not, call the number on your card.'], real: 'No link to click: it sends you to a number you already have.' },
      { kind: 'email', from: 'Northway Bank', meta: 'alerts@northwaybank.co.uk', subject: 'Unusual sign-in detected', body: ['We noticed a sign-in from a new device. Click here and enter your login details to secure your account.'], fake: true, tell: 'Click here and enter your login details' },
      { kind: 'email', from: 'Northway Bank', meta: 'alerts@northwaybank.co.uk', subject: 'Your statement is ready', body: ['Your November statement is ready. View it in the Northway app.'], real: 'No link, just a pointer to the app you already have.' },
    ],
    why: 'A scare plus a "fix it here" link is bait. Real alerts tell you to use the app or the number on your card.',
  },
  {
    id: 'b-crypto', scam: 'bait',
    goal: 'One of these posts is bait. Which one?',
    cards: [
      { kind: 'profile', from: 'Northway Bank', meta: 'Official page', body: ['"Reminder: we will never ask you to move money to a safe account."'], real: 'A safety reminder that asks for nothing.' },
      { kind: 'profile', from: 'Famous Entrepreneur Giveaway', meta: 'Verified-looking page', body: ['"Celebrating! Send any amount of crypto to this wallet and I will send DOUBLE back."'], fake: true, tell: 'I will send DOUBLE back' },
      { kind: 'profile', from: 'Harbour Invest', meta: 'Official page', body: ['"Our free beginner\'s guide to saving is out now on our website. Remember, capital is at risk."'], real: 'It promises nothing and warns you about risk.' },
    ],
    why: 'Nobody doubles your money. "Send some, get double back" is pure bait, usually using a celebrity’s name.',
  },
  {
    id: 'b-voicemail', scam: 'bait',
    goal: 'One of these texts is bait. Which one?',
    cards: [
      { kind: 'text', from: 'Coastline', body: ['You have 1 new voicemail. Call 121 from your phone to listen.'], real: 'It tells you to dial your own voicemail number.' },
      { kind: 'text', from: '+44 7700 900233', body: ['You have a new voicemail. Listen here: vm-listen.top/a8f'], fake: true, tell: 'vm-listen.top/a8f' },
      { kind: 'text', from: 'Mum', body: ['Left you a voicemail about Sunday lunch, call me back when you can x'], real: 'From a saved contact, with nothing to tap.' },
    ],
    why: 'Curiosity is bait. Voicemail is played by calling your network, never by tapping a link from a stranger.',
  },
  {
    id: 'b-licence', scam: 'bait',
    goal: 'One of these messages is bait. Which one?',
    cards: [
      { kind: 'email', from: 'ViewLicence', meta: 'renewals@viewlicence.co.uk', subject: 'Renewal reminder', body: ['Your licence renews on 1 January. Your payment will be taken by direct debit as usual.'], real: 'Nothing to click and nothing new to pay.' },
      { kind: 'email', from: 'ViewLicence', meta: 'renewals@viewlicence.co.uk', subject: 'Final warning', body: ['Your licence has expired. Pay £169.50 now to avoid prosecution.'], fake: true, tell: 'Pay £169.50 now to avoid prosecution' },
      { kind: 'email', from: 'ViewLicence', meta: 'renewals@viewlicence.co.uk', subject: 'Your payment plan', body: ['Your next instalment of £14.12 will be taken on 1 December. There is nothing for you to do.'], real: 'A payment you already set up, with no threat and no link.' },
    ],
    why: 'Threats of fines or court are bait made of fear. Check your account on the official website, never through the link.',
  },
];

// Hard mode, for the practice dive only: ten real-world attacks, two questions each. Four cards,
// subtler giveaways, and some questions where every card is real (`none`), so you cannot win by
// elimination. `attack` is the attack's real name, shown once you answer.
export const hard: Question[] = [
  {
    id: 'h-clickfix-1', scam: 'disguise', attack: 'Fake CAPTCHA (ClickFix)',
    goal: 'You open a news article. Which of these is the attack, if any?',
    cards: [
      { kind: 'popup', from: 'Checking your browser', meta: 'harbourherald.co.uk', body: ['This takes a few seconds. You will be redirected automatically.'], real: 'Many real sites run a short automatic check like this. It asks you to do nothing.' },
      { kind: 'popup', from: 'Verify you are human', meta: 'harbourherald.co.uk', body: ['☐ I am not a robot'], real: 'A plain tick box. Annoying, but harmless.' },
      { kind: 'popup', from: 'Verify you are human', meta: 'harbourherald.co.uk', body: ['To prove you are human: press Windows + R, then Ctrl + V, then Enter.'], fake: true, tell: 'press Windows + R' },
      { kind: 'popup', from: 'Cookies', meta: 'harbourherald.co.uk', body: ['We use cookies to improve the site. Accept all, or manage your choices.'], real: 'A normal cookie banner.' },
    ],
    why: 'Windows + R opens a box that runs commands, and the page has already copied one to your clipboard. Pasting it installs malware. No real check asks you to press keys.',
  },
  {
    id: 'h-clickfix-2', scam: 'disguise', attack: 'Fake CAPTCHA (ClickFix)',
    goal: 'A website says something needs fixing. Which is the attack, if any?',
    cards: [
      { kind: 'popup', from: 'Your browser needs a fix', meta: 'harbourherald.co.uk', body: ['This page cannot display. Copy the fix below, paste it into PowerShell and press Enter.'], fake: true, tell: 'paste it into PowerShell' },
      { kind: 'notify', from: 'Browser', meta: 'now', body: ['An update is ready. Relaunch to finish updating.'], real: 'Updates come from the browser itself, not from a web page.' },
      { kind: 'popup', from: 'Show notifications?', meta: 'harbourherald.co.uk', body: ['harbourherald.co.uk wants to send you notifications. Block or Allow.'], real: 'A real browser prompt. Block is the sensible answer.' },
      { kind: 'popup', from: 'Page not responding', meta: 'Browser', body: ['This page is slowing down your browser. Wait, or close the page.'], real: 'The browser warning you about a slow page.' },
    ],
    why: 'A web page cannot fix your computer. Any page that asks you to paste something into PowerShell, Terminal or the Run box is trying to run its own code.',
  },
  {
    id: 'h-qr-1', scam: 'lookalike', attack: 'QR code scam (quishing)',
    goal: 'You are paying for parking. Which QR code is the attack, if any?',
    cards: [
      { kind: 'qr', from: 'Printed on the parking sign', meta: 'fernhill.gov.uk/parking', body: ['Scan to pay for parking'], real: 'Printed into the sign, and it goes to the council’s .gov.uk site.' },
      { kind: 'qr', from: 'Sticker on top of the sign', meta: 'fernhill-parking-pay.com', body: ['Scan to pay. Card only. Avoid a £70 fine.'], fake: true, tell: 'fernhill-parking-pay.com' },
      { kind: 'qr', from: 'On your parking ticket', meta: 'fernhill.gov.uk/pcn', body: ['Scan to see photos or appeal'], real: 'The council’s own address.' },
      { kind: 'notify', from: 'ParkEasy', meta: 'now', body: ['Session started: Mill Lane car park, 2 hours, £3.20.'], real: 'Paid in an app you installed yourself.' },
    ],
    why: 'Criminals stick their own QR codes over real ones. A sticker, an address that is not the council’s, and a fine threat give it away. Your phone shows the address before opening it: read it.',
  },
  {
    id: 'h-qr-2', scam: 'lookalike', attack: 'QR code scam (quishing)', none: true,
    goal: 'Codes around town. Which QR code is the attack, if any?',
    cards: [
      { kind: 'qr', from: 'On your restaurant table', meta: 'thecopperpan.co.uk/menu', body: ['Scan for our menu'], real: 'The restaurant’s own address, printed into the table card.' },
      { kind: 'qr', from: 'On a theatre poster', meta: 'fernhillarts.org.uk/tickets', body: ['Tickets on sale now'], real: 'The theatre’s own site, selling tickets the usual way.' },
      { kind: 'qr', from: 'On your energy bill', meta: 'brightside-energy.co.uk/reading', body: ['Scan to send a meter reading'], real: 'Printed on a bill that came in the post, to the usual address.' },
      { kind: 'qr', from: 'On a ParcelPost card through your door', meta: 'parcelpost.co.uk/redeliver', body: ['Scan to rebook your delivery. No fee.'], real: 'The real parcelpost.co.uk, and no fee.' },
    ],
    why: 'All four go where they say, and none asks for card details on the spot. That is what a safe QR code looks like.',
  },
  {
    id: 'h-invoice-1', scam: 'disguise', attack: 'Invoice redirection',
    goal: 'Emails from your builder. Which one is the attack, if any?',
    cards: [
      { kind: 'email', from: 'Dunmore Building', meta: 'accounts@dunmorebuilding.co.uk', subject: 'Invoice 1042', body: ['Please find attached the invoice for stage 2, £6,800. Bank details as before.'], real: 'The usual address, the usual bank details.' },
      { kind: 'email', from: 'Dunmore Building', meta: 'accounts@dunmorebuilding.co.uk', subject: 'Updated bank details', body: ['Our bank has changed after an audit. Please pay invoice 1042 to the new account below, today if possible.'], fake: true, tell: 'pay invoice 1042 to the new account' },
      { kind: 'email', from: 'Dunmore Building', meta: 'mark@dunmorebuilding.co.uk', subject: 'Delivery Tuesday', body: ['The windows arrive Tuesday morning. Could you leave the side gate open?'], real: 'About the job, with no money involved.' },
      { kind: 'email', from: 'Dunmore Building', meta: 'accounts@dunmorebuilding.co.uk', subject: 'Receipt', body: ['Thank you, payment for stage 1 received.'], real: 'A receipt asks for nothing.' },
    ],
    why: 'The address is real because the builder’s email was hacked. When bank details change by email, ring the builder on a number you already have before paying.',
  },
  {
    id: 'h-invoice-2', scam: 'disguise', attack: 'Invoice redirection',
    goal: 'You pay suppliers at work. Which email is the attack, if any?',
    cards: [
      { kind: 'email', from: 'Tidewell Packaging', meta: 'billing@tidewellpackaging.co.uk', subject: 'October statement', body: ['Your statement is attached. Payment due within 30 days to our usual account.'], real: 'The supplier’s real address, paying the usual account.' },
      { kind: 'email', from: 'Tidewell Packaging', meta: 'billing@tidewellpackagimg.co.uk', subject: 'Overdue: invoice 8817', body: ['Invoice 8817 is overdue. Please settle today to avoid your account being put on hold.'], fake: true, tell: 'tidewellpackagimg.co.uk' },
      { kind: 'email', from: 'Tidewell Packaging', meta: 'sales@tidewellpackaging.co.uk', subject: 'Price change', body: ['From January our prices rise by 4%. Your account manager will be in touch.'], real: 'Unwelcome, but real, and it asks for no payment.' },
      { kind: 'email', from: 'Priya Shah', meta: 'priya.shah@kettleandco.co.uk', subject: 'Supplier payments', body: ['Reminder: any change to supplier bank details must be confirmed by phone before paying.'], real: 'Your own manager, giving exactly the right advice.' },
    ],
    why: '"packagimg" has an m where the n should be. Look-alike supplier addresses plus an overdue threat are how businesses are tricked into paying criminals.',
  },
  {
    id: 'h-mfa-1', scam: 'bait', attack: 'MFA fatigue (push bombing)',
    goal: 'Notifications on your phone. Which one is the attack, if any?',
    cards: [
      { kind: 'notify', from: 'Authenticator', meta: 'now · 9th request', body: ['Are you trying to sign in? Approve or Deny'], fake: true, tell: '9th request' },
      { kind: 'notify', from: 'Authenticator', meta: '1 min ago', body: ['Sign-in approved: your Kettle & Co laptop'], real: 'You just signed in yourself.' },
      { kind: 'notify', from: 'Northway Bank', meta: '2 min ago', body: ["You logged in from a new device. If this wasn't you, call the number on your card."], real: 'A warning that sends you to your card.' },
      { kind: 'notify', from: 'Kettle & Co IT', meta: '10 min ago', body: ['Reminder: we will never ask you to approve a sign-in you did not start.'], real: 'Your IT team giving good advice.' },
    ],
    why: 'Someone with your password fires sign-in requests until you approve one to make them stop. If you did not start it, deny it and change your password.',
  },
  {
    id: 'h-mfa-2', scam: 'bait', attack: 'MFA fatigue (push bombing)',
    goal: 'Your work account. Which is the attack, if any?',
    cards: [
      { kind: 'call', from: 'Kettle & Co IT', meta: 'Incoming call · unknown number', body: ["\"Hi, it's IT. We're resetting accounts today. You'll get a sign-in prompt: just tap Approve so we can finish.\""], fake: true, tell: 'just tap Approve' },
      { kind: 'call', from: 'Kettle & Co IT', meta: 'You called the IT desk', body: ['"Your password has expired. I\'ll send a reset link to your work email."'], real: 'You called them, and the link goes to your own inbox.' },
      { kind: 'notify', from: 'Authenticator', meta: 'now', body: ['Enter the number shown on your screen: 47'], real: 'Number matching: you type the number from the screen you are using, so you can only approve your own sign-in.' },
      { kind: 'email', from: 'Kettle & Co IT', meta: 'it@kettleandco.co.uk', subject: 'Planned maintenance', body: ['Email will be offline on Saturday from 10pm to midnight. No action needed.'], real: 'A notice that asks nothing of you.' },
    ],
    why: 'A caller who tells you to approve a prompt is the attacker. Real IT staff never need you to approve a sign-in you did not start.',
  },
  {
    id: 'h-chat-1', scam: 'disguise', attack: 'Messaging account takeover',
    goal: 'Messages on ChatLine. Which one is the attack, if any?',
    cards: [
      { kind: 'text', from: 'Aunt Jo', body: ["Hi love, I sent you a 6-digit code by mistake, can you send it to me? It's urgent"], fake: true, tell: 'I sent you a 6-digit code by mistake' },
      { kind: 'text', from: 'ChatLine', body: ["Your ChatLine code: 381-204. Don't share this code with anyone."], real: 'The code itself is genuine. Sharing it is the danger.' },
      { kind: 'text', from: 'Book club', body: ['Jo: Sunday at mine, 3pm. Bring the book!'], real: 'A normal group message.' },
      { kind: 'text', from: 'Aunt Jo', body: ['Landed safely! Weather is awful, typical. Speak soon x'], real: 'Jo, asking for nothing.' },
    ],
    why: 'That code lets anyone move your account to their phone. Jo’s account was taken the same way and is now being used on you. Turn on two-step verification in the app.',
  },
  {
    id: 'h-chat-2', scam: 'disguise', attack: 'Messaging account takeover', none: true,
    goal: 'You are moving ChatLine to your new phone. Which is the attack, if any?',
    cards: [
      { kind: 'text', from: 'ChatLine', body: ["Your ChatLine code: 552-917. Don't share this code with anyone."], real: 'You just asked for it, on your own new phone.' },
      { kind: 'notify', from: 'ChatLine', meta: 'now', body: ["Two-step verification is on. You'll be asked for your PIN."], real: 'Your own security setting doing its job.' },
      { kind: 'text', from: 'Sam', body: ['Got a new phone too! Same number though'], real: 'Same saved contact, same number, asking for nothing.' },
      { kind: 'email', from: 'ChatLine', meta: 'security@chatline.app', subject: 'Signed in on a new phone', body: ['If this was you, you can ignore this email.'], real: 'It was you, so there is nothing to do.' },
    ],
    why: 'All four are real. You asked for the code yourself, and nobody asked you to share it.',
  },
  {
    id: 'h-bitb-1', scam: 'lookalike', attack: 'Fake login pop-up (browser-in-the-browser)',
    goal: 'Which sign-in window is the attack, if any?',
    cards: [
      { kind: 'popup', from: 'Sign in with Northway', meta: 'northwaybank.co.uk/signin', body: ['Opened from a quiz site. Try to drag it: it cannot leave the page.'], fake: true, tell: 'it cannot leave the page' },
      { kind: 'popup', from: 'Sign in with Northway', meta: 'northwaybank.co.uk/signin', body: ['A separate window you can drag anywhere on your screen.'], real: 'A real pop-up is its own window and moves freely.' },
      { kind: 'popup', from: 'Sign in', meta: 'harbourherald.co.uk/login', body: ['Email and password for your Harbour Herald account.'], real: 'The site’s own login page.' },
      { kind: 'notify', from: 'Password manager', meta: 'now', body: ['Fill your password for northwaybank.co.uk?'], real: 'Password managers only offer to fill on the real address.' },
    ],
    why: 'A fake pop-up is drawn inside the page, address bar and all, so the address you see proves nothing. A real window can leave the page; a fake one cannot.',
  },
  {
    id: 'h-bitb-2', scam: 'lookalike', attack: 'Fake login pop-up (browser-in-the-browser)',
    goal: 'Which login is the attack, if any?',
    cards: [
      { kind: 'popup', from: 'StreamBox: sign in', meta: 'streambox.com/login', body: ['Opened from the StreamBox app you installed.'], real: 'From an app you trust, to the real address.' },
      { kind: 'popup', from: 'Sign in with Northway', meta: 'northwaybank.co.uk/signin', body: ['Your password manager filled in your details.'], real: 'Your password manager recognised the real site.' },
      { kind: 'popup', from: 'Sign in to claim your gift card', meta: 'northwaybank.co.uk/signin', body: ['Your password manager offers nothing here, so you type it in.'], fake: true, tell: 'Your password manager offers nothing here' },
      { kind: 'popup', from: 'Kettle & Co: staff login', meta: 'login.kettleandco.co.uk', body: ['Opened from your work bookmark.'], real: 'From your own bookmark.' },
    ],
    why: 'When your password manager stays silent on a page that claims to be your bank, believe the password manager, not the address you can see.',
  },
  {
    id: 'h-ads-1', scam: 'lookalike', attack: 'Fake search ads (malvertising)',
    goal: 'You searched "Northway Bank login". Which result is the attack, if any?',
    cards: [
      { kind: 'search', from: 'Northway Bank: Online Banking Login', meta: 'Sponsored · northwaybank-login.com', body: ['Log in securely to your account.'], fake: true, tell: 'northwaybank-login.com' },
      { kind: 'search', from: 'Northway Bank | Log in', meta: 'northwaybank.co.uk', body: ['Log in to Northway online banking.'], real: 'The real address.' },
      { kind: 'search', from: 'Northway Bank | Contact us', meta: 'northwaybank.co.uk/contact', body: ['Lost card, fraud and opening times.'], real: 'The real address, a different page.' },
      { kind: 'search', from: 'Switch to Northway and get £150', meta: 'Sponsored · northwaybank.co.uk/switch', body: ['Move your current account in seven days.'], real: 'An advert, but it goes to the real address.' },
    ],
    why: 'Criminals buy the top advert spot for bank names. Sponsored does not mean safe: read the address, or use a bookmark.',
  },
  {
    id: 'h-ads-2', scam: 'lookalike', attack: 'Fake search ads (malvertising)',
    goal: 'You searched for a free photo editor. Which result is the attack, if any?',
    cards: [
      { kind: 'search', from: 'PixelForge: free photo editor', meta: 'Sponsored · pixelforge-download.net', body: ['Download the official installer.'], fake: true, tell: 'pixelforge-download.net' },
      { kind: 'search', from: 'PixelForge', meta: 'pixelforge.org', body: ['Free and open-source photo editor.'], real: 'The project’s own site.' },
      { kind: 'search', from: 'PixelForge in your app store', meta: 'App store', body: ["Install from your computer's app store."], real: 'App stores check what they sell.' },
      { kind: 'search', from: 'PixelForge review', meta: 'harbourherald.co.uk/tech', body: ['Is the free editor any good? We tried it.'], real: 'A review, not a download.' },
    ],
    why: 'Fake download adverts hide malware inside a working copy of the real program. Download from the maker’s own site or your app store.',
  },
  {
    id: 'h-callback-1', scam: 'voice', attack: 'Callback phishing',
    goal: 'Which email is the attack, if any?',
    cards: [
      { kind: 'email', from: 'StreamBox', meta: 'billing@streambox.com', subject: 'Your receipt', body: ['Thanks for your payment of £10.99.'], real: 'A receipt for a plan you have.' },
      { kind: 'email', from: 'SecureShield Antivirus', meta: 'orders.secureshield@gmail.com', subject: 'Order confirmed: £399.99', body: ['Your 3-year plan renews today. To cancel and get a refund, call 020 7946 0477 within 24 hours.'], fake: true, tell: 'call 020 7946 0477 within 24 hours' },
      { kind: 'email', from: 'Kettle & Co', meta: 'orders@kettleandco.co.uk', subject: 'Order shipped', body: ['Your teapot is on its way. Track it in your account.'], real: 'An order you made.' },
      { kind: 'email', from: 'Larkspur', meta: 'receipts@larkspur.co.uk', subject: 'Your e-receipt', body: ['Total £46.20. Thanks for shopping with us.'], real: 'A shopping receipt.' },
    ],
    why: 'A fake bill with only a phone number slips past spam filters. On the call, a "refund agent" asks for remote access, then claims they refunded too much and asks for the difference back.',
  },
  {
    id: 'h-callback-2', scam: 'voice', attack: 'Callback phishing', none: true,
    goal: 'Bills and renewals. Which is the attack, if any?',
    cards: [
      { kind: 'email', from: 'ViewLicence', meta: 'renewals@viewlicence.co.uk', subject: 'Renewal', body: ['Your licence renews on 1 January by direct debit.'], real: 'A renewal you already pay for.' },
      { kind: 'email', from: 'Coastline', meta: 'billing@coastline.co.uk', subject: 'Your bill', body: ['Your bill is £18.00. View it in the Coastline app.'], real: 'Points you to your own app.' },
      { kind: 'email', from: 'StreamBox', meta: 'billing@streambox.com', subject: 'Price change', body: ['From 1 January your plan costs £11.99. Change it in the app.'], real: 'A price rise with no deadline.' },
      { kind: 'email', from: 'Brightside Energy', meta: 'hello@brightside-energy.co.uk', subject: 'Annual statement', body: ['Your yearly energy statement is ready in your account.'], real: 'Points you to your account.' },
    ],
    why: 'Every one points you to your own account or app, and none gives you a number to ring in a hurry.',
  },
  {
    id: 'h-job-1', scam: 'bait', attack: 'Fake recruiter',
    goal: 'Job messages. Which one is the attack, if any?',
    cards: [
      { kind: 'email', from: 'Hana, Tideway Talent', meta: 'hana@tidewaytalent.co.uk', subject: 'Junior analyst role', body: ['Your CV looks a good fit. Could we book a 20-minute call this week?'], real: 'A recruiter asking for a call, nothing more.' },
      { kind: 'text', from: 'Recruiter Emma', body: ["Congrats, you're hired as a remote assistant! Before you start, buy your laptop from our approved supplier and we'll refund it in your first pay."], fake: true, tell: 'buy your laptop from our approved supplier' },
      { kind: 'email', from: 'Kettle & Co HR', meta: 'hr@kettleandco.co.uk', subject: 'Your first day', body: ['Please bring your passport on your first day so we can check your right to work.'], real: 'Right-to-work checks are a legal requirement, done in person.' },
      { kind: 'email', from: 'Fernway Outdoor', meta: 'jobs@fernwayoutdoor.co.uk', subject: 'Application received', body: ['Thanks for applying. We will be in touch within two weeks.'], real: 'A normal reply to an application.' },
    ],
    why: 'Hired with no interview, then asked to pay first: that is a scam. Real employers buy your equipment.',
  },
  {
    id: 'h-job-2', scam: 'bait', attack: 'Fake recruiter',
    goal: 'Which is the attack, if any?',
    cards: [
      { kind: 'email', from: 'Tideway Talent', meta: 'careers@tidewaytalent.co.uk', subject: 'Interview confirmed', body: ['Thursday 2pm at our Leeds office. Ask for Hana at reception.'], real: 'A real interview at a real office.' },
      { kind: 'text', from: '+44 7700 900588', body: ['Hi, I found your CV online. Part-time data job, £300 a day. To set up payroll, send a photo of your passport and bank card.'], fake: true, tell: 'send a photo of your passport and bank card' },
      { kind: 'profile', from: 'Hana Patel', meta: 'Recruiter at Tideway Talent · 500+ connections', body: ['"We\'re hiring analysts in Leeds. Apply on our careers page."'], real: 'Sends you to the company’s own careers page.' },
      { kind: 'email', from: 'Tideway Talent', meta: 'careers@tidewaytalent.co.uk', subject: 'Not this time', body: ['Thanks for interviewing. We have offered the role to another candidate.'], real: 'A rejection, sadly real.' },
    ],
    why: 'A passport and bank card photo is everything needed to open accounts in your name. No payroll needs them before an interview.',
  },
  {
    id: 'h-sim-1', scam: 'voice', attack: 'SIM swap',
    goal: 'Your phone suddenly shows "No service". Which is the attack, if any?',
    cards: [
      { kind: 'call', from: 'Coastline', meta: 'Incoming call, yesterday · 020 7946 0300', body: ["\"We're upgrading you to 5G. I'll text you a code, just read it back so we can switch your SIM.\""], fake: true, tell: 'read it back so we can switch your SIM' },
      { kind: 'text', from: 'Coastline', body: ['Your SIM was activated on a new device at 14:02. Not you? Call us from another phone.'], real: 'This is your network warning you. Act on it fast.' },
      { kind: 'text', from: 'Coastline', body: ['Your monthly bill of £18.00 will be collected on 1 December.'], real: 'A bill reminder.' },
      { kind: 'notify', from: 'Northway Bank', meta: 'now', body: ['Your phone number changed recently, so some payments are paused for 24 hours.'], real: 'Your bank protecting you after the swap.' },
    ],
    why: 'With your number, a criminal receives your bank codes. Never read out a code from your network, and if your phone loses service out of nowhere, call your network from another phone.',
  },
  {
    id: 'h-sim-2', scam: 'voice', attack: 'SIM swap', none: true,
    goal: 'You are switching networks and ordered a new SIM. Which is the attack, if any?',
    cards: [
      { kind: 'text', from: 'Coastline', body: ['Your new SIM is on its way. Pop it in when it arrives and your number moves over.'], real: 'The SIM you ordered.' },
      { kind: 'text', from: 'Tidal Mobile', body: ['Your PAC code is 482 911 HJK. Give it to your new network to keep your number.'], real: 'You asked for this code to switch networks.' },
      { kind: 'notify', from: 'Northway Bank', meta: 'now', body: ['Security codes will now go to your app instead of by text.'], real: 'A safer setting you chose.' },
      { kind: 'call', from: 'Coastline', meta: 'You called them', body: ['"I can see you ordered the new SIM yesterday. It should be active by tonight."'], real: 'You called them.' },
    ],
    why: 'You started every one of these yourself. A code or SIM change is only dangerous when you did not ask for it.',
  },
];

export const byScam = (s: Scam) => questions.filter((q) => q.scam === s);
