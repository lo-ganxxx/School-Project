import {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function loadPosts(callback) {
  const xhr = new XMLHttpRequest() // this is javascript! in python would be something like xhr = SomeClass() -- basically making new instance of a class
  const method = 'GET' // as opposed to a POST method
  const url = "http://localhost:8000/api/posts/"
  const responseType = "json"

  xhr.responseType = responseType
  xhr.open(method, url)
  xhr.onload = function() {
      callback(xhr.response, xhr.status)
  }
  xhr.onerror = function (e) {
    console.log(e)
    callback({"message": "The request was an error"}, 400)
  }
  xhr.send()
}

function ActionBtn(props) {
  const {post, action} = props //takes the post
  const className = props.className ? props.className : 'btn btn-primary btn-small'
  return action === 'like' ? <button className={className}>{post.likes} Likes</button> : null
}

function Post(props) {
  const {post} = props // This line extracts the post prop from the props object using destructuring assignment. It allows the component to access the post prop directly without having to reference props.post throughout the component.
  const className = props.className ? props.className : 'col-10 max-auto col-md-6' // if the props object has a className prop it will use that, otherwise will use default value
  return <div className={className}>
    <p>{post.content} - {post.id}</p>
    <div className = 'btn btn-group'>
      <ActionBtn post={post} action={{type: "like"}}/>
      <ActionBtn post={post} action={{type: "unlike"}}/>
      <ActionBtn post={post} action={{type: "comment"}}/>
    </div>
  </div>
}

function App() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    // do my lookup
    const myCallback = (response, status) => {
      if (status === 200){
        setPosts(response)
      } else {
        alert("There was an error")
      }
    }
    loadPosts(myCallback)
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {posts.map((item, index)=>{
            return <Post post={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`} />
          })}
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
