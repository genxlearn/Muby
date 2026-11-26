import type { IconName } from './Icon';

/* Data still carries legacy emoji keys; the UI renders them as line icons
   from the one Muby set (unslop: one icon family, no emoji). */
const MAP: Record<string, IconName> = {
  '🍼': 'bottle', '🍽️': 'bottle', '🤱': 'heart', '🤚': 'heart', '💛': 'heart', '💚': 'heart', '🤍': 'heart', '❤️': 'heart',
  '🌙': 'moon', '😴': 'moon', '🛏️': 'moon', '💧': 'diaper', '☁️': 'cloud', '🌧️': 'cloud', '🌼': 'sun', '☕': 'sun',
  '🎵': 'music', '🤫': 'music', '🌊': 'music', '👀': 'eye', '😢': 'smile', '😤': 'smile', '😰': 'smile', '🧸': 'smile',
  '🐕': 'smile', '🎲': 'smile', '🗣️': 'mic', '🚪': 'home', '📏': 'ruler', '📸': 'camera', '🎉': 'flag', '✨': 'info', '📌': 'info',
};

export function emojiIcon(e?: string | null): IconName | null {
  if (!e) return null;
  return MAP[e] ?? MAP[e.replace(/️/g, '')] ?? null;
}
