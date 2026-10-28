import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { createAppStore } from '../store';

export function StoreProvider({ children }: PropsWithChildren) {
  const [store] = useState(createAppStore);
  return <Provider store={store}>{children}</Provider>;
}
