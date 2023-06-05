import logo from './logo.svg';
import './App.css';

import {PostsComponent, PostsList} from './posts'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="https://swingsearch.com/wp-content/uploads/2020/02/cropped-logo-new-p.png" className="App-logo" alt="logo" />
        <p>
          Welcome to Posted's <code>ReactJS</code> testing page.
        </p>
        <div>
          <PostsComponent />
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
