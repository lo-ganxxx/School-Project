import {useEffect, useState} from 'react'

import {PostsList} from './list'
import {PostCreate} from './create'
import {Post} from './detail'
import {apiPostDetail} from './lookup'

export function PostsComponent(props) {
  const [newPosts, setNewPosts] = useState([])
  const canPost = props.canPost === "false" ? false : true
  const handleNewPost = (newPost) => {
    let tempNewPosts = [...newPosts]
    tempNewPosts.unshift(newPost) //sends this element into the tempNewPosts list (at beginning of list/array) (push -> end of list, unshift -> beginning of list)
    setNewPosts(tempNewPosts) //updates new posts array
  }
  return <div className={props.className}>
    {canPost === true && <PostCreate didPost={handleNewPost} className='col-md-4 mx-auto col-10' />}{/* Will only render if canPost is equal to true */}
  <PostsList newPosts={newPosts} {...props} /> {/* passing down props that this component has itself */}
  </div>
}

export function PostDetailComponent(props) {
  const {postId} = props
  const [didLookup, setDidLookup] = useState(false)
  const [post, setPost] = useState(null)
  const handleBackendLookup = (response, status) => {
    if (status === 200) {
      setPost(response)
    } else {
      alert("There was an error finding your post.")
    }
  }
  useEffect(()=>{
    if (didLookup === false) {
      
      apiPostDetail(postId, handleBackendLookup)
      setDidLookup(true)
    }
  }, [postId, didLookup, setDidLookup])

  return post === null ? null : <Post post={post} className={props.className} />
}