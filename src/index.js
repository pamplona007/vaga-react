import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';

// Get database using
// import { db } from '../../util/firebaseUtils'

// db.collection('teste').get()
//     .then(doc => console.log(doc.docs[0].data()))


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);