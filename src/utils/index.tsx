const truncateAddress = (address: string) => {
  return `${address.slice(0, 3)}...${address.slice(address.length - 3, address.length)}`
}

const round = (num: number, fix = 3) => parseFloat(num.toFixed(fix))
const clamp = (num: number, min = -20, max = 20) => Math.min(Math.max(num, min), max)

export { truncateAddress, round, clamp }
