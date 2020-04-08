import React from 'react';

export class ContentElementErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (<div>Error rendering content element</div>);
    }

    return this.props.children;
  }
}
