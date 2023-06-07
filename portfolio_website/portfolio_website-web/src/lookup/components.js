function lookup(method, endpoint, callback, data) {
  let jsonData;
  if (data){
    jsonData = JSON.stringify(data)
  }
  const xhr = new XMLHttpRequest() // this is javascript! in python would be something like xhr = SomeClass() -- basically making new instance of a class
    const url = `http://localhost:8000/api${endpoint}` //string substitution 
    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.onload = function() {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function (e) {
      console.log(e)
      callback({"message": "The request was an error"}, 400)
    }
    xhr.send(jsonData)
  }

export function loadPosts(callback) {
    lookup("GET", "/posts/", callback)
  }