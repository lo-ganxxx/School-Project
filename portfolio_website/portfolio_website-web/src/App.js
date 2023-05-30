import {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [post, setPosts] = useState([])
  useEffect(() => {
    // do my lookup
    const postItems = [{"content": 123}, {"content": "hello world"}]
    setPosts(postItems)
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {postMessage.map((post, index)=>{
            return <li>{post.content}</li>
          })}
        </p>
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
