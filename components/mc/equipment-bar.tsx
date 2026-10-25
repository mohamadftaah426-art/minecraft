'use client'

import { cn } from '@/lib/utils'
import {
  type ArmorMaterial,
  type GearKind,
  type ItemKey,
  type ToolMaterial,
  EQUIPMENT_ORDER,
  isArmor,
  itemName,
  itemSprite,
} from '@/lib/mc-data'
import { Sprite } from './primitives'

const TABS = [
  { href: '#library', label: 'Enchantment Library', icon: '/sprites/enchanted_book.png', glint: true },
  { href: '#showcase', label: 'Weapons & Tools', icon: '/sprites/diamond_sword.png', glint: false },
  { href: '#armor', label: 'Armor Stand', icon: '/sprites/armor_stand.png', glint: false },
]

interface EquipmentBarProps {
  toolMat: ToolMaterial
  armorMat: ArmorMaterial
  selected: GearKind
  enchanted: Set<ItemKey>
  onSelectGear: (g: GearKind) => void
}

export function EquipmentBar({ toolMat, armorMat, selected, enchanted, onSelectGear }: EquipmentBarProps) {
  const handleSlot = (item: ItemKey) => {
    if (isArmor(item)) {
      document.getElementById('armor')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    onSelectGear(item)
    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav aria-label="Equipment" className="z-40 px-3 pt-3 md:sticky md:top-0 md:px-6">
      <div className="mx-auto max-w-6xl">
        <ul className="flex items-end gap-1 pl-2">
          {TABS.map((tab) => (
            <li key={tab.href}>
              <a
                href={tab.href}
                className="mc-panel flex size-12 items-center justify-center border-b-0 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-mc-aqua md:size-14"
                title={tab.label}
              >
                <Sprite src={tab.icon} alt={tab.label} size={30} glint={tab.glint} />
              </a>
            </li>
          ))}
        </ul>
        <div className="mc-panel -mt-[3px] px-3 py-2 md:px-4" style={{ clipPath: 'none' }}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xl text-[#3f3f3f]">Equipment</span>
            <span className="hidden text-lg text-[#555] sm:inline">Click a slot to inspect</span>
          </div>
          <ul className="flex flex-wrap gap-1 pb-1" role="list">
            {EQUIPMENT_ORDER.map((item) => {
              const name = itemName(item, toolMat, armorMat)
              const active = !isArmor(item) && item === selected
              return (
                <li key={item} className="group relative">
                  <button
                    type="button"
                    onClick={() => handleSlot(item)}
                    aria-label={name}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'mc-slot mc-slot-hover size-11 cursor-pointer md:size-12',
                      active && 'mc-slot-active',
                    )}
                  >
                    <Sprite src={itemSprite(item, toolMat, armorMat)} alt="" size={32} glint={enchanted.has(item)} />
                  </button>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 hidden -translate-x-1/2 whitespace-nowrap group-hover:block group-focus-within:block"
                  >
                    <span className="mc-glow block">
                      <span className="mc-tooltip mc-text block px-3 py-2 text-lg text-white">{name}</span>
                    </span>
                  </span>
                </li>
              )
            })}
            <li className="group relative">
              <a href="#library" aria-label="Enchanted Book" className="mc-slot mc-slot-hover size-11 md:size-12">
                <Sprite src="/sprites/enchanted_book.png" alt="" size={32} glint />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
