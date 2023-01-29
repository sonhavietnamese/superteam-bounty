import React, { useLayoutEffect } from 'react'
// @ts-ignore
import { Gradient } from '../utils/Gradient.js'

const AnimateGradientBackground = () => {
  useLayoutEffect(() => {
    const gradient = new Gradient()
    gradient.initGradient('#gradient-canvas')
  }, [])
  return <div>AnimateGradientBackground</div>
}

export default AnimateGradientBackground
