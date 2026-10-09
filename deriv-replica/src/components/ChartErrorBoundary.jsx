import React from 'react';

// The SmartCharts bundle mounts a Flutter view; tearing that down and mounting
// a second one in the same session can throw. Without a boundary the throw
// unmounts the whole app (a theme toggle blanks the page), so a chart fault is
// contained here and the caller falls back to the SVG chart instead.
export default class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Surface it once so a real regression is still visible in the console.
    console.error('SmartChart failed, falling back to SVG chart:', error);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
