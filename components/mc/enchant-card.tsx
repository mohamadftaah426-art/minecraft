import { cn } from '@/lib/utils'
import {
  type ArmorMaterial,
  type Enchantment,
  type ToolMaterial,
  itemLabel,
  itemSprite,
  roman,
} from '@/lib/mc-data'
import { Sprite } from './primitives'

interface EnchantCardProps {
  enchant: Enchantment
  toolMat: ToolMaterial
  armorMat: ArmorMaterial
  onToggle?: () => void
  applied?: boolean
  blockedBy?: string | null
}

export function EnchantCard({ enchant, toolMat, armorMat, onToggle, applied, blockedBy }: EnchantCardProps) {
  const nameColor = enchant.curse ? 'text-mc-red' : 'text-mc-enchant'
  const interactive = Boolean(onToggle)
  const disabled = Boolean(blockedBy)

  const body = (
    <div className="mc-tooltip flex h-full gap-3 text-left">
      <span className={cn('mc-slot size-14 shrink-0', applied ? 'mc-slot-active' : 'mc-slot-green')}>
        <Sprite src="/sprites/enchanted_book.png" alt="" size={36} glint />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <h3 className="mc-text text-xl leading-none text-white">Enchanted Book</h3>
          {enchant.treasure && (
            <span className="mc-text text-base leading-none text-mc-gold">Treasure</span>
          )}
        </div>
        <p className={cn('mc-text-glow text-2xl leading-none', nameColor)}>
          {enchant.name} {roman(enchant.max)}
          {enchant.max > 1 && <span className="sr-only"> (levels I to {roman(enchant.max)})</span>}
        </p>
        <p className="mc-text text-lg leading-tight text-mc-gray">{enchant.description}</p>
        <ul className="mt-1 flex flex-wrap gap-1" aria-label="Compatible items">
          {enchant.items.map((item) => (
            <li key={item} title={itemLabel(item)} className="mc-slot size-7">
              <Sprite src={itemSprite(item, toolMat, armorMat)} alt={itemLabel(item)} size={20} />
            </li>
          ))}
        </ul>
        {interactive && (
          <p
            className={cn(
              'mc-text mt-1 text-base leading-none',
              disabled ? 'text-mc-red' : applied ? 'text-mc-green' : 'text-mc-aqua',
            )}
          >
            {disabled ? `Incompatible with ${blockedBy}` : applied ? 'Applied — click to remove' : 'Click to apply'}
          </p>
        )}
      </div>
    </div>
  )

  if (!interactive) {
    return <article className="mc-glow h-full">{body}</article>
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={applied}
      className={cn(
        'h-full w-full cursor-pointer transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mc-aqua',
        applied ? 'mc-glow-strong -translate-y-0.5' : 'mc-glow hover:-translate-y-0.5',
        disabled && 'cursor-not-allowed opacity-45 grayscale',
      )}
    >
      {body}
    </button>
  )
}
