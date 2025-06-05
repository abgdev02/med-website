import { useState } from 'react'
import { TabKey, TabContentData } from '../../types'
import { TabButton } from '../ui/TabButton'
import { TabContentDisplay } from '../ui/TabContentDisplay'

interface TabSectionProps {
  isMobile: boolean
  tabContent: TabContentData
}

const TAB_CONFIG = [
  { key: 'anchor-focus' as TabKey, label: 'Anchor Focus' },
  { key: 'release-stress' as TabKey, label: 'Release Stress' },
  { key: 'enhance-sleep' as TabKey, label: 'Enhance Sleep' },
  { key: 'sync-mind-body' as TabKey, label: 'Sync Mind & Body' },
  { key: 'practice-stillness' as TabKey, label: 'Practice Stillness' }
]

export function TabSection({ isMobile, tabContent }: TabSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('anchor-focus')

  const handleTabClick = (tabKey: TabKey) => {
    setActiveTab(tabKey)
  }

  return (
    <div className="section" style={{
      width: '100%', 
      maxWidth: '100%',
      minHeight: '100vh', 
      paddingLeft: isMobile ? 20 : 80, 
      paddingRight: isMobile ? 20 : 80, 
      paddingTop: 120, 
      paddingBottom: 120, 
      background: 'white', 
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'flex-start', 
      gap: 80, 
      display: 'flex',
      boxSizing: 'border-box'
    }}>
      <div style={{
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        gap: 40, 
        display: 'flex'
      }}>          
        <div style={{
          width: isMobile ? '100%' : 512, 
          maxWidth: '100%',
          justifyContent: 'flex-start', 
          display: 'flex', 
          flexDirection: 'column', 
          color: '#2A2A2A', 
          fontSize: isMobile ? 32 : 48, 
          fontFamily: '"Source Sans Pro", sans-serif', 
          fontWeight: '100', 
          lineHeight: isMobile ? 1.2 : 56/48, 
          wordWrap: 'break-word',
          textAlign: 'left'
        }}>
          Measure how deeply you're grounding
        </div>
        <div style={{
          width: isMobile ? '100%' : '80%', 
          maxWidth: 818,
          justifyContent: 'flex-start', 
          display: 'flex', 
          flexDirection: 'column', 
          color: '#8A8A8A', 
          fontSize: 16, 
          fontFamily: '"Source Sans Pro", sans-serif', 
          fontWeight: '400', 
          wordWrap: 'break-word',
          textAlign: 'left'
        }}>
          Root captures your emotional and sensory engagement in real time combining audio, haptics, and AI-curated calm to give you a single, personalized Mental Immersion Score.
        </div>
      </div>
      
      <div style={{
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        gap: 64, 
        display: 'flex',
        width: '100%'
      }}>
        {/* Tab Buttons */}
        <div style={{
          width: '100%', 
          maxWidth: '100%',
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: isMobile ? 12 : 16, 
          display: 'flex',
          flexWrap: 'wrap',
          padding: isMobile ? '0 10px' : '0'
        }}>
          {TAB_CONFIG.map(({ key, label }) => (
            <TabButton
              key={key}
              tabKey={key}
              label={label}
              isActive={activeTab === key}
              isMobile={isMobile}
              onClick={handleTabClick}
            />
          ))}
        </div>

        {/* Tab Content */}
        <TabContentDisplay 
          content={tabContent[activeTab]} 
          isMobile={isMobile} 
        />
      </div>
    </div>
  )
}
