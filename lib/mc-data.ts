import type React from 'react'

export type ArmorPiece = 'helmet' | 'chestplate' | 'leggings' | 'boots'
export type ToolKind = 'sword' | 'spear' | 'axe' | 'pickaxe' | 'shovel' | 'hoe'
export type SpecialKind = 'bow' | 'crossbow' | 'mace' | 'trident'
export type GearKind = ToolKind | SpecialKind
export type ItemKey = ArmorPiece | GearKind

export const ARMOR_PIECES: ArmorPiece[] = ['helmet', 'chestplate', 'leggings', 'boots']
export const TIERED_GEAR: ToolKind[] = ['sword', 'spear', 'axe', 'pickaxe', 'shovel', 'hoe']
export const GEAR: GearKind[] = [
  'sword',
  'spear',
  'axe',
  'pickaxe',
  'shovel',
  'hoe',
  'bow',
  'crossbow',
  'mace',
  'trident',
]
export const EQUIPMENT_ORDER: ItemKey[] = [...ARMOR_PIECES, ...GEAR]

export type ToolMaterial = 'wooden' | 'stone' | 'iron' | 'golden' | 'diamond' | 'netherite'
export const TOOL_MATERIALS: { id: ToolMaterial; label: string; swatch: string }[] = [
  { id: 'wooden', label: 'Wood', swatch: '#9C7A47' },
  { id: 'stone', label: 'Stone', swatch: '#8A8A8A' },
  { id: 'iron', label: 'Iron', swatch: '#D8D8D8' },
  { id: 'golden', label: 'Gold', swatch: '#F7D23F' },
  { id: 'diamond', label: 'Diamond', swatch: '#4AEDD9' },
  { id: 'netherite', label: 'Netherite', swatch: '#5A4F50' },
]

export type ArmorMaterial = 'leather' | 'golden' | 'iron' | 'diamond' | 'netherite'
export const ARMOR_MATERIALS: {
  id: ArmorMaterial
  label: string
  base: string
  dark: string
  light: string
}[] = [
  { id: 'leather', label: 'Leather', base: '#A06540', dark: '#6E4229', light: '#C48659' },
  { id: 'golden', label: 'Gold', base: '#EAC53A', dark: '#B48A1C', light: '#FFF07A' },
  { id: 'iron', label: 'Iron', base: '#D6D6D6', dark: '#9A9A9A', light: '#FFFFFF' },
  { id: 'diamond', label: 'Diamond', base: '#3FD9C8', dark: '#1E9E8C', light: '#A8FFF4' },
  { id: 'netherite', label: 'Netherite', base: '#4A4042', dark: '#2B2324', light: '#6E6264' },
]

const LEATHER_NAMES: Record<ArmorPiece, string> = {
  helmet: 'Cap',
  chestplate: 'Tunic',
  leggings: 'Pants',
  boots: 'Boots',
}

const ITEM_LABEL: Record<ItemKey, string> = {
  helmet: 'Helmet',
  chestplate: 'Chestplate',
  leggings: 'Leggings',
  boots: 'Boots',
  sword: 'Sword',
  spear: 'Spear',
  axe: 'Axe',
  pickaxe: 'Pickaxe',
  shovel: 'Shovel',
  hoe: 'Hoe',
  bow: 'Bow',
  crossbow: 'Crossbow',
  mace: 'Mace',
  trident: 'Trident',
}

export function isTiered(item: ItemKey): item is ToolKind {
  return (TIERED_GEAR as string[]).includes(item)
}
export function isArmor(item: ItemKey): item is ArmorPiece {
  return (ARMOR_PIECES as string[]).includes(item)
}

export function itemSprite(
  item: ItemKey,
  toolMat: ToolMaterial = 'diamond',
  armorMat: ArmorMaterial = 'diamond',
) {
  if (isArmor(item)) return `/sprites/${armorMat}_${item}.png`
  if (isTiered(item)) return `/sprites/${toolMat}_${item}.png`
  return `/sprites/${item}.png`
}

