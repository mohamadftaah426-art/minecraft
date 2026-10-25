'use client'

import { useMemo, useState } from 'react'
import { type ArmorMaterial, type GearKind, type ItemKey, type ToolMaterial, ENCHANT_BY_ID } from '@/lib/mc-data'
import { ArmorCustomizer } from './armor-customizer'
import { EnchantLibrary } from './enchant-library'
import { EquipmentBar } from './equipment-bar'
import { Hero } from './hero'
import { WeaponShowcase } from './weapon-showcase'

export function CodexApp() {
  const [toolMat, setToolMat] = useState<ToolMaterial>('diamond')
  const [armorMat, setArmorMat] = useState<ArmorMaterial>('diamond')
  const [gear, setGear] = useState<GearKind>('sword')
  const [applied, setApplied] = useState<Record<ItemKey, string[]>>({} as Record<ItemKey, string[]>)

  const toggleEnchant = (item: ItemKey, id: string) =>
    setApplied((prev) => {
      const list = prev[item] ?? []
      if (list.includes(id)) return { ...prev, [item]: list.filter((x) => x !== id) }
      if (list.some((c) => ENCHANT_BY_ID[c].conflicts.includes(id))) return prev
      return { ...prev, [item]: [...list, id] }
    })

  const clear = (item: ItemKey) => setApplied((prev) => ({ ...prev, [item]: [] }))

  const enchanted = useMemo(
    () => new Set((Object.keys(applied) as ItemKey[]).filter((k) => applied[k]?.length)),
    [applied],
  )

  return (
    <>
      <Hero />
      <EquipmentBar
        toolMat={toolMat}
        armorMat={armorMat}
        selected={gear}
        enchanted={enchanted}
        onSelectGear={setGear}
      />
      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-4 py-14 md:px-6">
        <EnchantLibrary toolMat={toolMat} armorMat={armorMat} />
        <WeaponShowcase
          gear={gear}
          onGear={setGear}
          toolMat={toolMat}
          onToolMat={setToolMat}
          applied={applied}
          onToggleEnchant={toggleEnchant}
          onClear={clear}
        />
        <ArmorCustomizer
          armorMat={armorMat}
          onArmorMat={setArmorMat}
          applied={applied}
          onToggleEnchant={toggleEnchant}
        />
      </main>
      <footer className="border-t-4 border-mc-indigo bg-mc-obsidian px-4 py-8 text-center">
        <p className="mc-text text-lg text-mc-gray">
          Fan-made codex. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
        </p>
      </footer>
    </>
  )
}
