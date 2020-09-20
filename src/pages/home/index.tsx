import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

interface IProps {}

interface IState {
  count: number;
}

class Home extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      count: 0,
    };

    this.handleClick = this.handleClick.bind(this);
  }
  public render() {
    const { count } = this.state;
    return (
      <div>
        <Button onClick={this.handleClick}>Click me</Button>
        <div>{count}</div>
        <div>1231234</div>
      </div>
    );
  }

  public handleClick() {
    const { count } = this.state;
    this.setState({ count: count + 1 });
  }
}

export default Home;