const MAT_WORD: Record<string, string> = {
  wooden: 'Wooden',
  stone: 'Stone',
  iron: 'Iron',
  golden: 'Golden',
  diamond: 'Diamond',
  netherite: 'Netherite',
  leather: 'Leather',
}

export function itemName(
  item: ItemKey,
  toolMat: ToolMaterial = 'diamond',
  armorMat: ArmorMaterial = 'diamond',
) {
  if (isArmor(item)) {
    if (armorMat === 'leather') return `Leather ${LEATHER_NAMES[item]}`
    return `${MAT_WORD[armorMat]} ${ITEM_LABEL[item]}`
  }
  if (isTiered(item)) return `${MAT_WORD[toolMat]} ${ITEM_LABEL[item]}`
  return ITEM_LABEL[item]
}

export const itemLabel = (item: ItemKey) => ITEM_LABEL[item]

export type Category = 'armor' | 'melee' | 'tools' | 'ranged' | 'special'

export interface Enchantment {
  id: string
  name: string
  max: number
  description: string
  items: ItemKey[]
  conflicts: string[]
  category: Category
  curse?: boolean
  treasure?: boolean
}

const ALL_ARMOR: ItemKey[] = ['helmet', 'chestplate', 'leggings', 'boots']
const DIGGERS: ItemKey[] = ['pickaxe', 'shovel', 'axe', 'hoe']
const EVERYTHING: ItemKey[] = [...EQUIPMENT_ORDER]

