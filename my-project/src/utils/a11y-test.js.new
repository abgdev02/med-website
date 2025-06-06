// A11y Test Script
// Run this to manually verify accessibility fixes

import { AccessibilityWidgetControl } from './AccessibilityAuditor';

// Find and show critical issues
function testAccessibilityWidget() {
  console.log('%c📋 A11Y Widget Test Suite', 'color: #4285f4; font-size: 16px; font-weight: bold;');
  console.log('%c⚡ Starting accessibility widget verification...', 'color: #34a853;');
  
  // Ensure widget is visible for testing
  AccessibilityWidgetControl.show();
  
  // Wait for the widget to be available
  setTimeout(() => {
    const widget = document.getElementById('accessibility-monitor');
    
    if (!widget) {
      console.error('%c❌ Accessibility widget not found!', 'color: #ea4335; font-weight: bold;');
      createWidget();
      return;
    }
    
    console.log('%c✅ Accessibility widget found', 'color: #34a853;');
    
    // Show widget info
    const widgetStyles = window.getComputedStyle(widget);
    console.log('%c📊 Widget status:', 'color: #4285f4;');
    console.log(`Position: ${widgetStyles.position}, Top: ${widgetStyles.top}, Right: ${widgetStyles.right}`);
    console.log(`Visibility: ${widgetStyles.visibility}, Opacity: ${widgetStyles.opacity}`);
    
    // Simulate a click to trigger a new audit
    console.log('%c🔄 Triggering accessibility audit...', 'color: #fbbc05;');
    const auditButton = document.getElementById('a11y-audit-btn');
    if (auditButton) {
      auditButton.click();
    } else {
      console.error('%c❌ Audit button not found!', 'color: #ea4335;');
    }
    
    // Wait for audit to complete and check results
    setTimeout(() => {
      // Check if score is displayed
      const scoreText = widget.textContent || '';
      const scoreMatch = scoreText.match(/A11y Score: (\d+)\/100/);
      
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1]);
        console.log(`%c📊 Accessibility score: ${score}/100`, 'color: #4285f4; font-weight: bold;');
        
        if (score < 60) {
          console.warn('%c⚠️ Low accessibility score detected', 'color: #ea4335;');
        } else if (score >= 90) {
          console.log('%c🏆 Excellent accessibility score!', 'color: #34a853; font-weight: bold;');
        } else {
          console.log('%c✅ Accessibility score is acceptable', 'color: #34a853;');
        }
      } else {
        console.error('%c❌ Could not determine accessibility score', 'color: #ea4335;');
      }
      
      // Check critical issues
      const criticalMatch = scoreText.match(/(\d+) critical/);
      if (criticalMatch) {
        const criticalCount = parseInt(criticalMatch[1]);
        if (criticalCount === 0) {
          console.log('%c✅ No critical accessibility issues found', 'color: #34a853; font-weight: bold;');
        } else {
          console.warn(`%c⚠️ ${criticalCount} critical accessibility issues detected`, 'color: #ea4335; font-weight: bold;');
        }
      }
      
      // Test widget minimization
      console.log('%c🔍 Testing widget minimization...', 'color: #fbbc05;');
      const minimizeButton = document.getElementById('a11y-minimize-btn');
      if (minimizeButton) {
        minimizeButton.click();
        
        setTimeout(() => {
          const isMinimized = widget.style.transform.includes('translateX(80%)');
          if (isMinimized) {
            console.log('%c✅ Widget minimization works correctly', 'color: #34a853;');
          } else {
            console.warn('%c⚠️ Widget minimization might not be working', 'color: #ea4335;');
          }
          
          // Restore widget to normal state
          minimizeButton.click();
          
          // Final report
          console.log('%c📋 A11Y test complete', 'color: #4285f4; font-size: 16px; font-weight: bold;');
          console.log('To manually toggle the accessibility widget, use:');
          console.log('%cAccessibilityWidgetControl.toggle()', 'background: #f1f3f4; padding: 4px; border-radius: 4px;');
        }, 500);
      } else {
        console.error('%c❌ Minimize button not found!', 'color: #ea4335;');
      }
    }, 2000);
  }, 1000);
}

// Create widget if missing
function createWidget() {
  console.log('%c⚙️ Creating accessibility widget manually...', 'color: #fbbc05;');
  AccessibilityWidgetControl.show();
}

// Export functions
window.testA11y = testAccessibilityWidget;
window.toggleA11yWidget = AccessibilityWidgetControl.toggle;

// Auto-run on load in development mode
if (process.env.NODE_ENV === 'development') {
  setTimeout(testAccessibilityWidget, 2000);
}
