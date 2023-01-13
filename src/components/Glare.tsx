import React from 'react'
import './styles.css'

const Glare = ({ subtypes, rarity }: { subtypes: string; rarity: string }) => {
  return <div className={`card__glare ${subtypes} ${rarity}`} />
}

export default Glare
