import {backendLookup} from "../lookup"

export function apiProfileDetail(username, callback) {
    backendLookup("GET", `/profile/${username}/`, callback)
  }

export function apiProfileFollowToggle(username, action, callback) {
    const data = {action: `${action && action}`.toLowerCase()} //if no action is given it will return false -- && evaluates operands from left to right, returning immediately with the first falsy operand it encounters - if all values are truthy the value of the last operand is returned
    backendLookup("POST", `/profile/${username}/follow`, callback, data)
  }

export function apiProfileList(search_query, callback) {
  backendLookup("GET", `/profile/search/${search_query}/`, callback)
}