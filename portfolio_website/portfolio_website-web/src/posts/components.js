import {createRef, useEffect, useState} from 'react'

import {loadPosts} from '../lookup' //two dots because it needs to go up a level in file directory to look for that component called lookup

export function PostsComponent(props) {
  const textAreaRef = createRef() //reference for the text area
  const [newPosts, setNewPosts] = useState([])
  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value //the text being submitted (to post)
    let tempNewPosts = [...newPosts]
    tempNewPosts.unshift({ //sends this element into the tempNewPosts list (at beginning of list/array) (push -> end of list, unshift -> beginning of list)
      content: newVal,
      likes: 0,
      id: 12313
    })
    setNewPosts(tempNewPosts)
    textAreaRef.current.value = '' //clear the text box
  }
  return <div className={props.className}>
    <div className='col-md-4 mx-auto col-10'>
      <form onSubmit={handleSubmit}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='post'>

        </textarea>
        <button type='submit' className='btn btn-primary my-3'>Post</button>
    </form>
    </div>
  <PostsList newPosts={newPosts}/>
  </div>
}

export function PostsList(props) {
    const [postsInit, setPostsInit] = useState([])
    const [posts, setPosts] = useState([])
    const [postsDidSet, setPostsDidSet] = useState(false)
    useEffect(() => {
      const final = [...props.newPosts].concat(postsInit) //merges the two arrays with newPosts being at the front of the array
      if (final.length !== posts.length) { //if there has been an update (new post)
        setPosts(final) //update posts component (to render new post)
      }
    }, [props.newPosts, posts, postsInit])
    useEffect(() => {
      // do my lookup
      if (postsDidSet === false) {
        const myCallback = (response, status) => {
          if (status === 200){
            setPostsInit(response) //updates posts list component
            setPostsDidSet(true)
          } else {
            alert("There was an error")
          }
        }
        loadPosts(myCallback)
    }
    }, [postsDidSet, setPostsDidSet])
    return posts.map((item, index)=>{ //iterates through list of posts
      return <Post post={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`} /> //rendering post
    })
  }

export function ActionBtn(props) {
    const {post, action} = props //takes the post
    const [likes, setLikes] = useState(post.likes ? post.likes : 0) // const [state, setState] = useState(initialValue)
    // here the (post.likes ? post.likes : 0) is the value to start with, and likes is the current likes value that can be used in the component. The setLikes function can be used to update the likes, triggering a re-render of the component.
    const [userLike, setUserLike] = useState(post.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-primary btn-small'
    const actionDisplay = action.display ? action.display : 'Action' // the display of the button
    const handleClick = (event) => {
      event.preventDefault()
      if (action.type === 'like') {
        if (userLike === true) { //if user has already liked post
          setUserLike(false)
          setLikes(likes - 1) //unlike
        } else { //if user hasnt already liked post
          setUserLike(true)
          setLikes(post.likes + 1) //like
        }
      } 
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay // setting what the button says depending on the type of action set in props
    return <button className={className} onClick={handleClick}>{display}</button> //button with the previously set class and when clicked will trigger the handleClick function
  }
  
export function Post(props) {
    const {post} = props // This line extracts the post prop from the props object using destructuring assignment. It allows the component to access the post prop directly without having to reference props.post throughout the component.
    const className = props.className ? props.className : 'col-10 max-auto col-md-6' // if the props object has a className prop it will use that, otherwise will use default value
    return <div className={className}>
      <p>{post.content} - {post.id}</p>
      <div className = 'btn btn-group'>
        <ActionBtn post={post} action={{type: "like", display: "Likes"}}/>
        <ActionBtn post={post} action={{type: "unlike", display: "Unlike"}}/>
        <ActionBtn post={post} action={{type: "comment", display: "Comment"}}/>
      </div>
    </div>
  }