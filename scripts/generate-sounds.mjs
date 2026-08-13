/**
 * Generates the app's sound effects as 16-bit mono WAV files.
 *
 * Everything is synthesised here so the repo carries no third-party audio and
 * the sounds stay easy to retune. Run it with:
 *
 *   node scripts/generate-sounds.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 44100;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds');

/** A soft sine blip: quick attack, exponential decay, short fade-out so it never clicks. */
function note({ freq, start, duration, gain, decay = 0.035 }) {
  return { freq, start, duration, gain, decay };
}

function render(notes, totalDuration) {
  const length = Math.ceil(totalDuration * SAMPLE_RATE);
  const samples = new Float64Array(length);

  for (const { freq, start, duration, gain, decay } of notes) {
    const from = Math.floor(start * SAMPLE_RATE);
    const count = Math.ceil(duration * SAMPLE_RATE);
    const attack = Math.floor(0.004 * SAMPLE_RATE);
    const release = Math.floor(0.006 * SAMPLE_RATE);

    for (let i = 0; i < count; i += 1) {
      const index = from + i;
      if (index >= length) break;

      const t = i / SAMPLE_RATE;
      let envelope = Math.exp(-t / decay);
      if (i < attack) envelope *= i / attack;
      if (i > count - release) envelope *= (count - i) / release;

      // Fundamental plus a quiet octave for a little warmth.
      const wave =
        Math.sin(2 * Math.PI * freq * t) + 0.18 * Math.sin(2 * Math.PI * freq * 2 * t);
      samples[index] += gain * envelope * wave;
    }
  }

  return samples;
}

function toWav(samples) {
  const header = Buffer.alloc(44);
  const body = Buffer.alloc(samples.length * 2);

  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const normalise = peak > 1 ? 1 / peak : 1;

  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i] * normalise));
    body.writeInt16LE(Math.round(clamped * 32767), i * 2);
  }

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + body.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(body.length, 40);

  return Buffer.concat([header, body]);
}

// A minor pentatonic-ish set, kept quiet and short. +2 answers +1 a third higher.
const A5 = 880.0;
const CS6 = 1108.73;
const A4 = 440.0;
const CS5 = 554.37;
const E5 = 659.26;

const SOUNDS = {
  // +1 XP: one soft blip.
  'xp-1.wav': { notes: [note({ freq: A5, start: 0, duration: 0.12, gain: 0.28 })], length: 0.14 },

  // +2 XP: the same blip with a small rise, so more XP feels like more.
  'xp-2.wav': {
    notes: [
      note({ freq: A5, start: 0, duration: 0.09, gain: 0.24 }),
      note({ freq: CS6, start: 0.055, duration: 0.13, gain: 0.26 }),
    ],
    length: 0.2,
  },

  // Achievement: a gentle arpeggio with a longer tail. Still calm, not fanfare.
  'unlock.wav': {
    notes: [
      note({ freq: A4, start: 0, duration: 0.2, gain: 0.2, decay: 0.09 }),
      note({ freq: CS5, start: 0.085, duration: 0.2, gain: 0.2, decay: 0.09 }),
      note({ freq: E5, start: 0.17, duration: 0.22, gain: 0.2, decay: 0.1 }),
      note({ freq: A5, start: 0.255, duration: 0.34, gain: 0.22, decay: 0.16 }),
    ],
    length: 0.62,
  },
};

mkdirSync(OUT_DIR, { recursive: true });

for (const [name, { notes, length }] of Object.entries(SOUNDS)) {
  const wav = toWav(render(notes, length));
  writeFileSync(join(OUT_DIR, name), wav);
  console.log(`${name}  ${(wav.length / 1024).toFixed(1)} KB  ${(length * 1000).toFixed(0)} ms`);
}
