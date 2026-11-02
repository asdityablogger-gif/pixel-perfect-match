/** Suggested milestones by age (in months), for quick-add in the app.
 * Wide ranges on purpose — guideposts, not deadlines. */
export interface MilestoneSuggestion {
  title: string;
  months: number; // typical age when it first appears
}

export const MILESTONE_SUGGESTIONS: MilestoneSuggestion[] = [
  { title: "First social smile", months: 2 },
  { title: "Follows a moving object with eyes", months: 2 },
  { title: "Holds head up during tummy time", months: 2 },
  { title: "First laugh", months: 4 },
  { title: "Rolled over for the first time", months: 4 },
  { title: "Grabs and holds a toy", months: 4 },
  { title: "Sits with support", months: 5 },
  { title: "First solid food", months: 6 },
  { title: "Sits without support", months: 6 },
  { title: "Babbles (ba-ba, da-da)", months: 6 },
  { title: "Rolled from back to tummy", months: 6 },
  { title: "First tooth", months: 7 },
  { title: "Sits alone steadily", months: 8 },
  { title: "Started crawling", months: 9 },
  { title: "Responds to their name", months: 9 },
  { title: "Pincer grasp (thumb + finger)", months: 10 },
  { title: "Pulled up to standing", months: 10 },
  { title: "First word with meaning", months: 12 },
  { title: "First steps", months: 12 },
  { title: "Waves bye-bye", months: 12 },
];
