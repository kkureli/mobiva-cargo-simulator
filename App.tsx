import React from 'react';
import AppNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/ui/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppNavigator />
    </ErrorBoundary>
  );
}
