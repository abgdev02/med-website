// A11y test script declaration file
declare module './utils/a11y-test' {
  export function testAccessibilityWidget(): void;
}

// Add window property
interface Window {
  testA11y: () => void;
}
