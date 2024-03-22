export interface iLink {
  name: string
  paths: string[]
  linkPath: string

}

export interface iRouteConfig {
  activeLinkIndex: number,
  activeMyPizzaGesLinkIndex: number
  isHome: boolean
  isAdminPath: boolean
  isSessionPath: boolean
  brand: string


}
