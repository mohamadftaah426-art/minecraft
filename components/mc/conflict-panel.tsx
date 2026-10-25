'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CONFLICT_GROUPS, ENCHANT_BY_ID, roman } from '@/lib/mc-data'
import { Sprite, Tooltip } from './primitives'

export function ConflictPanel() {
  const [chosen, setChosen] = useState<string[]>([])

  const blockerOf = (id: string) => {
    const hit = chosen.find((c) => c !== id && ENCHANT_BY_ID[c].conflicts.includes(id))
    return hit ? ENCHANT_BY_ID[hit].name : null
  }

  const toggle = (id: string) =>
    setChosen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <Tooltip as="section" className="mt-10" innerClassName="p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="mc-text text-3xl text-white">Either / Or Conflict Panel</h3>
          <p className="mc-text text-xl text-mc-gray">
            Some enchantments can never share an item. Pick one and watch its rivals lock out.
          </p>
        </div>
        <button type="button" className="mc-btn self-start text-lg" onClick={() => setChosen([])} disabled={!chosen.length}>
          Reset
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONFLICT_GROUPS.map((group) => (
          <fieldset key={group.title} className="mc-panel-dark p-3">
            <legend className="mc-text px-1 text-lg text-mc-gold">{group.title}</legend>
            <div className="flex flex-col gap-2">
              {group.ids.map((id) => {
                const e = ENCHANT_BY_ID[id]
                const active = chosen.includes(id)
                const blocker = blockerOf(id)
                return (
                  <span key={id} className={cn('block', active && 'mc-glow-strong')}>
                    <button
                      type="button"
                      aria-pressed={active}
                      disabled={Boolean(blocker)}
                      onClick={() => toggle(id)}
                      title={blocker ? `Conflicts with ${blocker}` : undefined}
                      className="mc-btn w-full justify-start text-lg"
                    >
                      <Sprite src="/sprites/enchanted_book.png" alt="" size={20} glint={active} />
                      <span className="truncate">
                        {e.name} {roman(e.max)}
                      </span>
                      {blocker && <span className="sr-only">(blocked by {blocker})</span>}
                    </button>
                  </span>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2" aria-live="polite">
        <span className="mc-text text-xl text-white">Current combo:</span>
        {chosen.length === 0 ? (
          <span className="mc-text text-xl text-mc-gray">Nothing selected yet</span>
        ) : (
          chosen.map((id) => (
            <span key={id} className="mc-text-glow text-xl text-mc-enchant">
              {ENCHANT_BY_ID[id].name} {roman(ENCHANT_BY_ID[id].max)}
            </span>
          ))
        )}
      </div>
    </Tooltip>
  )
}
