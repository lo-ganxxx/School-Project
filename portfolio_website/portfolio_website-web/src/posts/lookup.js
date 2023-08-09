import {backendLookup} from '../lookup'  //two dots because it needs to go up a level in file directory to look for that component called lookup

export function apiPostCreate(newPost, callback) {
    backendLookup("POST", "/posts/create/", callback, {content: newPost})
  }

export function apiPostDetail(postId, callback) {
    backendLookup("GET", `/posts/${postId}/`, callback)
  }

export function apiPostList(username, callback, nextUrl) { // all of one users posts
    let endpoint = "/posts/"
    if (username){
      endpoint = `/posts/?username=${username}` // adding username as a request parameter to endpoint url
    }
    if (nextUrl !== null && nextUrl !== undefined) { // if it is being called to load next page of posts
      endpoint = nextUrl.replace("http://localhost:8000/api", "")
    }
    backendLookup("GET", endpoint, callback)
  }

export function apiPostFeed(callback, nextUrl) { // all posts by the user and users they follow
    let endpoint = "/posts/feed/"
    if (nextUrl !== null && nextUrl !== undefined) {
      endpoint = nextUrl.replace("http://localhost:8000/api", "")
    }
    backendLookup("GET", endpoint, callback)
  }

export function apiPostAction(postId, action, callback, content) {
    const data = {id: postId, action: action, content: content}
    backendLookup("POST", "/posts/action/", callback, data)
  }

export function apiPostReport(postId, callback) {
  backendLookup("POST", "/post/report/", callback, {id: postId})
}