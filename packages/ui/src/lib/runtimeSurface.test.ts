import { describe, expect, test } from 'bun:test';

describe('runtimeSurface', () => {
  test('defaults phone browsers to desktop surface unless explicitly overridden', async () => {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

    try {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: {
          innerWidth: 390,
          screen: { width: 390 },
          location: { search: '' },
          matchMedia: () => ({ matches: true }),
        },
      });
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: { maxTouchPoints: 5 },
      });

      const { isMobileSurfaceRuntime } = await import('./runtimeSurface');
      expect(isMobileSurfaceRuntime()).toBe(false);
    } finally {
      if (previousWindow) {
        Object.defineProperty(globalThis, 'window', previousWindow);
      } else {
        Reflect.deleteProperty(globalThis, 'window');
      }
      if (previousNavigator) {
        Object.defineProperty(globalThis, 'navigator', previousNavigator);
      } else {
        Reflect.deleteProperty(globalThis, 'navigator');
      }
    }
  });

  test('honors explicit mobile surface override', async () => {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

    try {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: {
          location: { search: '?surface=mobile' },
        },
      });

      const { isMobileSurfaceRuntime } = await import('./runtimeSurface');
      expect(isMobileSurfaceRuntime()).toBe(true);
    } finally {
      if (previousWindow) {
        Object.defineProperty(globalThis, 'window', previousWindow);
      } else {
        Reflect.deleteProperty(globalThis, 'window');
      }
    }
  });
});
