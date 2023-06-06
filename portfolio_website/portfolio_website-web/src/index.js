import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {PostsComponent} from './posts';

// const appEl = document.getElementById('root')
// if (appEl) {
//   ReactDOM.render(<App />, appEl);
// }
// const postsEl = document.getElementById("posted")
// if (postsEl) {
//   ReactDOM.render(<PostsComponent />, postsEl);
// }

const appEl = document.getElementById('root')
if (appEl) {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

const postsEl = document.getElementById('posted')
if (postsEl) {
  const posted = ReactDOM.createRoot(document.getElementById('posted'))
  posted.render(
    <React.StrictMode>
      <PostsComponent />
    </React.StrictMode>
  );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
