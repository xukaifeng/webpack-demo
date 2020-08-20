import React from 'react';
import ReactDom from 'react-dom';
import { add } from './math';
import _ from 'lodash';

class App extends React.Component {
  render() {
    const test = { a: 1 };
    const temp = _.cloneDeep(test);
    temp.a = 3;
    console.log(test, temp);
    console.log(add(1, 8));
    return <div>hello world</div>;
  }
}

ReactDom.render(<App />, document.getElementById('root'));
