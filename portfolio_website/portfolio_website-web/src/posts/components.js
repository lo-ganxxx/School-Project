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
    {/* make it iterate through all the comments on the post and render them all (or only the first i.e. 20 -> pagination?) */}
    {post.comments.map((item, index)=>{ //iterates through list of posts
      return <Comment comment={item} key={`${index}-${item.id}`} /> //rendering post - render in miniPost form if it is truthy
    })}
    <div class="d-flex text-body-secondary pt-3">
      <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#e83e8c"></rect><text x="50%" y="50%" fill="#e83e8c" dy=".3em">32x32</text></svg>
      <p class="pb-3 mb-0 small lh-sm border-bottom">
        <strong class="d-block text-gray-dark">@username</strong>
        Some more representative placeholder content, related to this other user. Another status update, perhaps.
      </p>
    </div>
    <div class="d-flex text-body-secondary pt-3">
      <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#6f42c1"></rect><text x="50%" y="50%" fill="#6f42c1" dy=".3em">32x32</text></svg>
      <p class="pb-3 mb-0 small lh-sm border-bottom">
        <strong class="d-block text-gray-dark">@username</strong>
        This user also gets some representative placeholder content. Maybe they did something interesting, and you really want to highlight this in the recent updates.
      </p>
    </div>
    <small class="d-block text-end mt-3">
      <a href="https://getbootstrap.com/docs/5.3/examples/offcanvas-navbar/#">All updates</a>
    </small>
  </div>
  </div>
  //return comments here too?  it has the comments info from the api look up -> serializer response includes comments
}