export type Orb = 'Q' | 'W' | 'E';

export type SpellName =
  | 'Cold Snap'
  | 'Ghost Walk'
  | 'Ice Wall'
  | 'EMP'
  | 'Tornado'
  | 'Alacrity'
  | 'Sun Strike'
  | 'Forge Spirit'
  | 'Chaos Meteor'
  | 'Deafening Blast';

export interface Spell {
  name: SpellName;
  combination: Orb[];
  // Simplified matching: QQQ, QQW, etc., irrespective of order. We can use a sorted string.
  id: string; 
  iconPath: string; // Placeholder for now
  color: string; // Hex color representing the spell's visual theme
}

// Helper to sort orbs to make matching order-independent
export const getCombinationId = (orbs: Orb[]): string => {
  return [...orbs].sort().join('');
};

export const SPELLS: Spell[] = [
  { name: 'Cold Snap', combination: ['Q', 'Q', 'Q'], id: getCombinationId(['Q', 'Q', 'Q']), iconPath: '/asset/icons/invoke skills/default skills/Cold_Snap_icon.png?v=1', color: '#1e90ff' },
  { name: 'Ghost Walk', combination: ['Q', 'Q', 'W'], id: getCombinationId(['Q', 'Q', 'W']), iconPath: '/asset/icons/invoke skills/default skills/Ghost_Walk_icon.png', color: '#e0ffff' },
  { name: 'Ice Wall', combination: ['Q', 'Q', 'E'], id: getCombinationId(['Q', 'Q', 'E']), iconPath: '/asset/icons/invoke skills/default skills/Ice_Wall_icon.png', color: '#00bfff' },
  { name: 'EMP', combination: ['W', 'W', 'W'], id: getCombinationId(['W', 'W', 'W']), iconPath: '/asset/icons/invoke skills/default skills/E.M.P._icon.png', color: '#ba55d3' },
  { name: 'Tornado', combination: ['W', 'W', 'Q'], id: getCombinationId(['W', 'W', 'Q']), iconPath: '/asset/icons/invoke skills/default skills/Tornado_icon.png', color: '#d3d3d3' },
  { name: 'Alacrity', combination: ['W', 'W', 'E'], id: getCombinationId(['W', 'W', 'E']), iconPath: '/asset/icons/invoke skills/default skills/Alacrity_icon.png', color: '#dda0dd' },
  { name: 'Sun Strike', combination: ['E', 'E', 'E'], id: getCombinationId(['E', 'E', 'E']), iconPath: '/asset/icons/invoke skills/default skills/Sun_Strike_icon.png', color: '#ffcc00' },
  { name: 'Forge Spirit', combination: ['E', 'E', 'Q'], id: getCombinationId(['E', 'E', 'Q']), iconPath: '/asset/icons/invoke skills/default skills/Forge_Spirit_icon.png', color: '#ffb800' },
  { name: 'Chaos Meteor', combination: ['E', 'E', 'W'], id: getCombinationId(['E', 'E', 'W']), iconPath: '/asset/icons/invoke skills/default skills/Chaos_Meteor_icon.png', color: '#ff6347' },
  { name: 'Deafening Blast', combination: ['Q', 'W', 'E'], id: getCombinationId(['Q', 'W', 'E']), iconPath: '/asset/icons/invoke skills/default skills/Deafening_Blast_icon.png', color: '#ffa500' },
];

export const getRandomSpell = (exclude?: SpellName): Spell => {
  let spell;
  do {
    spell = SPELLS[Math.floor(Math.random() * SPELLS.length)];
  } while (spell.name === exclude);
  return spell;
};
