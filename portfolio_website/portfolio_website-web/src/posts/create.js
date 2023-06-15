import {createRef} from 'react'

import {apiPostCreate} from './lookup'

export function PostCreate(props) {
  const textAreaRef = createRef() //reference for the text area (used to access the value of the text area input)
  const {didPost} = props
  const handleBackendUpdate = (response, status) => { //backend api response handler
    if (status === 201) {
      didPost(response) //triggers handleNewPost callback
    } else {
      console.log(response) 
      alert("An error occured, please try again")
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value //the text being submitted (to post)
    //backend api request
    apiPostCreate(newVal, handleBackendUpdate) //handleBackendUpdate is a callback function - once the operation of the createPost function is complete and the response is received from the backend, the createPost/lookup function will invoke the callback function handleBackendUpdate and passes the response and status as arguments
    textAreaRef.current.value = '' //clear the text box
  }
  return <div className={props.className}> {/* Will only render if canPost is equal to true 'col-md-4 mx-auto col-10' */}
      <form onSubmit={handleSubmit}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='post'>

        </textarea>
        <button type='submit' className='btn btn-primary my-3'>Post</button>
    </form>
    </div>
}