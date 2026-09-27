import { menTheme } from './menTheme';
import { womenTheme } from './womenTheme';
import { childrenTheme } from './childrenTheme';
import { GenderCategory } from '../types';

export { menTheme, womenTheme, childrenTheme };

export function getTheme(gender: GenderCategory) {
  if (gender === 'women' || gender === 'womens') return womenTheme;
  if (gender === 'children') return childrenTheme;
  return menTheme;
}
