import {backendLookup} from '../lookup'  //two dots because it needs to go up a level in file directory to look for that component called lookup

export function apiPostCreate(newPost, callback) {
    backendLookup("POST", "/posts/create/", callback, {content: newPost})
  }
  
export function apiPostList(callback) {
    backendLookup("GET", "/posts/", callback)
  }

export function apiPostAction(postId, action, callback) {
    const data = {id: postId, action: action}
    backendLookup("POST", "/posts/action/", callback, data)
  }