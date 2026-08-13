/** Metro resolves .wav files to asset module ids. */
declare module '*.wav' {
  const asset: number;
  export default asset;
}
