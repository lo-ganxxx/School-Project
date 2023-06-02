import {useEffect, useState} from 'react'

import {loadPosts} from '../lookup' //two dots because it needs to go up a level in file directory to look for that component called lookup

export function PostsList(props) {
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
    return posts.map((item, index)=>{
      return <Post post={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`} />
    })
  }

export function ActionBtn(props) {
    const {post, action} = props //takes the post
    const className = props.className ? props.className : 'btn btn-primary btn-small'
    return action.type === 'like' ? <button className={className}>{post.likes} Likes</button> : null
  }
  
export function Post(props) {
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