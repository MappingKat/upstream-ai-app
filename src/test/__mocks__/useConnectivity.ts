// Mock for useConnectivity hook in tests
export function useConnectivity() {
  return {
    status: 'online' as const,
    queuedCount: 0,
    lastSyncLabel: null,
    retrySync: jest.fn(),
  };
}
