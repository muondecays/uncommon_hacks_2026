export const ILLNESSES = [
  "Major Depressive Disorder",
  "Generalized Anxiety Disorder",
  "Obsessive-Compulsive Disorder",
  "Post-Traumatic Stress Disorder",
  "Bipolar Disorder",
  "Schizophrenia",
  "Social Anxiety Disorder",
  "Panic Disorder",
  "Attention Deficit Hyperactivity Disorder",
  "Borderline Personality Disorder",
  "Anorexia Nervosa",
  "Bulimia Nervosa",
  "Agoraphobia",
  "Dissociative Identity Disorder",
  "Health Anxiety",
  "Narcissistic Personality Disorder",
  "Insomnia Disorder",
  "Specific Phobia",
];

export function pickRandom(): string {
  return ILLNESSES[Math.floor(Math.random() * ILLNESSES.length)];
}

const STOP_WORDS = new Set([
  "disorder", "syndrome", "condition", "disease", "major",
  "generalized", "specific", "post", "traumatic",
]);

export function checkGuess(guess: string, illness: string): boolean {
  const g = guess.toLowerCase().trim();
  const i = illness.toLowerCase();

  if (!g) return false;
  if (i.includes(g) || g.includes(i)) return true;

  const keywords = i.split(/\W+/).filter(
    (w) => w.length > 3 && !STOP_WORDS.has(w)
  );
  const matchCount = keywords.filter((w) => g.includes(w)).length;
  return keywords.length > 0 && matchCount >= Math.ceil(keywords.length / 2);
}
