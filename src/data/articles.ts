export interface ArticleSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface Article {
  slug: string;
  title: string;
  category: "Newborn" | "Crying" | "Feeding" | "Sleep" | "Care & Hygiene" | "Safety" | "Development" | "Parents";
  minutes: number;
  summary: string;
  sections: ArticleSection[];
  related?: string[];
}

export const ARTICLE_CATEGORIES = [
  "Newborn",
  "Crying",
  "Feeding",
  "Sleep",
  "Care & Hygiene",
  "Safety",
  "Development",
  "Parents",
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "newborn-basics",
    title: "Newborn care basics",
    category: "Newborn",
    minutes: 6,
    summary:
      "The first weeks are about feeding often, sleeping safely, gentle handling and getting to know each other.",
    sections: [
      {
        heading: "What newborns actually need",
        body: "In the first weeks your baby needs very little beyond warmth, food, sleep, clean diapers and closeness. Holding your baby skin-to-skin calms both of you, helps regulate your baby's temperature and supports feeding. There is no such thing as holding a newborn too much.",
      },
      {
        heading: "Feeding rhythm",
        body: "Newborns usually feed 8 to 12 times in 24 hours, sometimes in clusters. Watch your baby, not the clock: early hunger signs include turning the head with an open mouth, sucking on hands and restlessness. Crying is a late hunger sign, so catching the earlier cues usually means calmer feeds.",
      },
      {
        heading: "Sleep, safely",
        body: "Newborns sleep 14 to 17 hours a day in short stretches. Always place your baby on their back on a firm, flat surface with no pillows, blankets, bumpers or toys in the sleep space. Room-sharing (but not bed-sharing) for at least the first six months is associated with a lower risk of sleep-related accidents.",
        bullets: [
          "Back to sleep, every sleep, day and night",
          "Firm mattress, nothing soft or loose in the crib",
          "Keep the room smoke-free",
          "Avoid overheating — dress your baby in one more layer than you would wear",
        ],
      },
      {
        heading: "Umbilical cord & gentle care",
        body: "The cord stump dries and falls off on its own within one to three weeks. Keep it clean and dry, fold the diaper below it, and skip alcohol swabs. Sponge baths are fine until the stump is gone. A little blood when it separates is normal; spreading redness or strong odor deserves a call to your care provider.",
      },
      {
        heading: "You matter too",
        body: "Recover, eat, sleep when you can, and accept every offer of help. The house can wait. If you feel persistently sad, anxious, numb or overwhelmed beyond the first two weeks, tell someone you trust and speak with a professional — postpartum mood difficulties are common and treatable.",
      },
    ],
    related: ["safe-sleep", "understanding-crying", "parent-self-care"],
  },
  {
    slug: "understanding-crying",
    title: "Understanding crying",
    category: "Crying",
    minutes: 5,
    summary:
      "Crying is your baby's only language. Learning to read it takes time — and it is okay not to know instantly.",
    sections: [
      {
        heading: "Crying rises then falls",
        body: "Most babies cry more from about two weeks of age, peak around six to eight weeks, and gradually settle by three to four months. This pattern happens in loving, attentive families everywhere. A fussy phase is not a sign that you are doing something wrong.",
      },
      {
        heading: "The usual suspects",
        body: "Work through the basics calmly: hunger, a wet or soiled diaper, tiredness, gas or tummy discomfort, being too hot or cold, an itchy tag or tight clothing, overstimulation, or simply needing to be held. Sometimes babies cry for no findable reason at all — that is normal too.",
      },
      {
        heading: "Soothing toolbox",
        body: "Babies calm in different ways. Try one thing at a time and give it a minute before switching.",
        bullets: [
          "Hold skin-to-skin or swaddle snugly (always on the back for sleep)",
          "Gentle rhythmic movement: rocking, walking, a stroller ride",
          "White noise or a soft \"shhh\" near the ear",
          "A pacifier or clean finger to suck on",
          "A warm bath, or gentle tummy massage for gas",
          "Reduce light and noise — sometimes quiet dimness is what works",
        ],
      },
      {
        heading: "When it is too much for you",
        body: "If crying pushes you to the edge, put your baby safely on their back in the crib, close the door, and take a few minutes to breathe. Check on your baby every minute or two. Never shake a baby — crying that won't stop is stressful for every parent, and a short pause keeps everyone safe. Reach out to your partner, family or a friend.",
      },
      {
        heading: "Trust your instincts",
        body: "Call a health professional if your baby's crying changes suddenly and dramatically, comes with fever, poor feeding, vomiting, unusual sleepiness or a rash, or if something simply feels wrong. You are not overreacting — that instinct is part of the job.",
      },
    ],
    related: ["when-to-call-the-doctor", "colic-fussy-evenings", "safe-sleep"],
  },
  {
    slug: "breastfeeding-basics",
    title: "Breastfeeding basics",
    category: "Feeding",
    minutes: 6,
    summary:
      "Good positioning, frequent feeding and realistic expectations carry most families through the early weeks.",
    sections: [
      {
        heading: "Getting a comfortable latch",
        body: "A deep, comfortable latch is the foundation. Turn your baby toward you, tummy to tummy, and wait for a wide-open mouth before bringing them to the breast — not the breast to the baby. Your baby's chin should touch the breast, lips flanged outward, and more areola covered below than above. Ongoing pinching pain is a signal to unlatch gently and try again.",
      },
      {
        heading: "How do I know my baby is getting enough?",
        body: "Count diapers and watch weight over days, not hours.",
        bullets: [
          "By day 5 or so, roughly 5–6+ wet diapers a day",
          "Regular soft, yellowish stools after the first days",
          "Audible swallowing and rhythmic sucking during feeds",
          "Baby seems satisfied and settles after most feeds",
          "Steady weight gain at checkups",
        ],
      },
      {
        heading: "Frequency and cluster feeds",
        body: "Frequent feeding — 8 to 12 times in 24 hours — builds supply and satisfies growth spurts, which often arrive around 2–3 weeks, 6 weeks and 3 months. Cluster feeding in the evening is normal and not a sign of low supply.",
      },
      {
        heading: "Getting help early",
        body: "Soreness that doesn't improve, persistent latch trouble, a baby who is not gaining weight, or painful lumps in the breast are all good reasons to contact a lactation consultant, midwife or doctor early. Small adjustments made in week one are much easier than fixes made in month two.",
      },
    ],
    related: ["bottle-feeding", "starting-solids"],
  },
  {
    slug: "bottle-feeding",
    title: "Bottle feeding with confidence",
    category: "Feeding",
    minutes: 4,
    summary:
      "Formula or pumped milk, paced feeding and safe preparation are the keys to relaxed bottle feeds.",
    sections: [
      {
        heading: "Paced feeding",
        body: "Hold the bottle fairly horizontal so milk flows slowly, let your baby draw the nipple in, and pause often. Watch for fullness cues: turning away, slowing down, splaying fingers, relaxed hands. Let your baby decide when to stop — a fed baby and a calm parent beat an empty bottle every time.",
      },
      {
        heading: "Amounts are a range, not a rule",
        body: "Most babies in the first months take somewhere around 150–200 ml per kilogram of body weight per day, split into feeds, but appetites vary a lot. Never prop a bottle or feed a lying-down baby; keep feeds upright and supervised.",
      },
      {
        heading: "Safe preparation",
        body: "Wash hands and work on a clean surface. Follow the formula tin exactly for water-to-powder ratios — never dilute or concentrate. For powdered formula, water that has been boiled and cooled to at least 70 °C at mixing time is the widely recommended standard; cool the bottle under running water before feeding. Discard leftover milk within about an hour of a feed starting.",
      },
      {
        heading: "Burping and spit-up",
        body: "Pause to burp midway and at the end. Some spit-up is completely normal in healthy, comfortable, gaining babies — laundry problem, not medical problem. Forceful or increasing vomiting, or spit-up with poor weight gain, deserves professional advice.",
      },
    ],
    related: ["breastfeeding-basics", "starting-solids"],
  },
  {
    slug: "starting-solids",
    title: "Starting solid foods",
    category: "Feeding",
    minutes: 6,
    summary:
      "Around six months, babies are ready to explore food — expect mess, small portions and strong opinions.",
    sections: [
      {
        heading: "Readiness signs, around six months",
        body: "Look for the combination, not a birthday:",
        bullets: [
          "Sits with little or no support and holds the head steady",
          "Reaches for food and brings hands or objects to the mouth",
          "Loss of the tongue-thrust reflex (doesn't automatically push food out)",
          "Interested when you eat",
        ],
      },
      {
        heading: "How to begin",
        body: "Start with small amounts of soft, iron-rich foods: iron-fortified cereal, well-cooked meat or fish, lentils and beans, or soft vegetables and fruit. Milk (breast or formula) remains the main nutrition through the first year — solids are practice, not replacement, at first. Introduce new foods one at a time with a day or two between if you like to watch for reactions.",
      },
      {
        heading: "Textures and self-feeding",
        body: "Move from smooth purées to mashed and soft finger foods within a few months. Soft strips your baby can hold are great practice. Avoid round, hard, slippery hazards: whole grapes, nuts, raw carrot, popcorn and similar foods are choking risks — cut, cook or grate them.",
      },
      {
        heading: "Foods to delay or avoid",
        body: "No honey in any form before 12 months (infant botulism risk). No added salt or sugar, no whole nuts before age 3-ish, no unpasteurized products, and no cow's milk as the main drink before 12 months (small amounts in cooking are fine).",
      },
      {
        heading: "Keep it pleasant",
        body: "Your job is what, when and where; your baby's job is whether and how much. Rejected foods often need 10–15 calm, pressure-free exposures before they're accepted. Watch for true allergic signs — hives, swelling, vomiting, breathing trouble — and seek urgent care for breathing difficulty.",
      },
    ],
    related: ["bottle-feeding", "development-by-months"],
  },
  {
    slug: "safe-sleep",
    title: "Safe sleep, every sleep",
    category: "Sleep",
    minutes: 4,
    summary:
      "A few consistent habits dramatically reduce sleep-related risks for babies.",
    sections: [
      {
        heading: "The core rules",
        body: "",
        bullets: [
          "Back to sleep for every sleep, naps included, until the first birthday",
          "Firm, flat sleep surface in a safety-approved crib or bassinet",
          "Nothing in the sleep space: no pillows, quilts, bumpers, toys or positioners",
          "Room-sharing without bed-sharing for at least the first six months",
          "Smoke-free environment, before and after birth",
          "Avoid overheating; light, snug clothing beats loose blankets",
        ],
      },
      {
        heading: "What about swaddling?",
        body: "Swaddling can soothe young babies who are not yet rolling. Keep it snug at the chest, loose at the hips, and stop as soon as your baby shows any sign of rolling — a swaddled baby who rolls cannot safely reposition.",
      },
      {
        heading: "Drowsy but awake",
        body: "Putting your baby down when drowsy but still awake helps them learn to fall asleep in the place they'll wake up. It doesn't work every time — especially in the newborn months — and that's fine. Consistency over months, not perfection over nights.",
      },
      {
        heading: "Night waking is development, not failure",
        body: "Waking every 2–4 hours is normal for young babies and serves feeding and brain development. Stretching sleep comes gradually, typically somewhere between 3 and 12 months, and regressions during leaps, teething and illness are normal too.",
      },
    ],
    related: ["newborn-basics", "sleep-rhythms"],
  },
  {
    slug: "sleep-rhythms",
    title: "Naps, rhythms and sleep basics",
    category: "Sleep",
    minutes: 5,
    summary:
      "Watch wake windows, keep a simple rhythm, and expect the routine to keep changing as your baby grows.",
    sections: [
      {
        heading: "Wake windows grow with age",
        body: "Overtired babies fight sleep. Rough guides: newborns manage about 45–60 minutes awake; by 3–4 months around 1.5–2 hours; by 6–9 months 2–3 hours; and by 12 months 3–4 hours. Yawning, staring, fussing and rubbing eyes mean the window is closing.",
      },
      {
        heading: "A rhythm, not a schedule",
        body: "A loose repeatable sequence — feed, brief awake play, sleep — helps babies anticipate what's next. Total sleep needs vary widely: many 6-month-olds sleep 12–15 hours across day and night, but 'normal' is a wide band.",
      },
      {
        heading: "Nap transitions",
        body: "Babies move from 4ish naps to 3 around 4–5 months, to 2 around 7–9 months, and toward one long midday nap somewhere between 12 and 18 months. Rough transition weeks look like broken naps — that's progress, not regression.",
      },
      {
        heading: "Settling ideas",
        body: "Dim room, white noise, a short wind-down ritual (feed, book, song, same few words), and putting down drowsy but awake when possible. If your baby only sleeps on you, that's common and safe when you're awake — for hands-free sleep, move them to their back in their own sleep space.",
      },
    ],
    related: ["safe-sleep", "understanding-crying"],
  },
  {
    slug: "diapering-hygiene",
    title: "Diapering & everyday hygiene",
    category: "Care & Hygiene",
    minutes: 4,
    summary:
      "Frequent changes, gentle cleaning and air time keep skin happy.",
    sections: [
      {
        heading: "Diaper routine",
        body: "Change wet diapers every 2–3 hours and poopy ones promptly. Clean front to back with water and a soft cloth or fragrance-free wipes; for girls, wipe from front to back to keep bacteria away from the urinary area. Let the skin air-dry for a moment before a fresh diaper.",
      },
      {
        heading: "Diaper rash basics",
        body: "Redness in the diaper area is usually irritation from moisture, friction or stool. It improves with more frequent changes, gentle cleaning, a thick protective barrier cream at every change, and regular diaper-free air time. Call your care provider if the rash is raw and blistered, spreads beyond the diaper area, comes with fever, or doesn't improve after several days of consistent care.",
      },
      {
        heading: "Bathing & grooming",
        body: "Two to three baths a week is plenty in the first year; plain water or a mild fragrance-free wash is enough. Keep baths short and warm (around 37–38 °C water). You can trim soft baby nails with baby clippers or a file while your baby sleeps or feeds.",
      },
      {
        heading: "Umbilical stump & circumcision care",
        body: "Keep the stump dry and fold diapers below it. If there has been a circumcision, follow your provider's written instructions and watch for spreading redness or discharge.",
      },
    ],
    related: ["bathing-safety", "when-to-call-the-doctor"],
  },
  {
    slug: "bathing-safety",
    title: "Bath time safety",
    category: "Care & Hygiene",
    minutes: 3,
    summary:
      "Warm water, everything ready in reach, and one hand on your baby — every single time.",
    sections: [
      {
        heading: "Never leave, not even for a second",
        body: "A baby can drown in a few centimeters of water, silently, in under a minute. If the phone rings or the doorbell goes, wrap your baby in a towel and take them with you.",
      },
      {
        heading: "Set-up",
        body: "Water around 37–38 °C (test with your wrist or a bath thermometer). Fill the tub first, never add hot water while your baby is in it. Have towel, washcloth, clean diaper and clothes within arm's reach before you start.",
      },
      {
        heading: "Sponge baths first",
        body: "Until the umbilical stump falls off, sponge baths are enough. After that, 2–3 short baths a week is plenty; more can dry the skin.",
      },
      {
        heading: "Water heaters",
        body: "Set your household water heater to 49 °C (120 °F) or lower to protect everyone in the home from scalds — a tap that feels merely 'hot' can burn a baby quickly.",
      },
    ],
    related: ["diapering-hygiene", "safety-at-home"],
  },
  {
    slug: "tummy-time",
    title: "Tummy time that works",
    category: "Development",
    minutes: 3,
    summary:
      "Short, frequent and pleasant beats long and tearful.",
    sections: [
      {
        heading: "Why it matters",
        body: "Time on the tummy while awake builds neck, shoulder and core strength needed for rolling, sitting and crawling. It also prevents flat spots that can develop when babies spend long periods on their backs.",
      },
      {
        heading: "How much, when",
        body: "Begin in the first days with 1–2 minute sessions, a few times a day, and build gradually. By 3 months, aim for a combined 30–60 minutes a day. Always on a firm surface, always awake and supervised — never for sleep.",
      },
      {
        heading: "Making it bearable",
        body: "Get down at eye level with faces, books and toys. Lie back with your baby tummy-down on your chest — this counts too, and newborns often prefer it. A rolled towel under the chest can help at first.",
      },
    ],
    related: ["development-by-months", "newborn-basics"],
  },
  {
    slug: "safety-at-home",
    title: "Home safety as your baby grows",
    category: "Safety",
    minutes: 5,
    summary:
      "Babies go from lying still to climbing in what feels like weeks. Stay one step ahead.",
    sections: [
      {
        heading: "Sleep and car",
        body: "Back to sleep on a firm surface with a bare crib. In the car, use a rear-facing infant seat appropriate for your baby's weight and height, installed per the manual, on every ride — no exceptions, even short ones.",
      },
      {
        heading: "Falls and bumps",
        body: "Never leave a baby unattended on a bed, sofa, changing table or bouncer on a raised surface — even a baby who 'can't roll yet'. Use the strap. Once crawling starts, gate the stairs and add window guards where needed.",
      },
      {
        heading: "Choking and small objects",
        body: "Anything that fits through a toilet-paper roll is a choking risk for under-3s. Keep coins, buttons, batteries (especially button batteries — urgent hazard), balloons, magnets and hard foods out of reach.",
      },
      {
        heading: "Water, heat and poison",
        body: "Empty buckets and baby baths immediately after use, set the water heater to 49 °C/120 °F or lower, keep hot drinks away from reaching hands, and store medications, cleaners and chemicals locked or high up. Save your local emergency and poison-control numbers in your phone now, before you need them.",
      },
    ],
    related: ["bathing-safety", "when-to-call-the-doctor"],
  },
  {
    slug: "development-by-months",
    title: "Development: the big picture",
    category: "Development",
    minutes: 6,
    summary:
      "Milestones are guideposts, not deadlines. Ranges are wide and every baby's path is their own.",
    sections: [
      {
        heading: "How to read milestones",
        body: "Milestones describe when most children do something, not when yours must. Premature babies follow their adjusted age. What matters over time is steady progress. Bring your questions to well-child visits — they are exactly what those visits are for.",
      },
      {
        heading: "Rough guideposts",
        body: "",
        bullets: [
          "1–2 months: focuses on faces, startles at sounds, begins to smile socially",
          "3–4 months: steady head control, laughs, follows moving objects, pushes up on elbows in tummy time",
          "5–6 months: rolls over, sits with support, reaches and grabs, babbles",
          "7–9 months: sits alone, crawls or scoots, transfers objects hand to hand, responds to their name, stranger awareness",
          "10–12 months: pulls to stand, cruises or first steps, first words, plays peek-a-boo, uses a pincer grip",
        ],
      },
      {
        heading: "Language grows with talk",
        body: "Narrate your day, respond to babbles as conversation, read picture books daily from birth. The number of words a baby hears and back-and-forth exchanges matter more than any gadget.",
      },
      {
        heading: "When to check in",
        body: "Talk to your pediatrician if your baby loses skills they had, shows no response to sounds or faces, uses one side of the body noticeably more, or misses several milestones in their age range. Early support works best — asking early is strength, not worry.",
      },
    ],
    related: ["tummy-time", "when-to-call-the-doctor"],
  },
  {
    slug: "parent-self-care",
    title: "Taking care of you",
    category: "Parents",
    minutes: 4,
    summary:
      "Your well-being is baby equipment. Small, repeatable acts of self-care beat grand plans.",
    sections: [
      {
        heading: "The basics are the big things",
        body: "Water, food, a shower, ten minutes outside, one honest conversation a day. When everything feels impossible, aim for one of these, not all of them.",
      },
      {
        heading: "Sleep in shifts",
        body: "If you have a partner or support person, agree on shifts so each adult gets one protected block of sleep daily. If you're solo, trade daytime help with a friend, and nap when the baby naps at least sometimes — even 20 minutes helps.",
      },
      {
        heading: "The postpartum feelings",
        body: "The 'baby blues' — tearfulness and mood swings — affect most new parents in the first two weeks. If low mood, anxiety, irritability, numbness or intrusive thoughts persist beyond that, intensify, or make daily life hard, talk to a professional now. Postpartum depression and anxiety are common, real medical conditions, and treatment works. This includes fathers and partners.",
      },
      {
        heading: "Lower the bar on purpose",
        body: "Meals can be simple, laundry can wait, visitors can bring food. Say yes to help, be specific about what you need, and drop anything that exists only for appearances. A 'good enough' parent who is present and regulated is what your baby needs.",
      },
    ],
    related: ["newborn-basics", "when-to-call-the-doctor"],
  },
  {
    slug: "colic-fussy-evenings",
    title: "Fussy evenings & colic",
    category: "Crying",
    minutes: 4,
    summary:
      "Predictable evening crying that peaks in the second month and fades by three to four months.",
    sections: [
      {
        heading: "What colic means",
        body: "The common definition: crying for more than three hours a day, more than three days a week, for more than three weeks, in an otherwise healthy, well-fed baby. It affects roughly one in five babies, peaks around six weeks, and disappears for most by three to four months.",
      },
      {
        heading: "It is not your fault",
        body: "Colic happens across cultures and caregiving styles. The cause is still debated — immature digestion, gut flora, nervous-system immaturity, overstimulation — but none of the theories blame parenting.",
      },
      {
        heading: "What may help",
        body: "Try one change at a time so you can tell what works.",
        bullets: [
          "Slower, more upright feeds with extra burping",
          "Gentle tummy massage (clockwise) or bicycling legs",
          "Rhythmic motion and white noise",
          "A warm bath",
          "Quieter, dimmer evenings with less handling",
          "Ask your provider about feeding changes if cow's-milk-protein sensitivity is suspected",
        ],
      },
      {
        heading: "Rule out the medical look-alikes",
        body: "Fever, vomiting, blood in stool, poor weight gain, drawing legs up with intense pain episodes or a sudden change in crying pattern are not 'just colic' — have those checked. And if you need to put your baby down and step away to stay calm, that is the right call.",
      },
    ],
    related: ["understanding-crying", "when-to-call-the-doctor"],
  },
  {
    slug: "when-to-call-the-doctor",
    title: "When to seek medical help",
    category: "Safety",
    minutes: 5,
    summary:
      "Not a diagnosis tool — a plain list of signs that deserve a same-day call or urgent care.",
    sections: [
      {
        heading: "Seek urgent or emergency care now",
        body: "",
        bullets: [
          "Trouble breathing: grunting, fast or labored breathing, blue lips, ribs pulling in",
          "Unresponsiveness, extreme drowsiness, or a weak, floppy cry",
          "A seizure or unusual jerking movements",
          "Fever of 38 °C (100.4 °F) or higher in a baby under 3 months — always, day or night",
          "Repeated forceful vomiting or signs of dehydration (few wet diapers, no tears, sunken eyes, dry mouth)",
          "A rash of small red-purple spots that don't fade when pressed, with fever or unusual sleepiness",
          "Any head injury with vomiting, drowsiness or behavior change",
          "Swallowed a button battery, magnet, or a foreign object — go now",
        ],
      },
      {
        heading: "Call your doctor the same day",
        body: "",
        bullets: [
          "Crying that changes suddenly and dramatically, or you can't settle your baby at all",
          "Refusing several feeds in a row, or明显 reduced wet diapers",
          "Spreading redness, swelling, warmth or discharge around the cord, a wound or the diaper area",
          "Persistent diarrhea or constipation with discomfort",
          "An ear-pulling, feverish, inconsolable baby",
          "Anything that simply feels wrong to you",
        ],
      },
      {
        heading: "A note on fever",
        body: "In babies under 3 months, fever is never dismissed as teething or a mild cold — it is evaluated promptly. After 3 months, behavior matters as much as the number: a playful baby with a modest fever differs from a limp one with the same number.",
      },
      {
        heading: "Trust yourself",
        body: "You know your baby's normal better than anyone. Parents who call 'too often' are never a problem for professionals. When in doubt, call.",
      },
    ],
    related: ["understanding-crying", "colic-fussy-evenings"],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
