'use client'

import { useMemo, useState } from 'react'
import { type ArmorMaterial, type Category, type ToolMaterial, ENCHANTMENTS } from '@/lib/mc-data'
import { ConflictPanel } from './conflict-panel'
import { EnchantCard } from './enchant-card'
import { SectionHeading, Sprite } from './primitives'

const FILTERS: { id: Category | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '/sprites/enchanted_book.png' },
  { id: 'armor', label: 'Armor', icon: '/sprites/diamond_chestplate.png' },
  { id: 'melee', label: 'Melee', icon: '/sprites/diamond_sword.png' },
  { id: 'tools', label: 'Tools', icon: '/sprites/diamond_pickaxe.png' },
  { id: 'ranged', label: 'Ranged', icon: '/sprites/bow.png' },
  { id: 'special', label: 'Trident & Mace', icon: '/sprites/trident.png' },
]

export function EnchantLibrary({ toolMat, armorMat }: { toolMat: ToolMaterial; armorMat: ArmorMaterial }) {
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ENCHANTMENTS.filter(
      (e) =>
        (filter === 'all' || e.category === filter) &&
        (!q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)),
    )
  }, [filter, query])

  return (
    <section id="library" aria-labelledby="library-title" className="scroll-mt-48">
      <SectionHeading
        id="library-title"
        eyebrow="Section I"
        title="Enchantment Library"
        description="Every enchantment in the game, its max level, what it does, and which gear can carry it."
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="mc-btn text-lg"
            >
              <Sprite src={f.icon} alt="" size={20} glint={f.id === 'all'} />
              {f.label}
            </button>
          ))}
        </div>
        <label className="mc-panel-dark flex items-center gap-2 px-3 py-1.5 lg:w-72">
          <span className="sr-only">Search enchantments</span>
          <span aria-hidden className="text-mc-gray">{'>'}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search enchantments..."
            className="mc-text w-full bg-transparent text-xl text-white placeholder:text-[#6a6a6a] focus:outline-none"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="mc-text text-xl text-mc-gray">No enchantments match that search.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((e) => (
            <li key={e.id}>
              <EnchantCard enchant={e} toolMat={toolMat} armorMat={armorMat} />
            </li>
          ))}
        </ul>
      )}

      <ConflictPanel />
    </section>
  )
}
