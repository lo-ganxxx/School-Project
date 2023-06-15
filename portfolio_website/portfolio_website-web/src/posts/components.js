import {useState} from 'react'

import {PostsList} from './list'
import {PostCreate} from './create'

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