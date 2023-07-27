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
    const [postCommentCount, setPostCommentCount] = useState([]) //amount of comments on the post - int
    const [commentsInit, setCommentsInit] = useState([]) //inital comments
    const [comments, setComments] = useState([]) //all comments
    const [postDidSet, setPostDidSet] = useState(false) //used to prevent constant lookups
    const {postId} = props
    const [post, setPost] = useState(null)
    const [newComments, setNewComments] = useState([])
    useEffect(() => {
      const final = [...newComments].concat(commentsInit) //merges the two arrays with newComments being at the front of the array
      if (final.length !== comments.length) { //if there has been an update (new comment)
        setComments(final) //update comments component (to render new comment)
      }
    }, [newComments, comments, commentsInit])
    useEffect(() => {
      // do my lookup
      if (postDidSet === false) { // if post has not yet been set
        const handleBackendLookup = (response, status) => { //callback for once the lookup gives a response and status
          if (status === 200){
            // setNextUrl(response.next) //setting next url to next page url from the pagination response
            setPost(response) //sets the post that is being viewed in detail
            setPostCommentCount(response.comment_count) //sets comment count using the value from postserializer
            setCommentsInit(response.comments) //updates comments array with initial comments (gotten from the postserializer response)
            setPostDidSet(true)
          } else {
            alert("There was an error finding your post.")
          }
        }
        apiPostDetail(postId, handleBackendLookup) //do the lookup in order to allow for post to be set
    }
    }, [setCommentsInit, postDidSet, setPostDidSet, postId, setPostCommentCount])

  const handleNewComment = (newComment) => {
    let tempNewComments = [...newComments]
    tempNewComments.unshift(newComment) //sends this new comment into the tempNewComments list (at beginning of list/array) (push -> end of list, unshift -> beginning of list)
    setNewComments(tempNewComments) //updates new comments array
    setPostCommentCount(postCommentCount + 1) //adds one to the rendered comment count
  }

  return post === null ? null : <div>
  <Post post={post} className={props.className} didComment={handleNewComment}/>
  <div class="my-3 p-3 bg-body rounded shadow-sm">
    <h6 class="border-bottom pb-2 mb-0">Comments - {postCommentCount}</h6>
    {/* make it iterate through all the comments on the post and render them all) */}
    {comments.map((item, index)=>{ //iterates through list of comments on the post
      return <Comment comment={item} key={`${index}-${item.id}`} /> //rendering comment
    })}
      {/* it has the comments info from the api look up -> postserializer response includes comments and their info (comments are serialized using commentserializer) */}
    {/* <small class="d-block text-end mt-3">
      <a href="/">Home</a>
    </small> */}
  </div>
  </div>
}