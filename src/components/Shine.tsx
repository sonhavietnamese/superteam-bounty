import React from 'react'
import './styles.css'

const Shine = ({ subtypes, supertype }: { subtypes: string; supertype: string }) => {
  return <div className={`card__shine ${subtypes} ${supertype}`} />
}

export default Shine
