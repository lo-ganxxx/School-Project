import {useEffect, useState} from 'react'

import {apiPostList} from './lookup'
import {Post} from './detail'

export function PostsList(props) {
    const [postsInit, setPostsInit] = useState([]) //inital posts
    const [posts, setPosts] = useState([]) //all posts
    const [postsDidSet, setPostsDidSet] = useState(false) //used to prevent constant lookups
    useEffect(() => {
      const final = [...props.newPosts].concat(postsInit) //merges the two arrays with newPosts being at the front of the array
      if (final.length !== posts.length) { //if there has been an update (new post)
        setPosts(final) //update posts component (to render new post)
      }
    }, [props.newPosts, posts, postsInit])
    useEffect(() => {
      // do my lookup
      if (postsDidSet === false) {
        const handlePostListLookup = (response, status) => { //callback for once the lookup gives a response and status
          if (status === 200){
            setPostsInit(response) //updates posts list component
            setPostsDidSet(true)
          } else {
            alert("There was an error")
          }
        }
        apiPostList(props.username, handlePostListLookup)
    }
    }, [setPostsInit, postsDidSet, setPostsDidSet, props.username])
    return posts.map((item, index)=>{ //iterates through list of posts
      return <Post post={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-${item.id}`} /> //rendering post
    })
  }