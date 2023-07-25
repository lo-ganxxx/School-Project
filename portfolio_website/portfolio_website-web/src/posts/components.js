import {useEffect, useState} from 'react'

import {PostsList} from './list'
import {FeedList} from './feed'
import {PostCreate} from './create'
import {Post, Comment} from './detail'
import {apiPostDetail} from './lookup'

export function FeedComponent(props) {
  const [newPosts, setNewPosts] = useState([])
  const canPost = props.canPost === "false" ? false : true
  const handleNewPost = (newPost) => {
    let tempNewPosts = [...newPosts]
    tempNewPosts.unshift(newPost) //sends this element into the tempNewPosts list (at beginning of list/array) (push -> end of list, unshift -> beginning of list)
    setNewPosts(tempNewPosts) //updates new posts array
  }
  return <div className={props.className}>
    {canPost === true && <PostCreate didPost={handleNewPost} className='col-md-4 mx-auto col-10' />}{/* Will only render if canPost is equal to true */}
  <FeedList newPosts={newPosts} {...props} /> {/* passing down props that this component has itself */}
  </div>
}

export function PostsComponent(props) {
  const [newPosts, setNewPosts] = useState([])
  const canPost = props.canPost === "false" ? false : true
  // const miniPost = props.miniPost === "true" ? true : false
  const handleNewPost = (newPost) => {
    let tempNewPosts = [...newPosts]
    tempNewPosts.unshift(newPost) //sends this element into the tempNewPosts list (at beginning of list/array) (push -> end of list, unshift -> beginning of list)
    setNewPosts(tempNewPosts) //updates new posts array
  }
  return <div className={props.className}>
    {canPost === true && <PostCreate didPost={handleNewPost} className='col-md-4 mx-auto col-10' />}{/* Will only render if canPost is equal to true */}
    <div class="album py-5 bg-light">
        <div class="container">

          <div class="row">
            <PostsList newPosts={newPosts} {...props} /> {/* passing down props that this component has itself */}
            </div>
            </div>
            </div>
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

  return post === null ? null : <div>
  <Post post={post} className={props.className} />
  <div class="my-3 p-3 bg-body rounded shadow-sm">
    <h6 class="border-bottom pb-2 mb-0">Comments</h6>
    {/* make it iterate through all the comments on the post and render them all) */}
    {post.comments.map((item, index)=>{ //iterates through list of comments on the post
      return <Comment comment={item} key={`${index}-${item.id}`} /> //rendering comment
    })}
      {/* it has the comments info from the api look up -> postserializer response includes comments and their info (comments are serializer using commentserializer) */}
    {/* <small class="d-block text-end mt-3">
      <a href="/">Home</a>
    </small> */}
  </div>
  </div>
}