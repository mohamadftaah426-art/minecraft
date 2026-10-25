import type React from 'react'
import { cn } from '@/lib/utils'

export function Sprite({
  src,
  alt,
  size = 32,
  glint = false,
  className,
}: {
  src: string
  alt: string
  size?: number
  glint?: boolean
  className?: string
}) {
  return (
    <span className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={size} height={size} className="block size-full" draggable={false} />
      {glint && (
        <span
          aria-hidden
          className="mc-glint"
          style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
        />
      )}
    </span>
  )
}

export function Tooltip({
  children,
  className,
  innerClassName,
  glow = 'normal',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  glow?: 'none' | 'normal' | 'strong'
  as?: 'div' | 'article' | 'section' | 'aside'
}) {
  return (
    <Tag
      className={cn(
        glow === 'normal' && 'mc-glow',
        glow === 'strong' && 'mc-glow-strong',
        className,
      )}
    >
      <div className={cn('mc-tooltip h-full', innerClassName)}>{children}</div>
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string
  title: string
  description: string
  id: string
}) {
  return (
    <header className="mb-6 flex flex-col gap-1">
      <p className="mc-text text-lg uppercase tracking-widest text-mc-enchant">{eyebrow}</p>
      <h2 id={id} className="mc-text text-4xl text-white md:text-5xl">
        {title}
      </h2>
      <p className="mc-text max-w-2xl text-xl text-mc-gray">{description}</p>
    </header>
  )
}
