type Colors =
  | 'pink'
  | 'purple'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'lightGrey'
  | 'mediumGrey'
  | 'grey'
  | 'black';

export const colors: Record<Colors, string> = {
  purple: 'rgb(221,217,255)',
  pink: 'rgb(255,217,251)',
  blue: 'rgb(217,242,255)',
  yellow: 'rgb(248,255,192)',
  green: 'rgb(217,255,221)',
  grey: 'rgb(128, 128, 128)',
  lightGrey: 'rgb(248,248,248)',
  mediumGrey: 'rgb(240,240,240)',
  black: '#000',
};

export const colorsStrings = Object.values(colors);
