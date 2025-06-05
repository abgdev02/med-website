// Types for the meditation app
export type TabKey = 'anchor-focus' | 'release-stress' | 'enhance-sleep' | 'sync-mind-body' | 'practice-stillness'

export interface TabContent {
  title: string
  features: [string, string]
  description: string
}

export interface TabContentData {
  [K in TabKey]: TabContent
}

export interface ScreenSizeHook {
  isMobile: boolean
  isTablet: boolean
}
