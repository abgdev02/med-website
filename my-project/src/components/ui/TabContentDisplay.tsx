import { TabContent } from '../../types'

interface TabContentDisplayProps {
  content: TabContent
  isMobile: boolean
}

export function TabContentDisplay({ content, isMobile }: TabContentDisplayProps) {
  return (
    <div style={{
      width: '100%', 
      maxWidth: '100%',
      justifyContent: 'flex-start', 
      alignItems: 'flex-start', 
      gap: isMobile ? 40 : 128, 
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      <div style={{
        width: isMobile ? '100%' : '45%', 
        maxWidth: isMobile ? '100%' : 484,
        alignSelf: 'stretch',
        paddingTop: 24, 
        paddingBottom: 24, 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        gap: 40, 
        display: 'flex',
        transition: 'all 0.3s ease',
        opacity: 1
      }}>
        {/* Main title */}
        <div style={{
          justifyContent: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          color: '#6A6A6A', 
          fontSize: 14, 
          fontFamily: '"Source Sans Pro", sans-serif', 
          fontWeight: '400', 
          wordWrap: 'break-word',
          transition: 'all 0.3s ease'
        }}>
          {content.title}
        </div>
        
        {/* Icon placeholders */}
        <div style={{width: 12, height: 12, borderRadius: 9999, border: '1px #4A4A4A solid'}} />
        <div style={{width: 24, height: 24, borderRadius: 9999, border: '0.50px #D2D2D2 solid'}} />
        <div style={{width: '100%', height: 0, outline: '0.50px #D2D2D2 solid', outlineOffset: '-0.25px'}}></div>
        
        {/* First feature */}
        <div style={{
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: 24, 
          display: 'flex',
          transition: 'all 0.3s ease'
        }}>
          <div style={{width: 24, height: 24, backgroundColor: '#f0f0f0', borderRadius: '50%'}} />
          <div style={{
            justifyContent: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            color: '#6A6A6A', 
            fontSize: 14, 
            fontFamily: '"Source Sans Pro", sans-serif', 
            fontWeight: '400', 
            wordWrap: 'break-word',
            transition: 'all 0.3s ease'
          }}>
            {content.features[0]}
          </div>
        </div>
        
        <div style={{width: '100%', height: 0, outline: '0.50px #D2D2D2 solid', outlineOffset: '-0.25px'}}></div>
        
        {/* Main highlighted feature with description */}
        <div style={{
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'flex-start', 
          gap: 24, 
          display: 'flex',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            justifyContent: 'flex-start', 
            alignItems: 'center', 
            gap: 24, 
            display: 'flex'
          }}>
            <div style={{width: 24, height: 24, backgroundColor: '#f0f0f0', borderRadius: '50%'}} />
            <div style={{
              justifyContent: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              color: '#4A4A4A', 
              fontSize: 14, 
              fontFamily: '"Source Sans Pro", sans-serif', 
              fontWeight: '700', 
              wordWrap: 'break-word',
              transition: 'all 0.3s ease'
            }}>
              {content.features[1]}
            </div>
          </div>
          <div style={{
            width: '100%', 
            justifyContent: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            color: '#4A4A4A', 
            fontSize: 14, 
            fontFamily: '"Source Sans Pro", sans-serif', 
            fontWeight: '400', 
            wordWrap: 'break-word',
            transition: 'all 0.3s ease'
          }}>
            {content.description}
          </div>
        </div>
      </div>

      <div style={{
        width: isMobile ? '100%' : '50%', 
        maxWidth: isMobile ? '100%' : 600,
        height: isMobile ? 250 : 400, 
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px',
        fontFamily: '"Source Sans Pro", sans-serif'
      }}>
        [Image Placeholder 600x400]
      </div>
    </div>
  )
}
