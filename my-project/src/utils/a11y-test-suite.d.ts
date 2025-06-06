// A11Y Test Suite TypeScript declaration
declare module './utils/a11y-test-suite' {
  export class A11YTestSuite {
    constructor();
    runAllTests(): Promise<{ passed: number; failed: number; total: number }>;
    assert(condition: boolean, message: string): boolean;
    testWidgetPresence(): Promise<void>;
    testWidgetMinimization(): Promise<void>;
    testAuditFunctionality(): Promise<void>;
    testErrorHandling(): Promise<void>;
  }
}

// Add window properties
interface Window {
  runA11YTests: () => Promise<{ passed: number; failed: number; total: number }>;
  runManualA11YAudit: () => Promise<any>;
}
