'use client'

import { cn } from '@/lib/utils'
import {
  type GearKind,
  type ItemKey,
  type ToolMaterial,
  ENCHANTMENTS,
  ENCHANT_BY_ID,
  GEAR,
  TOOL_MATERIALS,
  isTiered,
  itemName,
  itemSprite,
  roman,
} from '@/lib/mc-data'
import { EnchantCard } from './enchant-card'
import { SectionHeading, Sprite, Tooltip } from './primitives'

const LAYERS = 9
const RUNES = ['ᔑ', 'ʖ', 'ᓵ', '↸', 'ᒷ', '⎓', '⊣', '⍑', '╎', '⋮', 'ꖌ', 'ꖎ']

function DroppedItem({ src, alt, glint }: { src: string; alt: string; glint: boolean }) {
  return (
    <div className="relative flex h-72 items-center justify-center md:h-80" style={{ perspective: 900 }}>
      <div data-motion className="relative" style={{ animation: 'mc-bob 3s ease-in-out infinite' }}>
        <div
          data-motion
          className="relative size-40 md:size-48"
          style={{ transformStyle: 'preserve-3d', animation: 'mc-spin 7s linear infinite' }}
          role="img"
          aria-label={alt}
        >
          {Array.from({ length: LAYERS }, (_, i) => {
            const z = (i - (LAYERS - 1) / 2) * 1.3
            const edge = i === 0 || i === LAYERS - 1
            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  transform: `translateZ(${z}px)${i === 0 ? ' rotateY(180deg)' : ''}`,
                  filter: edge ? undefined : 'brightness(0.62)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full" draggable={false} />
                {glint && edge && (
                  <span
                    aria-hidden
                    className="mc-glint"
                    style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div
        aria-hidden
        data-motion
        className="absolute bottom-6 h-4 w-32 rounded-[50%] bg-black/60 blur-sm"
        style={{ animation: 'mc-pulse 3s ease-in-out infinite' }}
      />
    </div>
  )
}

interface WeaponShowcaseProps {
  gear: GearKind
  onGear: (g: GearKind) => void
  toolMat: ToolMaterial
  onToolMat: (m: ToolMaterial) => void
  applied: Record<ItemKey, string[]>
  onToggleEnchant: (item: ItemKey, id: string) => void
  onClear: (item: ItemKey) => void
}

export function WeaponShowcase({
  gear,
  onGear,
  toolMat,
  onToolMat,
  applied,
  onToggleEnchant,
  onClear,
}: WeaponShowcaseProps) {
  const current = applied[gear] ?? []
  const name = itemName(gear, toolMat)
  const src = itemSprite(gear, toolMat)
  const compatible = ENCHANTMENTS.filter((e) => e.items.includes(gear))
  const tiered = isTiered(gear)

  const blockerFor = (id: string) => {
    const hit = current.find((c) => c !== id && ENCHANT_BY_ID[c].conflicts.includes(id))
    return hit ? ENCHANT_BY_ID[hit].name : null
  }

  return (
    <section id="showcase" aria-labelledby="showcase-title" className="scroll-mt-48">
      <SectionHeading
        id="showcase-title"
        eyebrow="Section II"
        title="Weapons & Tools Showcase"
        description="Pick a weapon, forge it from any material, then stack compatible enchantments to light it up."
      />

      <div className="mb-4 flex flex-wrap justify-center gap-1" role="group" aria-label="Choose weapon or tool">
        {GEAR.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={g === gear}
            aria-label={itemName(g, toolMat)}
            title={itemName(g, toolMat)}
            onClick={() => onGear(g)}
            className={cn('mc-slot mc-slot-hover size-12 cursor-pointer md:size-14', g === gear && 'mc-slot-active')}
          >
            <Sprite src={itemSprite(g, toolMat)} alt="" size={34} glint={(applied[g]?.length ?? 0) > 0} />
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,2fr)_1fr]">
        <Tooltip as="aside" className="order-2 lg:order-1" innerClassName="p-4">
          <h3 className="mc-text mb-3 text-2xl text-white">Material</h3>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1" role="group" aria-label="Material switcher">
            {TOOL_MATERIALS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={toolMat === m.id}
                disabled={!tiered}
                onClick={() => onToolMat(m.id)}
                className="mc-btn justify-start text-xl"
              >
                <span aria-hidden className="size-4 border-2 border-black" style={{ background: m.swatch }} />
                {m.label}
              </button>
            ))}
          </div>
          {!tiered && (
            <p className="mc-text mt-3 text-lg text-mc-gray">
              The {name} has a single form — no material tiers.
            </p>
          )}
        </Tooltip>

        <Tooltip glow="strong" className="order-1 lg:order-2" innerClassName="relative overflow-hidden p-0">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at 50% 55%, rgba(128,80,255,0.45), transparent 60%), radial-gradient(ellipse at 50% 110%, rgba(85,255,255,0.18), transparent 50%)',
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {RUNES.map((r, i) => (
              <span
                key={i}
                data-motion
                className="absolute bottom-6 text-2xl text-mc-enchant/80"
                style={{
                  left: `${8 + ((i * 83) % 84)}%`,
                  animation: `mc-float-rune ${4 + (i % 4)}s linear ${i * 0.45}s infinite`,
                  opacity: 0,
                }}
              >
                {r}
              </span>
            ))}
          </div>
          <DroppedItem src={src} alt={name} glint={current.length > 0} />
          <div className="relative px-5 pb-5 text-center">
            <p className={cn('mc-text text-3xl', current.length ? 'text-mc-aqua' : 'text-white')}>{name}</p>
            <p className="mc-text text-lg text-mc-gray">
              {current.length
                ? `${current.length} enchantment${current.length > 1 ? 's' : ''} applied`
                : 'Unenchanted'}
            </p>
          </div>
        </Tooltip>

        <Tooltip as="aside" className="order-3" innerClassName="flex flex-col p-4">
          <h3 className="mc-text text-2xl text-white">Item Tooltip</h3>
          <div className="mc-panel-dark mt-3 flex-1 p-3">
            <p className={cn('mc-text text-2xl', current.length ? 'text-mc-aqua' : 'text-white')}>{name}</p>
            {current.length === 0 ? (
              <p className="mc-text text-lg text-mc-gray">Apply enchantments below.</p>
            ) : (
              <ul className="mt-1 flex flex-col">
                {current.map((id) => {
                  const e = ENCHANT_BY_ID[id]
                  return (
                    <li
                      key={id}
                      className={cn('mc-text-glow text-xl', e.curse ? 'text-mc-red' : 'text-mc-enchant')}
                    >
                      {e.name} {roman(e.max)}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="mc-btn mt-3 text-lg"
            onClick={() => onClear(gear)}
            disabled={current.length === 0}
          >
            Grindstone (Clear)
          </button>
        </Tooltip>
      </div>

      <h3 className="mc-text mb-4 mt-10 text-3xl text-white">
        Compatible with the <span className="text-mc-aqua">{name}</span>
      </h3>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {compatible.map((e) => (
          <li key={e.id}>
            <EnchantCard
              enchant={e}
              toolMat={toolMat}
              armorMat="diamond"
              applied={current.includes(e.id)}
              blockedBy={blockerFor(e.id)}
              onToggle={() => onToggleEnchant(gear, e.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
