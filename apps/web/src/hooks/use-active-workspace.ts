'use client';

import { useContext } from 'react';

import { ActiveWorkspaceContext } from '@/components/workspace/active-workspace-provider';
import type { ActiveWorkspaceContextValue } from '@/types/workspace';

export function useActiveWorkspace(): ActiveWorkspaceContextValue {
  const context = useContext(ActiveWorkspaceContext);

  if (context === undefined) {
    throw new Error('useActiveWorkspace must be used within an ActiveWorkspaceProvider');
  }

  return context;
}
