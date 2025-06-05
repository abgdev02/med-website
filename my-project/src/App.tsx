// src/App.tsx
import { Navigation } from './components/layout/Navigation'
import { HeroSection } from './components/sections/HeroSection'
import { TabSection } from './components/sections/TabSection'
import { HoldMeditateSection } from './components/sections/HoldMeditateSection'
import { useScreenSize } from './hooks/useScreenSize'
import { tabContent } from './data/tabContent'
import './App.css'

function App() {
  const { isMobile } = useScreenSize()

  return (
    <>
      <Navigation />
      <HeroSection isMobile={isMobile} />
      <TabSection isMobile={isMobile} tabContent={tabContent} />
      <HoldMeditateSection isMobile={isMobile} />
    </>
  )
}

export default App