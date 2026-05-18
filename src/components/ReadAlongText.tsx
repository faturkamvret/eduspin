'use client';

import type { CSSProperties } from 'react';

/**
 * Render a paragraph as a sequence of word spans, with the currently-spoken
 * word highlighted. Used by the story narration screen so kids can follow
 * along while TTS reads aloud.
 *
 * Word boundary detection lives in the parent (it owns the SpeechSynthesis
 * onboundary event). This component only renders highlight state.
 *
 * Stability: every word is rendered as a STABLE plain <span> (no
 * mount/unmount, no AnimatePresence). Highlight is applied via inline style
 * using CSS transition + box-shadow (not padding) so the text never reflows
 * when the active word changes — the surrounding words stay perfectly still.
 */
interface Props {
  /**
   * Full paragraph text. Will be split into words on whitespace; punctuation
   * stays attached to the adjacent word ("Halo!" → "Halo!").
   */
  text: string;
  /**
   * Character offset of this paragraph from the START of the joined narration
   * (paragraphs joined by " "). This lets the parent pass a single global
   * charIndex from the TTS event and have each paragraph compute its own
   * "is the active word inside me?" check.
   */
  paragraphCharOffset: number;
  /**
   * Active char index within the JOINED narration (i.e. across all paragraphs).
   * Pass null when not speaking.
   */
  activeCharIndex: number | null;
  /** Tailwind classes for the paragraph wrapper. */
  className?: string;
}

interface Word {
  text: string;
  startChar: number; // offset within the paragraph
  endChar: number;
}

/**
 * Split a paragraph into words while preserving exact char offsets.
 * "Halo, dunia." → [{text:"Halo,", startChar:0, endChar:5}, ...]
 */
function splitWordsWithOffsets(text: string): Word[] {
  const words: Word[] = [];
  // Match runs of non-whitespace. \S+ keeps punctuation attached to words.
  const regex = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    words.push({
      text: m[0],
      startChar: m.index,
      endChar: m.index + m[0].length,
    });
  }
  return words;
}

// Use box-shadow (not padding) for the highlight halo so glyph metrics never
// change between active/inactive states. This keeps the rest of the line
// completely stationary while the highlight slides from word to word.
const ACTIVE_STYLE: CSSProperties = {
  backgroundColor: '#fef08a', // yellow-200
  borderRadius: '6px',
  boxShadow: '0 0 0 4px #fef08a',
  transition: 'background-color 200ms ease, box-shadow 200ms ease, color 200ms ease',
};
const INACTIVE_STYLE: CSSProperties = {
  backgroundColor: 'transparent',
  borderRadius: '6px',
  boxShadow: '0 0 0 0 rgba(254,240,138,0)',
  transition: 'background-color 200ms ease, box-shadow 200ms ease, color 200ms ease',
};

export function ReadAlongText({
  text,
  paragraphCharOffset,
  activeCharIndex,
  className = '',
}: Props) {
  const words = splitWordsWithOffsets(text);

  // Translate the global activeCharIndex into a paragraph-local offset.
  const localActive =
    activeCharIndex == null ? null : activeCharIndex - paragraphCharOffset;

  // Find which word contains the active char. Word is "active" if
  // localActive >= startChar AND localActive < endChar (the engine reports
  // the START of each word, so this works for typical implementations).
  // We're lenient: if activeChar falls in the whitespace BEFORE a word, we
  // still light up the next word for smoother visual flow.
  let activeIdx = -1;
  if (localActive != null && localActive >= 0 && localActive < text.length + 1) {
    // Find first word whose startChar > localActive, then go back one.
    // Simpler: pick word where startChar <= localActive < (next.startChar OR end).
    for (let i = 0; i < words.length; i++) {
      const w = words[i]!;
      const next = words[i + 1];
      const upperBound = next ? next.startChar : text.length + 1;
      if (localActive >= w.startChar && localActive < upperBound) {
        activeIdx = i;
        break;
      }
    }
  }

  return (
    <p className={className}>
      {words.map((w, i) => {
        const isActive = i === activeIdx;
        return (
          <span
            key={`${w.startChar}-${w.text}`}
            style={isActive ? ACTIVE_STYLE : INACTIVE_STYLE}
            className={isActive ? 'text-amber-900' : ''}
          >
            {w.text}
            {/* Trailing space lives outside the highlighted span so the
                halo box doesn't include the gap between words. */}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </p>
  );
}
