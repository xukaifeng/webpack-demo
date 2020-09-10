import React from 'react';
import ReactDom from 'react-dom';
import _ from 'lodash';
import styles from './index.less';

class App extends React.Component {
  render() {
    const test = { a: 1 };
    const temp = _.cloneDeep(test);
    temp.a = 3;
    return <div className={styles.testBox}>hello world</div>;
  }
}

ReactDom.render(<App />, document.getElementById('root'));