export const ENCHANTMENTS: Enchantment[] = [
  // Armor
  {
    id: 'protection',
    name: 'Protection',
    max: 4,
    description: 'Reduces most types of incoming damage.',
    items: ALL_ARMOR,
    conflicts: ['fire_protection', 'blast_protection', 'projectile_protection'],
    category: 'armor',
  },
  {
    id: 'fire_protection',
    name: 'Fire Protection',
    max: 4,
    description: 'Reduces fire damage and shortens burn time.',
    items: ALL_ARMOR,
    conflicts: ['protection', 'blast_protection', 'projectile_protection'],
    category: 'armor',
  },
  {
    id: 'blast_protection',
    name: 'Blast Protection',
    max: 4,
    description: 'Reduces explosion damage and knockback.',
    items: ALL_ARMOR,
    conflicts: ['protection', 'fire_protection', 'projectile_protection'],
    category: 'armor',
  },
  {
    id: 'projectile_protection',
    name: 'Projectile Protection',
    max: 4,
    description: 'Reduces damage from arrows, tridents and fireballs.',
    items: ALL_ARMOR,
    conflicts: ['protection', 'fire_protection', 'blast_protection'],
    category: 'armor',
  },
  {
    id: 'thorns',
    name: 'Thorns',
    max: 3,
    description: 'Reflects part of the damage back at attackers.',
    items: ALL_ARMOR,
    conflicts: [],
    category: 'armor',
  },
  {
    id: 'respiration',
    name: 'Respiration',
    max: 3,
    description: 'Extends underwater breathing time.',
    items: ['helmet'],
    conflicts: [],
    category: 'armor',
  },
  {
    id: 'aqua_affinity',
    name: 'Aqua Affinity',
    max: 1,
    description: 'Mine at normal speed while underwater.',
    items: ['helmet'],
    conflicts: [],
    category: 'armor',
  },
  {
    id: 'swift_sneak',
    name: 'Swift Sneak',
    max: 3,
    description: 'Move faster while sneaking.',
    items: ['leggings'],
    conflicts: [],
    category: 'armor',
    treasure: true,
  },
  {
    id: 'feather_falling',
    name: 'Feather Falling',
    max: 4,
    description: 'Reduces fall damage.',
    items: ['boots'],
    conflicts: [],
    category: 'armor',
  },
  {
    id: 'depth_strider',
    name: 'Depth Strider',
    max: 3,
    description: 'Increases underwater movement speed.',
    items: ['boots'],
    conflicts: ['frost_walker'],
    category: 'armor',
  },
  {
    id: 'frost_walker',
    name: 'Frost Walker',
    max: 2,
    description: 'Turns water beneath you into frosted ice.',
    items: ['boots'],
    conflicts: ['depth_strider'],
    category: 'armor',
    treasure: true,
  },
  {
    id: 'soul_speed',
    name: 'Soul Speed',
    max: 3,
    description: 'Run faster on soul sand and soul soil.',
    items: ['boots'],
    conflicts: [],
    category: 'armor',
    treasure: true,
  },
  // Melee
  {
    id: 'sharpness',
    name: 'Sharpness',
    max: 5,
    description: 'Increases melee damage against all mobs.',
    items: ['sword', 'spear', 'axe'],
    conflicts: ['smite', 'bane_of_arthropods'],
    category: 'melee',
  },
  {
    id: 'smite',
    name: 'Smite',
    max: 5,
    description: 'Extra damage to undead mobs like zombies and skeletons.',
    items: ['sword', 'spear', 'axe', 'mace'],
    conflicts: ['sharpness', 'bane_of_arthropods', 'density', 'breach'],
    category: 'melee',
  },
  {
    id: 'bane_of_arthropods',
    name: 'Bane of Arthropods',
    max: 5,
    description: 'Extra damage and slowness to spiders, bees and silverfish.',
    items: ['sword', 'spear', 'axe', 'mace'],
    conflicts: ['sharpness', 'smite', 'density', 'breach'],
    category: 'melee',
  },
  {
    id: 'knockback',
    name: 'Knockback',
    max: 2,
    description: 'Pushes targets further away on hit.',
    items: ['sword', 'spear'],
    conflicts: [],
    category: 'melee',
  },
  {
    id: 'fire_aspect',
    name: 'Fire Aspect',
    max: 2,
    description: 'Sets the target on fire.',
    items: ['sword', 'spear', 'mace'],
    conflicts: [],
    category: 'melee',
  },
  {
    id: 'looting',
    name: 'Looting',
    max: 3,
    description: 'Mobs drop more loot.',
    items: ['sword', 'spear'],
    conflicts: [],
    category: 'melee',
  },
  {
    id: 'sweeping_edge',
    name: 'Sweeping Edge',
    max: 3,
    description: 'Increases sweeping attack damage.',
    items: ['sword'],
    conflicts: [],
    category: 'melee',
  },
  {
    id: 'lunge',
    name: 'Lunge',
    max: 3,
    description: 'Jab attacks propel you forward.',
    items: ['spear'],
    conflicts: [],
    category: 'melee',
  },
  // Tools
  {
    id: 'efficiency',
    name: 'Efficiency',
    max: 5,
    description: 'Increases mining speed.',
    items: DIGGERS,
    conflicts: [],
    category: 'tools',
  },
  {
    id: 'silk_touch',
    name: 'Silk Touch',
    max: 1,
    description: 'Mined blocks drop themselves.',
    items: DIGGERS,
    conflicts: ['fortune'],
    category: 'tools',
  },
  {
    id: 'fortune',
    name: 'Fortune',
    max: 3,
    description: 'Increases drops from ores and crops.',
    items: DIGGERS,
    conflicts: ['silk_touch'],
    category: 'tools',
  },
  // Ranged
  {
    id: 'power',
    name: 'Power',
    max: 5,
    description: 'Increases arrow damage.',
    items: ['bow'],
    conflicts: [],
    category: 'ranged',
  },
  {
    id: 'punch',
    name: 'Punch',
    max: 2,
    description: 'Increases arrow knockback.',
    items: ['bow'],
    conflicts: [],
    category: 'ranged',
  },
  {
    id: 'flame',
    name: 'Flame',
    max: 1,
    description: 'Arrows set targets on fire.',
    items: ['bow'],
    conflicts: [],
    category: 'ranged',
  },
  {
    id: 'infinity',
    name: 'Infinity',
    max: 1,
    description: 'Shooting consumes no regular arrows.',
    items: ['bow'],
    conflicts: ['mending'],
    category: 'ranged',
  },
  {
    id: 'multishot',
    name: 'Multishot',
    max: 1,
    description: 'Fires three arrows for the cost of one.',
    items: ['crossbow'],
    conflicts: ['piercing'],
    category: 'ranged',
  },
  {
    id: 'piercing',
    name: 'Piercing',
    max: 4,
    description: 'Arrows pass through multiple entities.',
    items: ['crossbow'],
    conflicts: ['multishot'],
    category: 'ranged',
  },
  {
    id: 'quick_charge',
    name: 'Quick Charge',
    max: 3,
    description: 'Reduces crossbow reload time.',
    items: ['crossbow'],
    conflicts: [],
    category: 'ranged',
  },
  // Special
  {
    id: 'loyalty',
    name: 'Loyalty',
    max: 3,
    description: 'Thrown trident returns to you.',
    items: ['trident'],
    conflicts: ['riptide'],
    category: 'special',
  },
  {
    id: 'riptide',
    name: 'Riptide',
    max: 3,
    description: 'Launches you with the trident in water or rain.',
    items: ['trident'],
    conflicts: ['loyalty', 'channeling'],
    category: 'special',
  },
  {
    id: 'channeling',
    name: 'Channeling',
    max: 1,
    description: 'Summons lightning on targets during storms.',
    items: ['trident'],
    conflicts: ['riptide'],
    category: 'special',
  },
  {
    id: 'impaling',
    name: 'Impaling',
    max: 5,
    description: 'Extra damage to mobs in water or rain.',
    items: ['trident'],
    conflicts: [],
    category: 'special',
  },
  {
    id: 'density',
    name: 'Density',
    max: 5,
    description: 'Smash attacks deal more damage per block fallen.',
    items: ['mace'],
    conflicts: ['breach', 'smite', 'bane_of_arthropods'],
    category: 'special',
  },
  {
    id: 'breach',
    name: 'Breach',
    max: 4,
    description: 'Hits ignore a portion of the target’s armor.',
    items: ['mace'],
    conflicts: ['density', 'smite', 'bane_of_arthropods'],
    category: 'special',
  },
  {
    id: 'wind_burst',
    name: 'Wind Burst',
    max: 3,
    description: 'Smash attacks launch you back into the air.',
    items: ['mace'],
    conflicts: [],
    category: 'special',
    treasure: true,
  },
  // Universal
  {
    id: 'unbreaking',
    name: 'Unbreaking',
    max: 3,
    description: 'Gives a chance to avoid durability loss.',
    items: EVERYTHING,
    conflicts: [],
    category: 'tools',
  },
  {
    id: 'mending',
    name: 'Mending',
    max: 1,
    description: 'Repairs the item using experience orbs.',
    items: EVERYTHING,
    conflicts: ['infinity'],
    category: 'tools',
    treasure: true,
  },
  {
    id: 'curse_of_binding',
    name: 'Curse of Binding',
    max: 1,
    description: 'Cursed armor cannot be removed once worn.',
    items: ALL_ARMOR,
    conflicts: [],
    category: 'armor',
    curse: true,
    treasure: true,
  },
  {
    id: 'curse_of_vanishing',
    name: 'Curse of Vanishing',
    max: 1,
    description: 'The item disappears when you die.',
    items: EVERYTHING,
    conflicts: [],
    category: 'tools',
    curse: true,
    treasure: true,
  },
]

