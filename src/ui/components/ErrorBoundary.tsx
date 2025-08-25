import React from 'react';
import { View, Text, Button } from 'react-native';

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  state: State = { hasError: false, message: undefined };

  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: String(err?.message || err) };
  }

  componentDidCatch(err: any) {}

  reset = () => this.setState({ hasError: false, message: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>
            Render Error
          </Text>
          <Text style={{ marginBottom: 12 }}>{this.state.message}</Text>
          <Button title="Try again" onPress={this.reset} />
        </View>
      );
    }
    return this.props.children;
  }
}
