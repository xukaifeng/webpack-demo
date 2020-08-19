import React from 'react';
import ReactDom from 'react-dom';
import { add } from './math';

class App extends React.Component {
  render() {
    console.log(add(1, 5));
    return <div>hello world</div>;
  }
}

ReactDom.render(<App />, document.getElementById('root'));
