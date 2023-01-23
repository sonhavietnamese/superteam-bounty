const truncateAddress = (address: string) => {
  return `${address.slice(0, 3)}...${address.slice(address.length - 3, address.length)}`
}

const formatUsername = (username: string | undefined) => {
  if (!username) return `@someone`
  if (username?.includes('@') && username.indexOf('@') === 0) return username
  else if (!username?.includes('@')) return `@${username}`
}

const formatAmount = (number: number) => {
  return new Intl.NumberFormat('en-EN').format(number)
}

const round = (num: number, fix = 3) => parseFloat(num.toFixed(fix))
const clamp = (num: number, min = -20, max = 20) => Math.min(Math.max(num, min), max)

export { truncateAddress, round, clamp, formatUsername, formatAmount }
