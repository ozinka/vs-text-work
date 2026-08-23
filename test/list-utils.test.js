const test = require('node:test');
const assert = require('node:assert/strict');
const {
  markerKind,
  nestedMarker,
  nextMarker,
  outdentedMarker,
  parseListItem,
  renumberFollowingNumberItems
} = require('../src/list-utils');

test('parses list indentation, marker and content', () => {
  assert.deepEqual(parseListItem('  12. Example'), { indent: '  ', marker: '12.', content: 'Example' });
  assert.equal(parseListItem('Not a list'), null);
});
test('continues all supported ordered list types', () => {
  assert.equal(nextMarker('12.'), '13.');
  assert.equal(nextMarker('*'), '•');
  assert.equal(nextMarker('z.'), 'aa.');
  assert.equal(nextMarker('AZ.'), 'BA.');
  assert.equal(nextMarker('iv.'), 'v.');
  assert.equal(nextMarker('IX.'), 'X.');
});
test('uses neighboring items to distinguish letter and Roman sequences', () => {
  assert.equal(markerKind('c.', 'b.'), 'letter');
  assert.equal(markerKind('ii.', 'i.'), 'roman');
  assert.equal(nextMarker('c.', 'b.'), 'd.');
});
test('cycles marker types during indent and outdent', () => {
  assert.equal(nestedMarker('1.'), 'a.');
  assert.equal(nestedMarker('a.'), 'i.');
  assert.equal(nestedMarker('i.'), '1.');
  assert.equal(outdentedMarker('a.', '3.'), '4.');
});

test('renumbers subsequent numeric siblings while skipping nested items', () => {
  const items = [
    parseListItem('2. Existing second item'),
    parseListItem('    1. Nested item'),
    parseListItem('3. Existing third item'),
    null
  ];
  assert.deepEqual(renumberFollowingNumberItems(items, '', 3), [
    { offset: 0, marker: '3.' },
    { offset: 2, marker: '4.' }
  ]);
});
