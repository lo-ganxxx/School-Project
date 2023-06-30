import {backendLookup} from '../lookup'  //two dots because it needs to go up a level in file directory to look for that component called lookup

export function apiPostCreate(newPost, callback) {
    backendLookup("POST", "/posts/create/", callback, {content: newPost})
  }

export function apiPostDetail(postId, callback) {
    backendLookup("GET", `/posts/${postId}/`, callback)
  }

export function apiPostList(username, callback, nextUrl) {
    let endpoint = "/posts/"
    if (username){
      endpoint = `/posts/?username=${username}` // adding username as a request parameter to endpoint url
    }
    if (nextUrl !== null && nextUrl !== undefined) {
      endpoint = nextUrl.replace("http://localhost:8000/api", "")
    }
    backendLookup("GET", endpoint, callback)
  }

export function apiPostAction(postId, action, callback) {
    const data = {id: postId, action: action}
    backendLookup("POST", "/posts/action/", callback, data)
  }