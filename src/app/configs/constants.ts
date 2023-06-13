export const SUPPORT_CHAIN_IDS = process.env.NEXT_PUBLIC_SUPPORT_CHAIN_IDS?.split(',').map((id) => {
  return Number(id)
})
