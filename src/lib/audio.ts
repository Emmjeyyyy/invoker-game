import { Howl, Howler } from 'howler';
export { Howler };

// Base64 silent audio for placeholders
const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

const sounds = {
  q: new Howl({ src: [silentWav], volume: 0.5 }),
  w: new Howl({ src: [silentWav], volume: 0.5 }),
  e: new Howl({ src: [silentWav], volume: 0.5 }),
  invoke: new Howl({ src: ['/asset/sfx/Invoke.mp3.mpeg'], volume: 0.8 }),
  success: new Howl({ src: [silentWav], volume: 0.6 }),
  error: new Howl({ src: [silentWav], volume: 0.6 }),
};

export const playSound = (name: keyof typeof sounds) => {
  sounds[name].play();
};