export const ENCHANT_BY_ID = Object.fromEntries(ENCHANTMENTS.map((e) => [e.id, e]))

export const CONFLICT_GROUPS: { title: string; ids: string[] }[] = [
  { title: 'Mending vs. Infinity', ids: ['mending', 'infinity'] },
  { title: 'Silk Touch vs. Fortune', ids: ['silk_touch', 'fortune'] },
  { title: 'Multishot vs. Piercing', ids: ['multishot', 'piercing'] },
  { title: 'Damage Type', ids: ['sharpness', 'smite', 'bane_of_arthropods'] },
  { title: 'Protection Type', ids: ['protection', 'fire_protection', 'blast_protection', 'projectile_protection'] },
  { title: 'Loyalty vs. Riptide', ids: ['loyalty', 'riptide', 'channeling'] },
  { title: 'Depth Strider vs. Frost Walker', ids: ['depth_strider', 'frost_walker'] },
  { title: 'Density vs. Breach', ids: ['density', 'breach'] },
]

const NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V']
export const roman = (n: number) => NUMERALS[n] ?? String(n)

export const TRIM_PATTERNS = [
  'sentry',
  'dune',
  'coast',
  'wild',
  'ward',
  'eye',
  'vex',
  'tide',
  'snout',
  'rib',
  'spire',
  'wayfinder',
  'shaper',
  'silence',
  'raiser',
  'host',
  'flow',
  'bolt',
] as const
export type TrimPattern = (typeof TRIM_PATTERNS)[number]

