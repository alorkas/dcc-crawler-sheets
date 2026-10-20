import achievementUrl from '../assets/new_achievement.mp3';
import questUrl from '../assets/new_quest.mp3';
import messageUrl from '../assets/dcc_message.mp3';

/* Table sounds: a new achievement, a new quest and a chat message. Each browser can switch them off from the user
   menu. Browsers only play sound once the page has been clicked or typed in, so a tab nobody has touched yet stays
   quiet. */

const KEY = 'crawler-sheets.sound';

export function soundOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* private mode: stays on for this visit */
  }
}

export type SoundName = 'achievement' | 'quest' | 'message';
const URLS: Record<SoundName, string> = { achievement: achievementUrl, quest: questUrl, message: messageUrl };
/** The same sound several times in a row (the whole party gets it, a burst of messages) plays once. */
const GAP: Record<SoundName, number> = { achievement: 2500, quest: 2500, message: 800 };
const audio: Partial<Record<SoundName, HTMLAudioElement>> = {};
const last: Partial<Record<SoundName, number>> = {};

export function playSound(name: SoundName) {
  if (!soundOn()) return;
  const now = Date.now();
  if (now - (last[name] ?? 0) < GAP[name]) return;
  last[name] = now;
  try {
    const a = (audio[name] ??= new Audio(URLS[name]));
    a.volume = 0.8;
    a.currentTime = 0;
    void a.play().catch(() => {});
  } catch {
    /* no audio support */
  }
}
