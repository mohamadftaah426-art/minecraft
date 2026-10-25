'use client'

import { useState } from 'react'
import { ENCHANTMENTS } from '@/lib/mc-data'
import { Sprite, Tooltip } from './primitives'

const TIPS = [
  'Mending and Infinity refuse to share a bow. Choose wisely, archer.',
  'Have you tried swimming in lava? Just don’t try it in survival mode...',
  'Fifteen bookshelves around the table unlock level 30 enchantments.',
  'Wind Burst sends you skyward after every mace smash. Fall Damage? Never heard of it.',
  'Silk Touch and Fortune are rivals. Pick one per pickaxe.',
  'Curses glow red. Once applied, a Grindstone is your only friend.',
]

export function Hero() {
  const [tip, setTip] = useState(0)

  return (
    <header className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/enchanting-room.png"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover opacity-55"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-mc-void/40 via-mc-void/60 to-mc-void" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 pb-16 pt-14 md:pb-24 md:pt-20">
        <Tooltip glow="strong" innerClassName="flex items-center gap-4 px-6 py-5 md:px-8">
          <span className="mc-slot mc-slot-green size-16 shrink-0 md:size-20">
            <Sprite src="/sprites/enchanted_book.png" alt="" size={52} glint />
          </span>
          <div>
            <h1 className="mc-text text-4xl leading-none text-white md:text-6xl">Enchantment Codex</h1>
            <p className="mc-text-glow mt-1 text-2xl leading-none text-mc-enchant md:text-3xl">
              {ENCHANTMENTS.length} Enchantments & Gear Customizer
            </p>
          </div>
        </Tooltip>

        <div className="mc-panel w-full max-w-2xl p-2">
          <p className="pb-1 text-center text-2xl text-[#3f3f3f]">Loading tips</p>
          <div className="mc-panel-dark flex flex-col gap-4 p-4">
            <p className="mc-text min-h-14 text-xl text-white md:text-2xl" aria-live="polite">
              {TIPS[tip]}
            </p>
            <div className="mc-xp-bar">
              <span style={{ width: `${((tip + 1) / TIPS.length) * 100}%` }} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="mc-text text-lg text-mc-gray">
                Tip {tip + 1} / {TIPS.length}
              </span>
              <button type="button" className="mc-btn text-lg" onClick={() => setTip((t) => (t + 1) % TIPS.length)}>
                Next tip
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a href="#library" className="mc-btn px-6 text-2xl">
            Browse Library
          </a>
          <a href="#showcase" className="mc-btn px-6 text-2xl">
            Enchant Gear
          </a>
          <a href="#armor" className="mc-btn px-6 text-2xl">
            Dress Armor Stand
          </a>
        </div>
      </div>
    </header>
  )
}