export const TRIM_MATERIALS: { id: string; label: string; color: string; sprite: string }[] = [
  { id: 'amethyst', label: 'Amethyst', color: '#9A5CC6', sprite: '/sprites/mat_amethyst_shard.png' },
  { id: 'diamond', label: 'Diamond', color: '#6EECD2', sprite: '/sprites/mat_diamond.png' },
  { id: 'emerald', label: 'Emerald', color: '#11A036', sprite: '/sprites/mat_emerald.png' },
  { id: 'gold', label: 'Gold', color: '#DEB12D', sprite: '/sprites/mat_gold_ingot.png' },
  { id: 'iron', label: 'Iron', color: '#CECACA', sprite: '/sprites/mat_iron_ingot.png' },
  { id: 'copper', label: 'Copper', color: '#B4684D', sprite: '/sprites/mat_copper_ingot.png' },
  { id: 'lapis', label: 'Lapis', color: '#416E97', sprite: '/sprites/mat_lapis_lazuli.png' },
  { id: 'redstone', label: 'Redstone', color: '#BD2008', sprite: '/sprites/mat_redstone_dust.png' },
  { id: 'quartz', label: 'Quartz', color: '#E3D4C4', sprite: '/sprites/mat_nether_quartz.png' },
  { id: 'netherite', label: 'Netherite', color: '#625859', sprite: '/sprites/mat_netherite_ingot.png' },
  { id: 'resin', label: 'Resin', color: '#FC7812', sprite: '/sprites/mat_resin_brick.png' },
]

export const DYES: { id: string; label: string; color: string }[] = [
  { id: 'white', label: 'White', color: '#F9FFFE' },
  { id: 'light_gray', label: 'Light Gray', color: '#9D9D97' },
  { id: 'gray', label: 'Gray', color: '#474F52' },
  { id: 'black', label: 'Black', color: '#1D1D21' },
  { id: 'brown', label: 'Brown', color: '#835432' },
  { id: 'red', label: 'Red', color: '#B02E26' },
  { id: 'orange', label: 'Orange', color: '#F9801D' },
  { id: 'yellow', label: 'Yellow', color: '#FED83D' },
  { id: 'lime', label: 'Lime', color: '#80C71F' },
  { id: 'green', label: 'Green', color: '#5E7C16' },
  { id: 'cyan', label: 'Cyan', color: '#169C9C' },
  { id: 'light_blue', label: 'Light Blue', color: '#3AB3DA' },
  { id: 'blue', label: 'Blue', color: '#3C44AA' },
  { id: 'purple', label: 'Purple', color: '#8932B8' },
  { id: 'magenta', label: 'Magenta', color: '#C74EBD' },
  { id: 'pink', label: 'Pink', color: '#F38BAA' },
]

