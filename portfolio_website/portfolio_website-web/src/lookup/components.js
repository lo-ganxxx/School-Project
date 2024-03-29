function getCookie(name) { //for csrf token cookie
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

export function backendLookup(method, endpoint, callback, data) {
  let jsonData;
  if (data){
    jsonData = JSON.stringify(data)
  }
  const xhr = new XMLHttpRequest() // this is javascript! in python would be something like xhr = SomeClass() -- basically making new instance of a class
  const url = `http://localhost:8000/api${endpoint}` //string substitution 
  xhr.responseType = "json"
  xhr.open(method, url)
  xhr.setRequestHeader("Content-Type", "application/json")
  if (csrftoken){
    //xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    xhr.setRequestHeader("X-CSRFToken", csrftoken)
  }
  xhr.onload = function() {
    if (xhr.status === 403 ) { //if user is trying to do a backend lookup that requires authentication and their authentication credentials were not provided
      const detail = xhr.response.detail
      if (detail === "Authentication credentials were not provided.") {
        if (window.location.href.indexOf("login") === -1) { // if "login" is not in the current pages url -- indexOf checks if the url contains the given string, if it is not in the url at all it will return -1
          const next_url = window.location.pathname  //.substring(1) //relative path of the current URL (without domain etc) substring removes the forward slash at start to avoid errors
          window.location.href = "/login/?next=" + next_url //redirect user to login page with next url set as a query parameter
        }
      }
    }
    callback(xhr.response, xhr.status) //invoking the callback function and setting its arguments
  }
  xhr.onerror = function (e) {
    console.log(e)
    callback({"message": "The request was an error"}, 400)
  }
  xhr.send(jsonData) //sends the request (with data if it has any)
}