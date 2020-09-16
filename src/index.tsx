import React from 'react';
import ReactDom from 'react-dom';
import Home from '@src/pages/home';
// import styles from './index.less';

class App extends React.Component {
  render() {
    return <Home />;
  }
}

ReactDom.render(<App />, document.getElementById('root'));
