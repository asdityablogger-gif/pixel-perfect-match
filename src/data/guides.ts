export interface GuideOption {
  label: string;
  next: string;
}

export type GuideNode =
  | { type: "question"; text: string; options: GuideOption[] }
  | {
      type: "result";
      title: string;
      body: string;
      suggestions: string[];
      articleSlug?: string;
      seeDoctor?: boolean;
    };

export interface Guide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: "sage" | "peach" | "sky";
  safetyNote: string;
  start: string;
  nodes: Record<string, GuideNode>;
}

export const GUIDES: Guide[] = [
  {
    id: "crying",
    title: "My baby is crying",
    subtitle: "Walk through the most common reasons, step by step",
    icon: "Baby",
    accent: "peach",
    safetyNote:
      "This helper explores everyday explanations — it cannot diagnose. If your baby has a fever, is unusually sleepy or floppy, refuses feeds repeatedly, vomits forcefully, or something simply feels wrong, contact a health professional now. For babies under 3 months, a fever of 38 °C (100.4 °F) or higher always needs urgent care.",
    start: "q1",
    nodes: {
      q1: {
        type: "question",
        text: "How is the crying overall?",
        options: [
          { label: "Usual fussiness, maybe a bit more than normal", next: "q2" },
          {
            label: "Sudden, dramatic change from my baby's normal",
            next: "r-doctor",
          },
          {
            label: "Intense, long crying spells (hours), otherwise well between them",
            next: "q-colic",
          },
        ],
      },
      q2: {
        type: "question",
        text: "When did your baby last feed?",
        options: [
          { label: "It's been a while — probably hungry", next: "r-hungry" },
          { label: "Recently fed", next: "q3" },
        ],
      },
      q3: {
        type: "question",
        text: "When was the last diaper change?",
        options: [
          { label: "A while ago — worth checking", next: "r-diaper" },
          { label: "Fresh diaper", next: "q4" },
        ],
      },
      q4: {
        type: "question",
        text: "How long has your baby been awake?",
        options: [
          { label: "More than the usual stretch — might be overtired", next: "r-sleepy" },
          { label: "Recently woke up / short awake time", next: "q5" },
        ],
      },
      q5: {
        type: "question",
        text: "Any signs of tummy discomfort?",
        options: [
          {
            label: "Yes — legs pulled up, squirming, gassy, arching after feeds",
            next: "r-gas",
          },
          { label: "Not really", next: "q6" },
        ],
      },
      q6: {
        type: "question",
        text: "What has today been like around your baby?",
        options: [
          {
            label: "Busy, loud, bright, lots of people or handling",
            next: "r-overstimulated",
          },
          { label: "Calm and ordinary", next: "q7" },
        ],
      },
      q7: {
        type: "question",
        text: "Anything physically uncomfortable you can spot?",
        options: [
          {
            label: "Maybe — a tight sock, scratchy tag, hair wrapped around a finger or toe, rash",
            next: "r-discomfort",
          },
          { label: "Nothing visible", next: "r-comfort" },
        ],
      },
      "q-colic": {
        type: "question",
        text: "Does the pattern match fussy evenings — worse in late afternoon and night, baby well between spells?",
        options: [
          { label: "Yes, that pattern", next: "r-colic" },
          { label: "No, it's random around the clock", next: "q2" },
        ],
      },
      "r-hungry": {
        type: "result",
        title: "Hunger is the most common reason",
        body: "Feeding cues like rooting, hand-sucking and restlessness usually show up before crying. A feed often solves this one — and if it doesn't, you've ruled out the biggest category.",
        suggestions: [
          "Offer a feed, watching for early cues next time",
          "If your baby settles while feeding but fusses after, walk through the other reasons",
          "Cluster feeding in the evening is normal and not a supply problem",
        ],
        articleSlug: "breastfeeding-basics",
      },
      "r-diaper": {
        type: "result",
        title: "A wet or soiled diaper is a classic",
        body: "Some babies protest loudly, others barely notice — but it's the easiest thing to check. Change, let the skin air-dry a moment, and see if calm returns.",
        suggestions: [
          "Change the diaper and give brief diaper-free air time",
          "Check for a developing rash while you're there",
        ],
        articleSlug: "diapering-hygiene",
      },
      "r-sleepy": {
        type: "result",
        title: "An overtired baby often cries hardest",
        body: "Past a certain point of tiredness, babies get wired and fight sleep instead of drifting off. The cure is a calm, dark, boring wind-down.",
        suggestions: [
          "Dim the room, add white noise, keep handling minimal",
          "Try the usual sleep routine shortened: feed, song, into the crib drowsy but awake",
          "Swaddle if your baby is young and not yet rolling (back to sleep)",
        ],
        articleSlug: "sleep-rhythms",
      },
      "r-gas": {
        type: "result",
        title: "Tummy discomfort is very common",
        body: "Trapped gas and immature digestion make babies squirm and arch. It's uncomfortable but passes with time and gentle help.",
        suggestions: [
          "Burp midway through and after feeds",
          "Gentle clockwise tummy massage or bicycling legs",
          "Hold upright for 10–15 minutes after feeds",
          "Ask your provider about feeding technique if it happens at most feeds",
        ],
        articleSlug: "bottle-feeding",
      },
      "r-overstimulated": {
        type: "result",
        title: "Overstimulation is a frequent culprit",
        body: "A busy day out, visitors, bright lights and lots of handling can overwhelm a baby's brand-new nervous system. The fix is boring: quiet, dim, close.",
        suggestions: [
          "Move to a quiet dim room, hold skin-to-skin or snugly",
          "Skip further play and stimulation for the rest of the wake window",
          "White noise or a soft 'shhh' can help reset",
        ],
      },
      "r-discomfort": {
        type: "result",
        title: "Check the small physical stuff",
        body: "Tight clothing, a scratchy label, temperature, or a hair wrapped around a finger or toe (a hair tourniquet) can all cause real distress. Undress your baby and check fingers, toes and skin calmly.",
        suggestions: [
          "Check clothing, tags, temperature (feel the chest, not hands)",
          "Look carefully between fingers and toes",
          "Check the diaper area for rash starting",
        ],
        articleSlug: "diapering-hygiene",
      },
      "r-comfort": {
        type: "result",
        title: "Sometimes the reason is simply needing you",
        body: "Babies cry to request closeness, and that need is real and healthy. If the checklist comes up empty, comfort may be the whole answer.",
        suggestions: [
          "Hold skin-to-skin, rock gently, or carry in a sling while you move",
          "Try a pacifier or your clean finger for sucking comfort",
          "Vary one thing at a time and give each a couple of minutes",
          "It's okay if nothing works instantly — calm presence counts",
        ],
        articleSlug: "understanding-crying",
      },
      "r-colic": {
        type: "result",
        title: "This sounds like the fussy-evening pattern",
        body: "Predictable evening crying that peaks around six weeks and fades by three to four months is very common and not caused by anything you did. It still deserves the everyday checks — but between spells, a well, feeding, gaining baby with this pattern usually just needs time.",
        suggestions: [
          "Try the soothing toolbox one item at a time",
          "Slower, more upright feeds with extra burping",
          "Trade shifts with a partner or friend so you get a guaranteed break",
          "Ask your provider to confirm the pattern at your next visit",
        ],
        articleSlug: "colic-fussy-evenings",
      },
      "r-doctor": {
        type: "result",
        title: "A sudden change deserves professional eyes",
        body: "A dramatic change from your baby's normal crying — especially with fever, poor feeding, vomiting, unusual sleepiness or a rash — is the kind of thing to check with a health professional today. This helper can't rule anything out; your instinct to worry is worth acting on.",
        suggestions: [
          "Contact your doctor or health line today",
          "Note when the change started and anything else different (feeds, diapers, sleep)",
          "If breathing is labored, your baby is unresponsive, or under 3 months with fever of 38 °C/100.4 °F+, seek urgent care now",
        ],
        seeDoctor: true,
        articleSlug: "when-to-call-the-doctor",
      },
    },
  },
  {
    id: "sleep-trouble",
    title: "Sleep isn't going well",
    subtitle: "From short naps to hard bedtimes",
    icon: "Moon",
    accent: "sky",
    safetyNote:
      "Always place your baby on their back on a firm, flat surface with nothing soft or loose in the sleep space. If your baby snores loudly, pauses breathing, or is hard to wake, mention it to a health professional.",
    start: "q1",
    nodes: {
      q1: {
        type: "question",
        text: "What's the main sleep problem right now?",
        options: [
          { label: "Takes a long time to fall asleep", next: "q2" },
          { label: "Wakes very frequently at night", next: "q4" },
          { label: "Naps are very short or missing", next: "q6" },
        ],
      },
      q2: {
        type: "question",
        text: "How does your baby seem at bedtime?",
        options: [
          { label: "Wired, fussy, arching back, fighting sleep", next: "r-overtired" },
          { label: "Calm but just stays awake", next: "q3" },
        ],
      },
      q3: {
        type: "question",
        text: "Does your baby fall asleep only with lots of help (feeding, rocking, holding)?",
        options: [
          { label: "Yes, that's the only way", next: "r-sleep-association" },
          { label: "Sometimes settles alone, sometimes not", next: "r-wind-down" },
        ],
      },
      q4: {
        type: "question",
        text: "How old is your baby (roughly)?",
        options: [
          { label: "Under 4 months", next: "r-normal-newborn" },
          { label: "4–9 months", next: "q5" },
          { label: "9 months or older", next: "q5" },
        ],
      },
      q5: {
        type: "question",
        text: "When your baby wakes, are they fully hungry or just briefly restless?",
        options: [
          { label: "Genuinely hungry most wakings", next: "r-day-intake" },
          { label: "Restless, wakes fully between sleep cycles", next: "r-sleep-association" },
        ],
      },
      q6: {
        type: "question",
        text: "How does your baby act between naps?",
        options: [
          { label: "Cranky, rubbing eyes, yawning well before 'naptime'", next: "r-wake-window" },
          { label: "Happy enough but refuses the crib", next: "r-settling" },
        ],
      },
      "r-overtired": {
        type: "result",
        title: "Overtired is the most likely story",
        body: "When babies stay awake past their window, stress hormones make sleep harder — the exact opposite of what parents expect. Earlier bedtime and shorter wake windows usually help within days.",
        suggestions: [
          "Move bedtime 30–45 minutes earlier for a few days",
          "Watch for early cues (staring, yawning, fussing) and start the routine at the first sign",
          "Keep the routine short, dim and repetitive",
        ],
        articleSlug: "sleep-rhythms",
      },
      "r-wind-down": {
        type: "result",
        title: "A consistent wind-down ritual helps most",
        body: "Babies learn sleep cues through repetition. The same short sequence, in the same order, in the same room, signals 'sleep is next' better than any technique applied once.",
        suggestions: [
          "Feed → brief book or song → dim room → into the crib drowsy but awake",
          "Keep lights low and voices quiet for the last hour",
          "Give it two weeks of consistency before judging results",
        ],
        articleSlug: "safe-sleep",
      },
      "r-sleep-association": {
        type: "result",
        title: "Falling asleep in one place, waking in another",
        body: "If feeding or rocking is how sleep starts, waking between sleep cycles without it feels alarming — so your baby calls for it again. That's normal wiring, not a bad habit, and it's changeable gradually.",
        suggestions: [
          "Try putting down drowsy but awake for at least one sleep a day",
          "Small, gentle shifts at first — a hand on the chest instead of full rocking",
          "Consistency matters more than speed; regressions during teething and illness are normal",
        ],
        articleSlug: "sleep-rhythms",
      },
      "r-normal-newborn": {
        type: "result",
        title: "For the first months, this is normal",
        body: "Newborns sleep in 2–4 hour stretches around the clock, with no real day-night rhythm until roughly 6–12 weeks. Frequent waking is protective and developmental, not a problem to fix.",
        suggestions: [
          "Nap when you can and share night shifts if possible",
          "Expose your baby to daylight and normal daytime noise to help the rhythm emerge",
          "Protect one guaranteed stretch of sleep for yourself daily",
        ],
        articleSlug: "newborn-basics",
      },
      "r-day-intake": {
        type: "result",
        title: "Hunger at night often starts with daytime feeding",
        body: "If most night wakings are true hunger, look at daytime intake first: distracted or skimpy day feeds commonly show up as hungry nights.",
        suggestions: [
          "Offer full, unhurried feeds during the day",
          "Consider a slightly later 'dream feed' before your own bedtime",
          "Check your baby's growth at regular visits to be sure intake is on track",
        ],
        articleSlug: "breastfeeding-basics",
      },
      "r-wake-window": {
        type: "result",
        title: "Wake windows may need adjusting",
        body: "Every age has a sweet spot of awake time. Too long and babies go overtired; too short and they don't feel sleepy enough to settle.",
        suggestions: [
          "Newborn 45–60 min; 3–4 months ~1.5–2 h; 6–9 months 2–3 h; 12 months 3–4 h",
          "Watch your own baby's cues — the ranges are guides, not rules",
          "Track naps for a few days to see the natural pattern",
        ],
        articleSlug: "sleep-rhythms",
      },
      "r-settling": {
        type: "result",
        title: "Refusing the crib is common and workable",
        body: "Some babies protest the change of surface, temperature and smell. Practicing the crib for one sleep a day builds tolerance without turning every nap into a battle.",
        suggestions: [
          "Warm the sheet slightly and put your baby down drowsy but awake",
          "Stay close with a hand on the chest for the first minute or two",
          "Try the crib for the first nap of the day, when sleep pressure and mood are best",
        ],
        articleSlug: "safe-sleep",
      },
    },
  },
  {
    id: "feeding-worries",
    title: "Something feels off with feeding",
    subtitle: "Amounts, refusal, spit-up and more",
    icon: "Milk",
    accent: "sage",
    safetyNote:
      "Contact a health professional promptly if your baby is not gaining weight, has fewer wet diapers, refuses several feeds in a row, vomits forcefully and repeatedly, or shows signs of allergy such as hives, swelling or breathing difficulty — breathing trouble is an emergency.",
    start: "q1",
    nodes: {
      q1: {
        type: "question",
        text: "What worries you most right now?",
        options: [
          { label: "Seems to eat too little", next: "q2" },
          { label: "Refuses the breast or bottle", next: "q4" },
          { label: "Lots of spit-up or vomiting", next: "q5" },
          { label: "Seems gassy or uncomfortable during feeds", next: "r-gassy" },
        ],
      },
      q2: {
        type: "question",
        text: "How is your baby's weight gain and diaper output?",
        options: [
          {
            label: "Gaining well, plenty of wet diapers, just seems fussy at feeds",
            next: "r-snacker",
          },
          {
            label: "Not gaining well, or noticeably fewer wet diapers",
            next: "r-growth-check",
          },
        ],
      },
      q3: {
        type: "question",
        text: "Has this changed recently?",
        options: [
          { label: "Yes — started around a growth spurt, teething or illness", next: "r-phase" },
          { label: "No, it's been this way a while", next: "r-routine-check" },
        ],
      },
      q4: {
        type: "question",
        text: "When did the refusal start?",
        options: [
          { label: "Suddenly, within the last day or two", next: "r-refusal-sudden" },
          { label: "Gradually, over a week or more", next: "r-refusal-gradual" },
        ],
      },
      q5: {
        type: "question",
        text: "How would you describe it?",
        options: [
          {
            label: "Mild spit-up, baby comfortable and gaining well",
            next: "r-normal-spitup",
          },
          {
            label: "Forceful, increasing, or with poor weight gain or discomfort",
            next: "r-vomit-check",
          },
        ],
      },
      "r-snacker": {
        type: "result",
        title: "Snacking and distractibility are normal",
        body: "Babies around 3–6 months often become efficient, distractible feeders — short feeds, lots of looking around. If growth and diapers are on track, intake is probably fine.",
        suggestions: [
          "Feed in a calm, dim, quiet spot for a few days",
          "Watch for early hunger cues instead of the clock",
          "Judge intake by the week (diapers, mood, weight), not by one feed",
        ],
        articleSlug: "breastfeeding-basics",
      },
      "r-growth-check": {
        type: "result",
        title: "Get intake checked by a professional",
        body: "Weight and wet diapers are the objective measures of feeding. If either is off, this needs a hands-on check with your doctor, midwife or a lactation consultant soon — that's a normal part of infant care, not an overreaction.",
        suggestions: [
          "Book an appointment in the next day or two",
          "Log feeds and diapers for 24 hours before the visit — the record helps a lot",
          "Don't supplement on your own without guidance; get a plan first",
        ],
        seeDoctor: true,
        articleSlug: "breastfeeding-basics",
      },
      "r-phase": {
        type: "result",
        title: "Feeding dips during leaps are common",
        body: "Growth spurts, teething, stuffed noses and minor illnesses all temporarily disrupt feeding. Appetite usually returns within days as long as your baby stays comfortable and hydrated.",
        suggestions: [
          "Offer more often rather than bigger amounts",
          "For stuffy noses, saline drops and suction before feeds help",
          "Watch wet diapers — they tell you hydration is okay",
        ],
      },
      "r-routine-check": {
        type: "result",
        title: "Look at the feeding pattern as a whole",
        body: "Long-term 'too little' is best judged over a full week. Count total feeds, total time, diapers and mood — often the totals are better than they feel in the moment.",
        suggestions: [
          "Track everything for a few days (this app's Feeding Tracker makes it easy)",
          "Discuss the log at your next well-child visit",
          "Get a hands-on latch or bottle-nipple check if feeds are long and tiring",
        ],
        articleSlug: "bottle-feeding",
      },
      "r-refusal-sudden": {
        type: "result",
        title: "Sudden refusal usually has a findable reason",
        body: "Ear pain, sore mouth (thrush), a stuffy nose, a painful sore in the mouth, teething, or even a shot or a scary startle during a feed can cause sudden refusal.",
        suggestions: [
          "Check for fever, stuffy nose, mouth white patches or visible sores",
          "Try feeding in a different position or room",
          "If refusal continues beyond a day, or your baby seems in pain, call your provider",
        ],
        seeDoctor: true,
        articleSlug: "when-to-call-the-doctor",
      },
      "r-refusal-gradual": {
        type: "result",
        title: "Gradual refusal is often developmental",
        body: "Older babies get opinionated: distracted, preferring solids, or testing autonomy. Sometimes the flow (too slow or too fast) is the issue with bottles.",
        suggestions: [
          "Feed in a quiet dim space; reduce distractions",
          "Check bottle nipple flow and try a different level if needed",
          "Keep feeds pressure-free — forcing backfires at this age",
        ],
        articleSlug: "starting-solids",
      },
      "r-normal-spitup": {
        type: "result",
        title: "Mild spit-up in a comfortable, gaining baby is normal",
        body: "The valve at the top of the stomach is loose in early infancy. As long as your baby is comfortable, feeding well and gaining weight, spit-up is a laundry problem, not a medical one.",
        suggestions: [
          "Burp midway and after feeds; hold upright 10–15 minutes after",
          "Avoid tight diapers and right-after-feed bouncing",
          "Expect improvement as solids increase and your baby spends more time upright",
        ],
        articleSlug: "bottle-feeding",
      },
      "r-vomit-check": {
        type: "result",
        title: "This pattern deserves a professional check",
        body: "Forceful or increasingly frequent vomiting, vomiting with poor weight gain, blood or green color, or a baby in obvious discomfort is not ordinary spit-up. These symptoms need prompt evaluation.",
        suggestions: [
          "Contact your doctor today",
          "Note when vomiting happens relative to feeds, and photograph anything unusual in color or content",
          "Watch for dehydration: fewer wet diapers, dry mouth, no tears, unusual sleepiness",
        ],
        seeDoctor: true,
        articleSlug: "when-to-call-the-doctor",
      },
      "r-gassy": {
        type: "result",
        title: "Feed-time discomfort usually comes back to gas or flow",
        body: "Swallowed air, fast flow, or gulping make feeds uncomfortable. Small technique changes often help a lot.",
        suggestions: [
          "Hold your baby more upright and keep the bottle tilted so the nipple stays full",
          "Pause to burp midway and at the end",
          "For breastfeeding, review latch — clicking sounds suggest swallowing air",
          "Gentle tummy massage and bicycling legs between feeds",
        ],
        articleSlug: "bottle-feeding",
      },
    },
  },
  {
    id: "skin-diaper",
    title: "Diaper rash & skin worries",
    subtitle: "Red bottoms, dry patches, drool rash",
    icon: "Sparkles",
    accent: "peach",
    safetyNote:
      "See a health professional if a rash comes with fever, is blistered or oozing, spreads beyond the diaper area, or doesn't improve after several days of consistent care. Breathing difficulty or swelling of lips or face with a rash is an emergency.",
    start: "q1",
    nodes: {
      q1: {
        type: "question",
        text: "Where is the problem?",
        options: [
          { label: "In the diaper area", next: "q2" },
          { label: "Face, cheeks or chin (drool or milk rash)", next: "r-drool" },
          { label: "Elsewhere on the body", next: "q4" },
        ],
      },
      q2: {
        type: "question",
        text: "What does it look like?",
        options: [
          { label: "Smooth red patches where the diaper touches", next: "r-irritation" },
          { label: "Deep red with satellite spots or raised edges", next: "r-yeast" },
          { label: "Raw, blistered or bleeding", next: "r-raw" },
        ],
      },
      q3: {
        type: "question",
        text: "How many days has the rash been there, with daily barrier cream and frequent changes?",
        options: [
          { label: "Getting better", next: "r-improving" },
          { label: "Three days or more, no improvement", next: "r-see" },
        ],
      },
      q4: {
        type: "question",
        text: "Has anything new happened recently — new food, soap, detergent, fabric, or illness?",
        options: [
          { label: "Yes, there's an obvious new thing", next: "r-irritant" },
          { label: "No obvious change", next: "r-general" },
        ],
      },
      "r-irritation": {
        type: "result",
        title: "This looks like ordinary diaper irritation",
        body: "Moisture, friction and stool enzymes irritate skin quickly. The treatment is boring but effective: dryness, air and a barrier.",
        suggestions: [
          "Change promptly, clean gently with water, pat dry",
          "Apply a thick barrier cream at every change — don't rub it fully off each time",
          "Give diaper-free air time a few times a day",
          "Skip wipes with fragrance or alcohol for now",
        ],
        articleSlug: "diapering-hygiene",
      },
      "r-yeast": {
        type: "result",
        title: "This pattern often needs a medicated cream",
        body: "Deep redness with sharply edged patches or satellite spots suggests a yeast rash, which doesn't respond to barrier cream alone and needs an antifungal from your provider.",
        suggestions: [
          "Keep doing the barrier routine — it prevents worsening",
          "Contact your provider for an antifungal cream",
          "Wash cloth diapers hot; yeast survives ordinary washing",
        ],
        seeDoctor: true,
        articleSlug: "diapering-hygiene",
      },
      "r-raw": {
        type: "result",
        title: "Raw or blistered skin needs a same-day look",
        body: "Broken skin in the diaper area can get infected quickly and is genuinely painful. This is worth having seen today rather than waiting it out.",
        suggestions: [
          "Call your doctor today",
          "Until then: gentle water cleaning, generous barrier cream, frequent changes and air time",
          "Watch for fever or spreading redness — those move it to urgent",
        ],
        seeDoctor: true,
        articleSlug: "when-to-call-the-doctor",
      },
      "r-improving": {
        type: "result",
        title: "Keep going — the routine is working",
        body: "Diaper skin takes several days to fully recover. Sticking with the boring basics is exactly right.",
        suggestions: [
          "Continue barrier cream until the skin looks normal for a few more days",
          "Keep up air time even after it looks better",
        ],
        articleSlug: "diapering-hygiene",
      },
      "r-see": {
        type: "result",
        title: "Three days without improvement is the checkpoint",
        body: "When consistent care doesn't move a rash in about three days, it's time for a professional look — that's the standard cutoff for most everyday rashes.",
        suggestions: [
          "Call your provider's office and describe what you've already tried",
          "Take a clear photo now; rashes change day to day",
        ],
        seeDoctor: true,
        articleSlug: "when-to-call-the-doctor",
      },
      "r-drool": {
        type: "result",
        title: "Drool rash is common and harmless",
        body: "Constant moisture plus friction irritates cheeks and chins, especially during teething. It flares and fades and needs no treatment beyond protection.",
        suggestions: [
          "Gently pat (never rub) the area dry through the day",
          "Apply a thin layer of a plain barrier ointment before naps and bedtime",
          "Use a soft absorbent bib and change it when damp",
        ],
      },
      "r-irritant": {
        type: "result",
        title: "A new irritant is the likely cause",
        body: "Skin reacts to new soaps, detergents, fabrics and foods. Removing the suspect item usually clears things up within days.",
        suggestions: [
          "Stop the new product or food for a week and watch",
          "Switch back to fragrance-free detergent and skip fabric softener",
          "Short lukewarm baths with plain water or a mild wash",
        ],
        articleSlug: "diapering-hygiene",
      },
      "r-general": {
        type: "result",
        title: "Watch, protect, and use the 3-day rule",
        body: "Most everyday rashes are irritation and settle with gentle care. Photograph it today, protect the skin, and let the three-day rule guide you.",
        suggestions: [
          "Keep baths short and lukewarm; moisturize with a plain fragrance-free cream",
          "Avoid scrubbing or new products meanwhile",
          "Fever, blisters, oozing, or a rash your baby seems sick with means calling now",
        ],
        seeDoctor: false,
        articleSlug: "when-to-call-the-doctor",
      },
    },
  },
];

export function getGuide(id: string): Guide | undefined {
  return GUIDES.find((g) => g.id === id);
}
