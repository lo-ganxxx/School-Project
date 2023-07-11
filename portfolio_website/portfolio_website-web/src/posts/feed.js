import {useEffect, useState} from 'react'
import React from 'react' //only worked in a seperate line for unknown reasons

import {apiPostFeed} from './lookup'
import {Post} from './detail'

export function FeedList(props) {
    const [postsInit, setPostsInit] = useState([]) //inital posts
    const [posts, setPosts] = useState([]) //all posts
    const [nextUrl, setNextUrl] = useState([null]) //url for next page of posts
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
            setNextUrl(response.next) //setting next url to next page url from the pagination response
            setPostsInit(response.results) //updates posts list component with response.results (query set items for that page)
            setPostsDidSet(true)
          }
        }
        apiPostFeed(handlePostListLookup)
    }
    }, [setPostsInit, postsDidSet, setPostsDidSet])

    const handleLoadNext = (event) => {
      event.preventDefault()
      if (nextUrl !== null) {
        const handleLoadNextResponse = (response, status) => {
          if (status === 200){
            setNextUrl(response.next) //setting next url to next page url from the pagination response
            const newPosts = [...posts].concat(response.results) //orignal posts with next page's posts on end
            setPostsInit(newPosts) //adding to initial posts (they already existed just werent loaded)
            setPosts(newPosts) //updates posts list component with response.results (query set items for that page)
          }
        }
        apiPostFeed(handleLoadNextResponse, nextUrl)
      }
    }

    return <React.Fragment>{posts.map((item, index)=>{ //iterates through list of posts
      return <Post post={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-${item.id}`} /> //rendering post
    })}
    {nextUrl !== null && <button onClick={handleLoadNext} className='btn btn-outline-primary'>Load more...</button>}
    </React.Fragment>
  }