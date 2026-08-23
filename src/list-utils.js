const SYMBOL_BULLETS = new Set(['*', '-', '•', '▪', '▫', '◦', '‣', '⁃']);
const ROMAN_VALUES = [
  { value: 1000, symbol: 'm' }, { value: 900, symbol: 'cm' }, { value: 500, symbol: 'd' }, { value: 400, symbol: 'cd' }, { value: 100, symbol: 'c' }, { value: 90, symbol: 'xc' }, { value: 50, symbol: 'l' }, { value: 40, symbol: 'xl' }, { value: 10, symbol: 'x' }, { value: 9, symbol: 'ix' }, { value: 5, symbol: 'v' }, { value: 4, symbol: 'iv' }, { value: 1, symbol: 'i' }
];
const LIST_ITEM_REGEX = /^([\t ]*)([\*\-•▪▫◦‣⁃]|\d+\.|[a-zA-Z]+\.)[\t ]+(.*)$/;
const ROMAN_REGEX = /^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

function parseListItem(text) {
  const match = text.match(LIST_ITEM_REGEX);
  return match ? { indent: match[1], marker: match[2], content: match[3] } : null;
}

function isNumberMarker(marker) { return /^\d+\.$/.test(marker); }
function isRomanMarker(marker) { return ROMAN_REGEX.test(marker.slice(0, -1)); }
function isLetterMarker(marker) { return /^[a-zA-Z]+\.$/.test(marker); }

function nextLetter(letter) {
  const isUpperCase = letter === letter.toUpperCase();
  const base = isUpperCase ? 65 : 97;
  let value = 0;
  for (const character of letter.toLowerCase()) value = value * 26 + character.charCodeAt(0) - 96;
  value += 1;
  let next = '';
  while (value > 0) {
    value -= 1;
    next = String.fromCharCode(base + (value % 26)) + next;
    value = Math.floor(value / 26);
  }
  return next;
}

function romanToNumber(roman) {
  let rest = roman.toLowerCase();
  let result = 0;
  for (const { value, symbol } of ROMAN_VALUES) {
    while (rest.startsWith(symbol)) { result += value; rest = rest.slice(symbol.length); }
  }
  return result;
}

function numberToRoman(number) {
  if (!Number.isInteger(number) || number < 1 || number > 3999) return null;
  let rest = number;
  let result = '';
  for (const { value, symbol } of ROMAN_VALUES) {
    while (rest >= value) { result += symbol; rest -= value; }
  }
  return result;
}

function markerKind(marker, previousMarker = null) {
  if (SYMBOL_BULLETS.has(marker)) return 'symbol';
  if (isNumberMarker(marker)) return 'number';
  if (!isLetterMarker(marker)) return null;
  const letters = marker.slice(0, -1);
  if (!isRomanMarker(marker) || (/^[cdlm]$/i.test(letters) && !previousMarker)) return 'letter';
  if (previousMarker) {
    const previousKind = markerKind(previousMarker);
    const previousLetters = previousMarker.slice(0, -1);
    if (previousKind === 'letter' && nextLetter(previousLetters).toLowerCase() === letters.toLowerCase()) return 'letter';
    if (previousKind === 'roman' && romanToNumber(letters) === romanToNumber(previousLetters) + 1) return 'roman';
  }
  return 'roman';
}

function nextMarker(marker, previousMarker = null) {
  const kind = markerKind(marker, previousMarker);
  if (kind === 'symbol') return marker === '*' ? '•' : marker;
  if (kind === 'number') return `${Number.parseInt(marker, 10) + 1}.`;
  if (kind === 'letter') return `${nextLetter(marker.slice(0, -1))}.`;
  if (kind === 'roman') {
    const next = numberToRoman(romanToNumber(marker.slice(0, -1)) + 1);
    return next ? `${marker === marker.toUpperCase() ? next.toUpperCase() : next}.` : marker;
  }
  return marker;
}

function nestedMarker(marker) {
  const kind = markerKind(marker);
  if (kind === 'number') return 'a.';
  if (kind === 'letter') return 'i.';
  if (kind === 'roman') return '1.';
  return marker;
}

function outdentedMarker(marker, previousMarker = null) { return previousMarker ? nextMarker(previousMarker) : nestedMarker(marker); }

function renumberFollowingNumberItems(items, indent, nextNumber) {
  const updates = [];
  let number = nextNumber;

  for (let offset = 0; offset < items.length; offset += 1) {
    const item = items[offset];
    if (!item || item.indent.length < indent.length) break;
    if (item.indent.length > indent.length) continue;
    if (!isNumberMarker(item.marker)) break;
    updates.push({ offset, marker: String(number) + '.' });
    number += 1;
  }

  return updates;
}

module.exports = {
  markerKind,
  nestedMarker,
  nextMarker,
  outdentedMarker,
  parseListItem,
  renumberFollowingNumberItems
};
