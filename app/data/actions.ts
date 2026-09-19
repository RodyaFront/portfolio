export type ActionIconName =
  | 'telegram'
  | 'built'
  | 'designed'
  | 'email'
  | 'github'
  | 'linkedin'
  | 'dribbble'
  | 'visit'

export type ActionVisual = {
  color: string
  icon: ActionIconName
  wide?: boolean
  ink?: boolean
}

export const actionVisuals: Record<ActionIconName, ActionVisual> = {
  telegram: { color: '#26A5E4', icon: 'telegram', wide: true },
  built: { color: '#1a1a1a', icon: 'built', ink: true },
  designed: { color: '#1a1a1a', icon: 'designed', ink: true },
  email: { color: '#1a1a1a', icon: 'email', ink: true },
  github: { color: '#181717', icon: 'github', ink: true },
  linkedin: { color: '#0A66C2', icon: 'linkedin' },
  dribbble: { color: '#EA4C89', icon: 'dribbble' },
  visit: { color: '#1a1a1a', icon: 'visit', ink: true },
}
