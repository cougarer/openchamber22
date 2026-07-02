import { isDesktopShell } from '@/lib/desktop';

export type HostedSurface = 'desktop' | 'mobile';

declare global {
  interface Window {
    __OPENCHAMBER_SURFACE__?: HostedSurface;
  }
}

const detectHostedSurface = (): HostedSurface => {
  if (typeof window === 'undefined') return 'desktop';

  const explicitSurface = window.__OPENCHAMBER_SURFACE__;
  if (explicitSurface === 'mobile' || explicitSurface === 'desktop') {
    return explicitSurface;
  }

  const override = new URLSearchParams(window.location.search).get('surface');
  if (override === 'mobile' || override === 'desktop') {
    return override;
  }

  if (isDesktopShell()) return 'desktop';

  return 'desktop';
};

export const isMobileSurfaceRuntime = (): boolean => detectHostedSurface() === 'mobile';
