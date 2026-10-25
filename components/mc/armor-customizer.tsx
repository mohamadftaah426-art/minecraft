'use client'

import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  type ArmorMaterial,
  type ArmorPiece,
  type ItemKey,
  type TrimPattern,
  ARMOR_MATERIALS,
  ARMOR_PIECES,
  DYES,
  ENCHANTMENTS,
  ENCHANT_BY_ID,
  TRIM_MATERIALS,
  TRIM_PATTERNS,
  itemName,
  itemSprite,
  roman,
  trimLabel,
  trimPatternStyle,
} from '@/lib/mc-data'
import { ArmorStand } from './armor-stand'
import { EnchantCard } from './enchant-card'
import { SectionHeading, Sprite, Tooltip } from './primitives'

interface ArmorCustomizerProps {
  armorMat: ArmorMaterial
  onArmorMat: (m: ArmorMaterial) => void
  applied: Record<ItemKey, string[]>
  onToggleEnchant: (item: ItemKey, id: string) => void
}

function ControlGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mc-panel-dark p-3">
      <legend className="mc-text px-1 text-xl text-mc-gold">{title}</legend>
      {children}
    </fieldset>
  )
}

export function ArmorCustomizer({ armorMat, onArmorMat, applied, onToggleEnchant }: ArmorCustomizerProps) {
  const [equipped, setEquipped] = useState<Record<ArmorPiece, boolean>>({
    helmet: true,
    chestplate: true,
    leggings: true,
    boots: true,
  })
  const [dye, setDye] = useState<string | null>(null)
  const [pattern, setPattern] = useState<TrimPattern | null>('sentry')
  const [trimMat, setTrimMat] = useState(TRIM_MATERIALS[0].id)
  const [spinning, setSpinning] = useState(true)
  const [angle, setAngle] = useState(-30)
  const [piece, setPiece] = useState<ArmorPiece>('chestplate')

  const mat = ARMOR_MATERIALS.find((m) => m.id === armorMat)!
  const dyeColor = DYES.find((d) => d.id === dye)?.color
  const baseColor = armorMat === 'leather' && dyeColor ? dyeColor : mat.base
  const trimColor = TRIM_MATERIALS.find((t) => t.id === trimMat)!.color
  const colors = Object.fromEntries(ARMOR_PIECES.map((p) => [p, baseColor])) as Record<ArmorPiece, string>
  const glint = Object.fromEntries(ARMOR_PIECES.map((p) => [p, (applied[p]?.length ?? 0) > 0])) as Record<
    ArmorPiece,
    boolean
  >

  const current = applied[piece] ?? []
  const compatible = ENCHANTMENTS.filter((e) => e.items.includes(piece))
  const blockerFor = (id: string) => {
    const hit = current.find((c) => c !== id && ENCHANT_BY_ID[c].conflicts.includes(id))
    return hit ? ENCHANT_BY_ID[hit].name : null
  }

  return (
    <section id="armor" aria-labelledby="armor-title" className="scroll-mt-48">
      <SectionHeading
        id="armor-title"
        eyebrow="Section III"
        title="Armor Stand Customizer"
        description="Dress the stand, swap materials, dye leather, apply smithing trims, and enchant each piece."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Tooltip glow="strong" innerClassName="relative overflow-hidden p-0">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 40%, rgba(128,80,255,0.35), transparent 65%), linear-gradient(180deg, transparent 70%, rgba(40,0,127,0.5))',
            }}
          />
          <ArmorStand
            equipped={equipped}
            colors={colors}
            glint={glint}
            trimPattern={pattern}
            trimColor={trimColor}
            spinning={spinning}
            angle={angle}
          />
          <div className="relative flex flex-col gap-3 px-5 pb-5">
            <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Equipped pieces">
              {ARMOR_PIECES.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={equipped[p]}
                  aria-label={`${equipped[p] ? 'Unequip' : 'Equip'} ${itemName(p, 'diamond', armorMat)}`}
                  title={itemName(p, 'diamond', armorMat)}
                  onClick={() => setEquipped((e) => ({ ...e, [p]: !e[p] }))}
                  className={cn(
                    'mc-slot mc-slot-hover size-12 cursor-pointer',
                    equipped[p] ? 'mc-slot-active' : 'opacity-60',
                  )}
                >
                  <Sprite src={itemSprite(p, 'diamond', armorMat)} alt="" size={32} glint={glint[p]} />
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button type="button" className="mc-btn text-lg" aria-pressed={spinning} onClick={() => setSpinning((s) => !s)}>
                {spinning ? 'Pause spin' : 'Auto spin'}
              </button>
              <label className="mc-text flex items-center gap-2 text-lg text-white">
                Rotate
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={angle}
                  onChange={(e) => {
                    setSpinning(false)
                    setAngle(Number(e.target.value))
                  }}
                  className="w-36 accent-mc-royal"
                />
              </label>
            </div>
          </div>
        </Tooltip>

        <Tooltip innerClassName="flex flex-col gap-4 p-4 md:p-5">
          <ControlGroup title="Armor Material">
            <div className="flex flex-wrap gap-2">
              {ARMOR_MATERIALS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={armorMat === m.id}
                  onClick={() => onArmorMat(m.id)}
                  className="mc-btn text-lg"
                >
                  <Sprite src={itemSprite('chestplate', 'diamond', m.id)} alt="" size={20} />
                  {m.label}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="Leather Dye">
            {armorMat !== 'leather' && (
              <p className="mc-text mb-2 text-lg text-mc-gray">Only leather armor can be dyed.</p>
            )}
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Dye colors">
              <button
                type="button"
                aria-pressed={dye === null}
                disabled={armorMat !== 'leather'}
                onClick={() => setDye(null)}
                className={cn(
                  'mc-slot size-9 cursor-pointer text-base text-white disabled:cursor-not-allowed disabled:opacity-40',
                  dye === null && 'mc-slot-active',
                )}
                title="Undyed"
              >
                <span className="sr-only">Undyed</span>
                <span aria-hidden>x</span>
              </button>
              {DYES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={dye === d.id}
                  aria-label={`${d.label} dye`}
                  title={d.label}
                  disabled={armorMat !== 'leather'}
                  onClick={() => setDye(d.id)}
                  className={cn(
                    'mc-slot size-9 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
                    dye === d.id && 'mc-slot-active',
                  )}
                >
                  <span aria-hidden className="size-5 border-2 border-black" style={{ background: d.color }} />
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title={`Trim Pattern${pattern ? ` — ${trimLabel(pattern)}` : ''}`}>
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-7 md:grid-cols-10" role="group" aria-label="Trim patterns">
              <button
                type="button"
                aria-pressed={pattern === null}
                onClick={() => setPattern(null)}
                title="No trim"
                className={cn('mc-slot aspect-square cursor-pointer text-base text-white', pattern === null && 'mc-slot-active')}
              >
                <span className="sr-only">No trim</span>
                <span aria-hidden>x</span>
              </button>
              {TRIM_PATTERNS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={pattern === p}
                  aria-label={`${trimLabel(p)} trim`}
                  title={trimLabel(p)}
                  onClick={() => setPattern(p)}
                  className={cn('mc-slot aspect-square cursor-pointer p-1.5', pattern === p && 'mc-slot-active')}
                >
                  <span
                    aria-hidden
                    className="block size-full border-2 border-black"
                    style={{ backgroundColor: baseColor, ...trimPatternStyle(p, trimColor) }}
                  />
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="Trim Material">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Trim materials">
              {TRIM_MATERIALS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={trimMat === t.id}
                  aria-label={`${t.label} trim material`}
                  title={t.label}
                  disabled={!pattern}
                  onClick={() => setTrimMat(t.id)}
                  className={cn(
                    'mc-slot size-11 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
                    trimMat === t.id && 'mc-slot-active',
                  )}
                >
                  <Sprite src={t.sprite} alt="" size={28} />
                </button>
              ))}
            </div>
          </ControlGroup>
        </Tooltip>
      </div>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h3 className="mc-text text-3xl text-white">Enchant your armor</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Armor piece to enchant">
          {ARMOR_PIECES.map((p) => (
            <button key={p} type="button" aria-pressed={piece === p} onClick={() => setPiece(p)} className="mc-btn text-lg">
              <Sprite src={itemSprite(p, 'diamond', armorMat)} alt="" size={20} glint={glint[p]} />
              {itemName(p, 'diamond', armorMat).split(' ').slice(-1)[0]}
            </button>
          ))}
        </div>
      </div>
      {current.length > 0 && (
        <p className="mc-text mt-3 text-xl text-white" aria-live="polite">
          {itemName(piece, 'diamond', armorMat)}:{' '}
          {current.map((id, i) => (
            <span key={id} className={cn('mc-text-glow', ENCHANT_BY_ID[id].curse ? 'text-mc-red' : 'text-mc-enchant')}>
              {ENCHANT_BY_ID[id].name} {roman(ENCHANT_BY_ID[id].max)}
              {i < current.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {compatible.map((e) => (
          <li key={e.id}>
            <EnchantCard
              enchant={e}
              toolMat="diamond"
              armorMat={armorMat}
              applied={current.includes(e.id)}
              blockedBy={blockerFor(e.id)}
              onToggle={() => onToggleEnchant(piece, e.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
