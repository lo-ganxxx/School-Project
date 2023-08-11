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

    const handleNewComment = (response) => {
      window.location.href = `/${response.post}` //redirects user to post detail page of the post they commented on (using the posts id)
    }

    if (posts.length > 0) {
      return <React.Fragment>{posts.map((item, index)=>{ //iterates through list of posts
        return <Post post={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-${item.id}`} didComment={handleNewComment} /> //rendering post
      })}
      {nextUrl !== null && <button onClick={handleLoadNext} className='btn btn-outline-primary'>Load more...</button>}
      </React.Fragment>
    } else {
      return <div>
      <div class="d-flex justify-content-center p-3 rounded-3 shadow-lg">
            <div>
                  <strong class="d-block">No posts found</strong>
                  <small>To get some posts in your feed, simply follow a profile or make a post yourself</small>
            </div>
      </div>
      <div class="row mb-2 my-2">
    <div class="col-md-6">
      <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div class="col p-4 d-flex flex-column position-static">
          <strong class="d-inline-block mb-2 text-primary-emphasis">Suggested</strong>
          <h3 class="mb-0">Global posts</h3>
          <div class="mb-1 text-body-secondary">Most recent posts from around the globe</div>
          <p class="card-text mb-auto">Gain access to a diverse array of job posts, discussions, and insights from job seekers and employers around the globe. Unearth opportunities that align with your aspirations and meet all kinds of new people.</p>
          <a href="/global/" class="icon-link gap-1 icon-link-hover stretched-link">
            Browse global posts
          </a>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div class="col p-4 d-flex flex-column position-static">
          <strong class="d-inline-block mb-2 text-primary-emphasis">Suggested</strong>
          <h3 class="mb-0">Popular profiles</h3>
          <div class="mb-1 text-body-secondary">The top followed profiles on Posted</div>
          <p class="mb-auto">Unlock access to profiles of industry experts, thought leaders, and trailblazers who are making waves in their respective fields. Gain insights from their experiences and learn from the best.</p>
          <a href="/profile/logan/" class="icon-link gap-1 icon-link-hover stretched-link">
            Browse popular profiles
          </a>
        </div>
      </div>
    </div>
  </div>
      </div>
    }
  }