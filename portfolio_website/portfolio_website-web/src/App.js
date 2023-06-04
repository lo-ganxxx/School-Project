import logo from './logo.svg';
import './App.css';

import {PostsList} from './posts'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="https://media.tenor.com/67LIumILNRsAAAAd/ltg-low-tier-god.gif" className="App-logo" alt="logo" />
        <p>
          Welcome to Posted's <code>ReactJS</code> testing page.
        </p>
        <div>
          <PostsList />
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
