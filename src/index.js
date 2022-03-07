import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Base from './components/base/base';
import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(<Base />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about servie workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
