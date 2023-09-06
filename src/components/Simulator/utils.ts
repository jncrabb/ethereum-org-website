import { navigate } from "gatsby"
import { PATH_IDS } from "./constants"
import type { PathId } from "./types"

export const shareOnTwitter = (): void => {
  const url = "https://ethereum.org/simulator" // TODO: Update with production link
  const hashtags = ["walletsimulator", "ethereum", "wallet"]
  const tweet = `${encodeURI(
    `New to Web3 and Ethereum wallets? Check out these interactive wallet simulations on ethereum.org: ${url}`
  )}`

  window.open(
    `https://twitter.com/intent/tweet?text=${tweet}&hashtags=${hashtags}`
  )
}

export const clearUrlParams = (location: Location): void => {
  navigate(location.pathname, { replace: true })
}

export const getValidPathId = (pathIdString: PathId | null): PathId | null => {
  if (!pathIdString || !PATH_IDS.includes(pathIdString)) return null
  return pathIdString as PathId
}