import { useState, useEffect } from 'react'
import { TabKey, TabContentData } from '../../types'
import { TabButton } from '../ui/TabButton'
import mindfulnessIcon from '../../assets/icons/mindfulness 1.svg'
import rippleIcon from '../../assets/icons/ripple.svg'
import sineIcon from '../../assets/icons/sine.svg'
import styles from './TabSection.module.css'

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
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // Reset expanded item when tab changes
  useEffect(() => {
    setExpandedItem(null)
  }, [activeTab])

  const handleTabClick = (tabKey: TabKey) => {
    setActiveTab(tabKey)
    // Remove the immediate setExpandedItem(null) since useEffect handles it
  }
  
  const toggleExpanded = (itemKey: string) => {
    setExpandedItem(prev => prev === itemKey ? null : itemKey)
  }

  const renderExpandableItem = (
    iconSrc: string,
    title: string,
    description: string,
    itemKey: string
  ) => {
    const isExpanded = expandedItem === itemKey
    
    return (
      <div key={itemKey} style={{ width: '100%' }}>
        <div 
          onClick={() => toggleExpanded(itemKey)}
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 24,
            display: 'flex',
            cursor: 'pointer',
            padding: '16px 0',
            transition: 'all 0.3s ease'
          }}
        >
          <img src={iconSrc} alt="" style={{ width: 24, height: 24 }} />
          <div style={{
            justifyContent: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            color: isExpanded ? '#4A4A4A' : '#6A6A6A',
            fontSize: 14,
            fontFamily: '"Source Sans Pro", sans-serif',
            fontWeight: isExpanded ? '700' : '300',
            wordWrap: 'break-word',
            flex: 1,
            textAlign: 'left'
          }}>
            {title}
          </div>
        </div>
        
        <div style={{
          maxHeight: isExpanded ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-out',
          paddingLeft: 48
        }}>
          <div style={{
            padding: '12px 0 24px 0',
            color: '#8a8a8a',
            fontSize: 14,
            fontFamily: '"Source Sans Pro", sans-serif',
            fontWeight: '300',
            wordWrap: 'break-word',
            lineHeight: 1.5,
            textAlign: 'left'
          }}>
            {description}
          </div>
        </div>
        
        <div style={{
          width: '100%',
          height: 0,
          outline: '0.50px #f2f2f2 solid',
          outlineOffset: '-0.25px',
          margin: '12px 0'
        }}></div>
      </div>
    )
  }
  
  return (    <div className={`${styles.section} ${isMobile ? styles.mobile : ''}`}>      {/* Header Section */}
      <div className={styles.headerSection} style={{ marginTop: isMobile ? 80 : 120 }}>            <div className="gradient-text-primary" style={{
            color: '#2A2A2A',
            fontSize: isMobile ? 32 : 48,
            fontFamily: 'Source Sans Pro',
            fontWeight: '300',
            lineHeight: isMobile ? 1.2 : 1.2,
            wordWrap: 'break-word',
            textAlign: 'left'
          }}>
          Measure how deeply you're grounding
        </div>        <div className={`${styles.description} ${isMobile ? styles.mobile : ''}`} style={{
          color: '#8a8a8a',
          fontSize: isMobile ? 14 : 16,
          fontFamily: '"Source Sans Pro", sans-serif',
          fontWeight: '300',
          lineHeight: 1.6,
          textAlign: 'left',
          marginTop: isMobile ? 16 : 24
        }}>
          Root captures your emotional and sensory engagement in real time combining audio, haptics, and AI-curated calm to give you a single, personalized Mental Immersion Score.
        </div>
      </div>      {/* Tab and Content Section */}
      <div style={{
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        gap: 64, 
        display: 'flex',
        width: '100%'
      }}>        {/* Tab Buttons */}
        <div style={{
          width: '100%', 
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
        </div>        {/* Content section with 12-column grid */}
        <div className={`grid-container ${isMobile ? '' : ''}`} style={{
          width: '100%',
          paddingTop: 24,
          paddingBottom: 24,
          justifyItems: 'stretch',
          alignItems: 'start'
        }}>{/* Left content with expandable items - Columns 1-6 */}
          <div className="col-12 md:col-6" style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 24,
            display: 'flex',
            paddingRight: isMobile ? 0 : 48,
            justifySelf: 'start',
            alignSelf: 'start'
          }}>{/* Dynamic expandable content */}
            {renderExpandableItem(
              mindfulnessIcon,
              (tabContent as any)[activeTab].features[0],
              "Let rhythmic sensations and guided breath redirect racing thoughts—helping your mind slow down and return to calm, one pulse at a time.",
              `${activeTab}-feature-1`
            )}

            {renderExpandableItem(
              rippleIcon,
              (tabContent as any)[activeTab].features[1],
              "Experience deeper states of mindfulness through synchronized breathing patterns and gentle haptic feedback that guide your nervous system into relaxation.",
              `${activeTab}-feature-2`
            )}

            {renderExpandableItem(
              sineIcon,
              (tabContent as any)[activeTab].description,
              "Advanced biometric sensors track your heart rate variability and breathing patterns to provide real-time feedback on your meditation depth and emotional state.",
              `${activeTab}-feature-3`
            )}
          </div>          {/* Right image placeholder - Columns 7-12 */}
          <div className="col-12 md:col-6" style={{
            width: '100%',
            height: isMobile ? 250 : 400,
            borderRadius: 16,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
            fontFamily: '"Source Sans Pro", sans-serif',
            marginTop: isMobile ? 24 : 0,
            justifySelf: 'stretch'
          }}>
            [Image Placeholder 600x400]
          </div>
        </div>
      </div>
    </div>
  )
}
