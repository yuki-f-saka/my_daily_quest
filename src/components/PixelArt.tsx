import React, { useMemo } from 'react';
import { View } from 'react-native';

export type PixelPalette = Record<string, string>;

type Props = {
  /** One string per row; each character is looked up in the palette. */
  rows: string[];
  /** Characters missing from the palette (`.` by convention) stay transparent. */
  palette: PixelPalette;
  /** Side length of one pixel, in points. */
  pixel: number;
  accessibilityLabel?: string;
};

/**
 * Draws a small sprite out of plain Views.
 *
 * Consecutive pixels of the same colour collapse into one View, which keeps a
 * screenful of sprites at a few hundred views instead of a few thousand.
 */
export function PixelArt({ rows, palette, pixel, accessibilityLabel }: Props) {
  const lines = useMemo(() => rows.map(toRuns), [rows]);
  const width = rows.reduce((widest, row) => Math.max(widest, row.length), 0) * pixel;

  return (
    <View
      accessible={accessibilityLabel !== undefined}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{ width, height: rows.length * pixel }}>
      {lines.map((runs, y) => (
        <View key={y} style={{ flexDirection: 'row', height: pixel }}>
          {runs.map((run) => (
            <View
              key={run.start}
              style={{
                width: run.length * pixel,
                height: pixel,
                backgroundColor: palette[run.char],
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type Run = { char: string; start: number; length: number };

function toRuns(row: string): Run[] {
  const runs: Run[] = [];

  for (let i = 0; i < row.length; i += 1) {
    const previous = runs[runs.length - 1];
    if (previous && previous.char === row[i]) previous.length += 1;
    else runs.push({ char: row[i], start: i, length: 1 });
  }

  return runs;
}
