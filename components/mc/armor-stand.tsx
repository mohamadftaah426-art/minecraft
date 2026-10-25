import type React from 'react'
import { type ArmorPiece, type TrimPattern, trimPatternStyle } from '@/lib/mc-data'

const S = 7

interface Skin {
  color: string
  trim?: React.CSSProperties
  glint?: boolean
  visor?: boolean
}

const pixelGrain = `repeating-conic-gradient(rgba(0,0,0,0.07) 0 25%, transparent 0 50%)`

function Face({
  w,
  h,
  transform,
  shade,
  skin,
  visor,
}: {
  w: number
  h: number
  transform: string
  shade: string
  skin: Skin
  visor?: boolean
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform,
        backfaceVisibility: 'hidden',
        background: `${pixelGrain} 0 0 / ${S * 2}px ${S * 2}px, ${shade}`,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)',
      }}
    >
      {skin.trim && <div className="absolute inset-0 opacity-90" style={skin.trim} />}
      {visor && (
        <div
          className="absolute"
          style={{ left: '20%', right: '20%', top: '45%', height: S * 2, background: 'rgba(10,0,16,0.85)' }}
        />
      )}
      {skin.glint && <span aria-hidden className="mc-glint" />}
    </div>
  )
}

function Box({
  size: [bw, bh, bd],
  at: [x, y, z],
  skin,
}: {
  size: [number, number, number]
  at: [number, number, number]
  skin: Skin
}) {
  const w = bw * S
  const h = bh * S
  const d = bd * S
  const c = skin.color
  const side = `color-mix(in srgb, ${c} 74%, black)`
  const back = `color-mix(in srgb, ${c} 60%, black)`
  const top = `color-mix(in srgb, ${c} 82%, white)`
  const bottom = `color-mix(in srgb, ${c} 45%, black)`
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transformStyle: 'preserve-3d', transform: `translate3d(${x * S}px, ${y * S}px, ${z * S}px)` }}
    >
      <Face w={w} h={h} transform={`translateZ(${d / 2}px)`} shade={c} skin={skin} visor={skin.visor} />
      <Face w={w} h={h} transform={`rotateY(180deg) translateZ(${d / 2}px)`} shade={back} skin={skin} />
      <Face w={d} h={h} transform={`rotateY(90deg) translateZ(${w / 2}px)`} shade={side} skin={skin} />
      <Face w={d} h={h} transform={`rotateY(-90deg) translateZ(${w / 2}px)`} shade={side} skin={skin} />
      <Face w={w} h={d} transform={`rotateX(90deg) translateZ(${h / 2}px)`} shade={top} skin={skin} />
      <Face w={w} h={d} transform={`rotateX(-90deg) translateZ(${h / 2}px)`} shade={bottom} skin={skin} />
    </div>
  )
}

const WOOD: Skin = { color: '#A0784A' }
const STONE: Skin = { color: '#8A8A8A' }

export interface ArmorStandProps {
  equipped: Record<ArmorPiece, boolean>
  colors: Record<ArmorPiece, string>
  glint: Record<ArmorPiece, boolean>
  trimPattern: TrimPattern | null
  trimColor: string
  spinning: boolean
  angle: number
}

export function ArmorStand({ equipped, colors, glint, trimPattern, trimColor, spinning, angle }: ArmorStandProps) {
  const trim = trimPattern ? trimPatternStyle(trimPattern, trimColor) : undefined
  const skin = (p: ArmorPiece, extra?: Partial<Skin>): Skin => ({ color: colors[p], trim, glint: glint[p], ...extra })

  return (
    <div className="relative flex h-[340px] items-center justify-center md:h-[380px]" style={{ perspective: 1100 }}>
      <div
        data-motion
        className="relative size-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: spinning ? undefined : `rotateX(-14deg) rotateY(${angle}deg)`,
          animation: spinning ? 'mc-stand-spin 12s linear infinite' : undefined,
          marginTop: -10,
        }}
      >
        <Box size={[12, 1, 12]} at={[0, 18.5, 0]} skin={STONE} />
        <Box size={[2, 11, 2]} at={[-2, 12.5, 0]} skin={WOOD} />
        <Box size={[2, 11, 2]} at={[2, 12.5, 0]} skin={WOOD} />
        <Box size={[8, 2, 2]} at={[0, 6, 0]} skin={WOOD} />
        <Box size={[2, 7, 2]} at={[-2, 1.5, 0]} skin={WOOD} />
        <Box size={[2, 7, 2]} at={[2, 1.5, 0]} skin={WOOD} />
        <Box size={[12, 3, 3]} at={[0, -4.5, 0]} skin={WOOD} />
        <Box size={[2, 7, 2]} at={[0, -9.5, 0]} skin={WOOD} />
        <Box size={[2, 12, 2]} at={[-7, 1, 0]} skin={WOOD} />
        <Box size={[2, 12, 2]} at={[7, 1, 0]} skin={WOOD} />

        {equipped.helmet && <Box size={[10, 10, 10]} at={[0, -11, 0]} skin={skin('helmet', { visor: true })} />}

        {equipped.chestplate && (
          <>
            <Box size={[10, 13, 6]} at={[0, -0.5, 0]} skin={skin('chestplate')} />
            <Box size={[5, 9, 6]} at={[-7.5, -2, 0]} skin={skin('chestplate')} />
            <Box size={[5, 9, 6]} at={[7.5, -2, 0]} skin={skin('chestplate')} />
          </>
        )}

        {equipped.leggings && (
          <>
            <Box size={[9.4, 3.5, 5.2]} at={[0, 6.75, 0]} skin={skin('leggings')} />
            <Box size={[4.6, 9, 4.6]} at={[-2.3, 12.5, 0]} skin={skin('leggings')} />
            <Box size={[4.6, 9, 4.6]} at={[2.3, 12.5, 0]} skin={skin('leggings')} />
          </>
        )}

        {equipped.boots && (
          <>
            <Box size={[5.2, 4.6, 5.6]} at={[-2.4, 15.7, 0.2]} skin={skin('boots')} />
            <Box size={[5.2, 4.6, 5.6]} at={[2.4, 15.7, 0.2]} skin={skin('boots')} />
          </>
        )}
      </div>
      <div aria-hidden className="absolute bottom-4 h-6 w-48 rounded-[50%] bg-black/50 blur-md" />
    </div>
  )
}
