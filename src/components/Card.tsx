import React, { PointerEvent, useEffect, useRef } from 'react'
import { clamp, round } from '../utils'
import Glare from './Glare'
import Shine from './Shine'

const Card = ({ imageUri }: { imageUri: string }) => {
  let number = 53
  let subtypes = 'basic v'
  let supertype = 'bountycert'
  let rarity = 'rare holo v'
  let gallery = true

  const thisCard = useRef<HTMLDivElement>(null)
  const rotator = useRef<HTMLButtonElement>(null)

  const galaxyPosition = Math.floor(Math.random() * 1500)

  const interact = (e: PointerEvent<HTMLButtonElement>) => {
    const el = e.target as HTMLElement
    const rect = el.getBoundingClientRect()
    const absolute = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    const percent = {
      x: round((100 / rect.width) * absolute.x),
      y: round((100 / rect.height) * absolute.y),
    }
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    }

    thisCard.current?.style.setProperty('--mx', `${percent.x}%`)
    thisCard.current?.style.setProperty('--my', `${percent.y}%`)
    thisCard.current?.style.setProperty('--tx', `${round(50 + percent.x / 4 - 12.5)}px`)
    thisCard.current?.style.setProperty('--ty', `${round(50 + percent.y / 3 - 16.67)}px`)
    thisCard.current?.style.setProperty('--s', `${1}`)
    thisCard.current?.style.setProperty('--o', `${1}`)
    thisCard.current?.style.setProperty('--rx', `${round(-(center.x / 3.5)) + 0}deg`)
    thisCard.current?.style.setProperty('--ry', `${round(center.y / 2) + 0}deg`)
    thisCard.current?.style.setProperty(
      '--pos',
      `${round(50 + percent.x / 4 - 12.5)}% ${round(50 + percent.y / 3 - 16.67)}%`,
    )
    thisCard.current?.style.setProperty('--posx', `${round(50 + percent.x / 4 - 12.5)}%`)
    thisCard.current?.style.setProperty('--posy', `${round(50 + percent.y / 3 - 16.67)}%`)
    thisCard.current?.style.setProperty(
      '--hyp',
      `${clamp(Math.sqrt((percent.y - 50) * (percent.y - 50) + (percent.y - 50) * (percent.y - 50)) / 50, 0, 1)}`,
    )
    thisCard.current?.style.setProperty('--galaxybg', `center ${galaxyPosition}px`)
  }

  return (
    <div
      ref={thisCard}
      className={`card interacting`}
      data-number={number}
      data-subtypes={subtypes}
      data-supertype={supertype}
      data-rarity={rarity}
      data-gallery={gallery}>
      <div className='card__translater'>
        <button
          ref={rotator}
          className='card__rotator'
          onPointerMove={interact}
          aria-label='Expand the Pokemon Card; {name}.'
          tabIndex={0}>
          <div className='card__front'>
            <img src={imageUri} alt='Bounty Certificate' loading='lazy' width={400} />
            <Shine subtypes={subtypes} supertype={supertype} />
            <Glare subtypes={subtypes} rarity={rarity} />
          </div>
        </button>
      </div>
    </div>
  )
}

export default Card
