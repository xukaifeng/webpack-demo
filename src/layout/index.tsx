import React from 'react';

class BasicLayout extends React.Component<any, any> {
  public render() {
    return <div>{this.props.children}</div>;
  }
}

export default BasicLayout;
