import React from 'react'
import { TabKey } from '../../types'

interface TabButtonProps {
  tabKey: TabKey
  label: string
  isActive: boolean
  isMobile: boolean
  onClick: (tabKey: TabKey) => void
}

export function TabButton({ tabKey, label, isActive, isMobile, onClick }: TabButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick(tabKey)
  }

  return (
    <button 
      onClick={handleClick}
      style={{
        height: isMobile ? 36 : 40, 
        paddingLeft: isMobile ? 20 : 32, 
        paddingRight: isMobile ? 20 : 32, 
        paddingTop: 8, 
        paddingBottom: 8, 
        background: isActive ? '#E8F4FD' : 'transparent',
        borderRadius: 24, 
        border: 'none',
        outline: isActive ? 'none' : '1px #e4e4e4 solid', 
        outlineOffset: '-1px', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 10, 
        display: 'flex',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: 'fit-content',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >
      <div style={{
        justifyContent: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        color: isActive ? '#2A6EBB' : '#6A6A6A', 
        fontSize: isMobile ? 11 : 12, 
        fontFamily: '"Source Sans Pro", sans-serif', 
        fontWeight: isActive ? '700' : '400', 
        textTransform: 'uppercase', 
        letterSpacing: 0.96, 
        wordWrap: 'break-word'
      }}>
        {label}
      </div>
    </button>
  )
}