export function trimPatternStyle(pattern: TrimPattern | null, c: string): React.CSSProperties {
  const t = 'transparent'
  switch (pattern) {
    case null:
      return {}
    case 'sentry':
      return { backgroundImage: `linear-gradient(to bottom, ${c} 0 14%, ${t} 14% 86%, ${c} 86%)` }
    case 'dune':
      return { backgroundImage: `repeating-linear-gradient(45deg, ${c} 0 3px, ${t} 3px 12px)` }
    case 'coast':
      return {
        backgroundImage: `radial-gradient(circle at 50% 100%, ${t} 0 40%, ${c} 41% 52%, ${t} 53%)`,
        backgroundSize: '16px 10px',
      }
    case 'wild':
      return { backgroundImage: `radial-gradient(${c} 0 28%, ${t} 30%)`, backgroundSize: '10px 10px' }
    case 'ward':
      return {
        backgroundImage: `linear-gradient(to right, ${c} 0 12%, ${t} 12% 88%, ${c} 88%), linear-gradient(to bottom, ${c} 0 10%, ${t} 10% 90%, ${c} 90%)`,
      }
    case 'eye':
      return {
        backgroundImage: `radial-gradient(ellipse 30% 18% at 50% 40%, ${c} 0 60%, ${t} 62%)`,
      }
    case 'vex':
      return {
        backgroundImage: `linear-gradient(135deg, ${c} 25%, ${t} 25%), linear-gradient(225deg, ${c} 25%, ${t} 25%)`,
        backgroundSize: '12px 12px',
        backgroundPosition: '0 0, 0 0',
      }
    case 'tide':
      return { backgroundImage: `repeating-linear-gradient(90deg, ${t} 0 8px, ${c} 8px 11px)` }
    case 'snout':
      return {
        backgroundImage: `conic-gradient(${c} 25%, ${t} 0 50%, ${c} 0 75%, ${t} 0)`,
        backgroundSize: '14px 14px',
      }
    case 'rib':
      return { backgroundImage: `repeating-linear-gradient(0deg, ${t} 0 6px, ${c} 6px 9px)` }
    case 'spire':
      return { backgroundImage: `linear-gradient(to right, ${t} 40%, ${c} 40% 60%, ${t} 60%)` }
    case 'wayfinder':
      return {
        backgroundImage: `linear-gradient(to right, ${t} 44%, ${c} 44% 56%, ${t} 56%), linear-gradient(to bottom, ${t} 44%, ${c} 44% 56%, ${t} 56%)`,
      }
    case 'shaper':
      return {
        backgroundImage: `linear-gradient(${c}, ${c}), linear-gradient(${c}, ${c}), linear-gradient(${c}, ${c}), linear-gradient(${c}, ${c})`,
        backgroundSize: '24% 24%',
        backgroundPosition: '0 0, 100% 0, 0 100%, 100% 100%',
        backgroundRepeat: 'no-repeat',
      }
    case 'silence':
      return {
        backgroundImage: `radial-gradient(circle at 50% 50%, ${c} 0 12%, ${t} 13%), linear-gradient(to bottom, ${t} 0 82%, ${c} 82% 90%, ${t} 90%)`,
      }
    case 'raiser':
      return {
        backgroundImage: `repeating-linear-gradient(90deg, ${c} 0 3px, ${t} 3px 8px)`,
        backgroundSize: '100% 45%',
        backgroundPosition: '0 100%',
        backgroundRepeat: 'no-repeat',
      }
    case 'host':
      return {
        backgroundImage: `linear-gradient(45deg, ${t} 45%, ${c} 45% 55%, ${t} 55%), linear-gradient(-45deg, ${t} 45%, ${c} 45% 55%, ${t} 55%)`,
      }
    case 'flow':
      return { backgroundImage: `repeating-radial-gradient(circle at 30% 30%, ${c} 0 2px, ${t} 2px 8px)` }
    case 'bolt':
      return {
        backgroundImage: `linear-gradient(135deg, ${c} 25%, ${t} 25%), linear-gradient(225deg, ${c} 25%, ${t} 25%), linear-gradient(315deg, ${c} 25%, ${t} 25%), linear-gradient(45deg, ${c} 25%, ${t} 25%)`,
        backgroundPosition: '-6px 0, -6px 0, 0 0, 0 0',
        backgroundSize: '12px 12px',
      }
  }
}

export const trimLabel = (p: TrimPattern) => p.charAt(0).toUpperCase() + p.slice(1)
