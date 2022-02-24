import React from 'react';
import ReactDOM from 'react-dom';
import 'react-calendar/dist/Calendar.css'
import './app/layouts/styles.css';
import App from './app/layouts/App';
import reportWebVitals from './reportWebVitals';
import {store, StoreContext} from './app/stores/store'
import { BrowserRouter } from 'react-router-dom';


ReactDOM.render(
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/semantic-ui-react/dist/umd/semantic-ui-react.min.js"></script>
    {/* <script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/dist/semantic.min.css">
    <script src="/dist/semantic.min.js"></script> */}
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </StoreContext.Provider>
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
