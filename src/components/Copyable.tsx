import React, { ReactNode } from 'react'

const Copyable = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ReactTooltip anchorId='discord-handler' place='top' content='Copy' />
    </>
  )
}

export default Copyable
