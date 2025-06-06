// A11Y Comprehensive Test Suite
// Run this file to validate all accessibility fixes

/**
 * Comprehensive accessibility test suite that validates:
 * 1. A11Y widget functionality
 * 2. Scoring algorithm accuracy
 * 3. Detection mechanism improvements
 * 4. Error handling robustness
 */

// Configuration
const TEST_CONFIG = {
  widgetTimeout: 2000,   // Time to wait for widget to initialize
  auditTimeout: 3000,    // Time to wait for audit to complete
  minimizeTimeout: 500,  // Time to wait for minimize transition
  targetScore: 70,       // Minimum acceptable score
  maxCriticalIssues: 2,  // Maximum acceptable critical issues
};

// Test suite
class A11YTestSuite {
  constructor() {
    this.testsRun = 0;
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.startTime = performance.now();
  }

  // Run all tests
  async runAllTests() {
    console.group('%c🔍 A11Y Comprehensive Test Suite', 'color: #4285f4; font-size: 16px; font-weight: bold;');
    console.log('%c⚡ Starting comprehensive accessibility tests...', 'color: #34a853;');
    
    await this.testWidgetPresence();
    await this.testWidgetMinimization();
    await this.testAuditFunctionality();
    await this.testErrorHandling();
    
    // Print summary
    const duration = ((performance.now() - this.startTime) / 1000).toFixed(2);
    console.log('%c📊 Test Summary:', 'color: #4285f4; font-size: 14px; font-weight: bold;');
    console.log(`Tests: ${this.testsRun}, Passed: ${this.testsPassed}, Failed: ${this.testsFailed}`);
    console.log(`Duration: ${duration}s`);
    
    if (this.testsFailed === 0) {
      console.log('%c✅ All tests passed! Accessibility fixes verified.', 'color: #34a853; font-size: 14px; font-weight: bold;');
    } else {
      console.warn('%c⚠️ Some tests failed. See details above.', 'color: #ea4335; font-size: 14px; font-weight: bold;');
    }
    
    console.groupEnd();
    return { passed: this.testsPassed, failed: this.testsFailed, total: this.testsRun };
  }

  // Helper to assert conditions
  assert(condition, message) {
    this.testsRun++;
    if (condition) {
      console.log(`%c✓ ${message}`, 'color: #34a853;');
      this.testsPassed++;
      return true;
    } else {
      console.error(`%c✗ ${message}`, 'color: #ea4335;');
      this.testsFailed++;
      return false;
    }
  }

  // Test 1: Widget Presence
  async testWidgetPresence() {
    console.group('%c🧪 Test: Widget Presence', 'color: #4285f4;');
    
    // Wait for widget to be present
    await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.widgetTimeout));
    
    const widget = document.getElementById('accessibility-monitor');
    this.assert(widget !== null, 'Accessibility widget is present');
    
    if (widget) {
      const widgetStyles = window.getComputedStyle(widget);
      this.assert(widgetStyles.display !== 'none', 'Widget is visible');
      this.assert(widgetStyles.position === 'fixed', 'Widget has fixed position');
      this.assert(parseFloat(widgetStyles.opacity) > 0, 'Widget has non-zero opacity');
    }
    
    console.groupEnd();
  }

  // Test 2: Widget Minimization
  async testWidgetMinimization() {
    console.group('%c🧪 Test: Widget Minimization', 'color: #4285f4;');
    
    const widget = document.getElementById('accessibility-monitor');
    if (!widget) {
      this.assert(false, 'Widget not found for minimization test');
      console.groupEnd();
      return;
    }
    
    // Test double-click minimization
    const initialTransform = widget.style.transform;
    
    // Trigger double-click
    const dblClickEvent = new MouseEvent('dblclick', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    widget.dispatchEvent(dblClickEvent);
    
    // Wait for transition
    await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.minimizeTimeout));
    
    // Check if minimized
    const minimizedTransform = widget.style.transform;
    this.assert(
      minimizedTransform.includes('translateX') && 
      initialTransform !== minimizedTransform,
      'Widget can be minimized with double-click'
    );
    
    // Restore to normal state
    widget.dispatchEvent(dblClickEvent);
    
    // Wait for transition
    await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.minimizeTimeout));
    
    // Check if restored
    const restoredTransform = widget.style.transform;
    this.assert(
      restoredTransform === initialTransform || 
      restoredTransform === '' || 
      restoredTransform === 'translateX(0px)' ||
      restoredTransform === 'translateX(0%)',
      'Widget can be restored from minimized state'
    );
    
    console.groupEnd();
  }

  // Test 3: Audit Functionality
  async testAuditFunctionality() {
    console.group('%c🧪 Test: Audit Functionality', 'color: #4285f4;');
    
    const widget = document.getElementById('accessibility-monitor');
    if (!widget) {
      this.assert(false, 'Widget not found for audit functionality test');
      console.groupEnd();
      return;
    }
    
    // Click to trigger audit
    widget.click();
    
    // Wait for audit to complete
    await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.auditTimeout));
    
    // Check score and issues
    const scoreText = widget.textContent || '';
    const scoreMatch = scoreText.match(/A11y Score: (\d+)\/100/);
    
    if (this.assert(scoreMatch !== null, 'Widget displays accessibility score')) {
      const score = parseInt(scoreMatch[1]);
      this.assert(
        !isNaN(score) && score >= TEST_CONFIG.targetScore,
        `Score (${score}) meets minimum target (${TEST_CONFIG.targetScore})`
      );
    }
    
    // Check for critical issues
    const criticalMatch = scoreText.match(/(\d+) critical/);
    if (this.assert(criticalMatch !== null, 'Widget displays critical issue count')) {
      const criticalCount = parseInt(criticalMatch[1]);
      this.assert(
        criticalCount <= TEST_CONFIG.maxCriticalIssues,
        `Critical issues (${criticalCount}) below maximum (${TEST_CONFIG.maxCriticalIssues})`
      );
    }
    
    console.groupEnd();
  }

  // Test 4: Error Handling
  async testErrorHandling() {
    console.group('%c🧪 Test: Error Handling', 'color: #4285f4;');
    
    // Test error handling in AccessibilityAuditor
    try {
      const report = await window.runManualA11YAudit();
      
      this.assert(report !== null, 'Audit function returns a report');
      
      if (report) {
        this.assert(typeof report.score === 'number', 'Report contains a numeric score');
        this.assert(Array.isArray(report.issues), 'Report contains issues array');
      }
    } catch (error) {
      this.assert(false, `Audit function threw an error: ${error.message}`);
      console.error(error);
    }
    
    console.groupEnd();
  }
}

// Set up global test access
window.runA11YTests = async () => {
  const testSuite = new A11YTestSuite();
  return await testSuite.runAllTests();
};

// Set up manual audit function for testing
window.runManualA11YAudit = async () => {
  try {
    const { runAccessibilityAudit } = await import('./AccessibilityAuditor');
    return await runAccessibilityAudit();
  } catch (error) {
    console.error('Error running manual audit:', error);
    return null;
  }
};

// Run tests automatically after a delay
setTimeout(() => {
  console.log('%c🚀 Running A11Y test suite...', 'color: #fbbc05;');
  window.runA11YTests();
}, 3000);

// Export for module usage
export { A11YTestSuite };
