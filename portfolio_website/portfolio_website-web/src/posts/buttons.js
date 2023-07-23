import {useState, createRef} from 'react'
import {apiPostAction} from './lookup'

export function ActionBtn(props) {
    const {post, action, didPerformAction, didCommentForm} = props //takes the post
    const likes = post.likes ? post.likes : 0
    //const [likes, setLikes] = useState(post.likes ? post.likes : 0) // const [state, setState] = useState(initialValue)
    // here the (post.likes ? post.likes : 0) is the value to start with, and likes is the current likes value that can be used in the component. The setLikes function can be used to update the likes, triggering a re-render of the component.
    //const [userLike, setUserLike] = useState(post.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-primary btn-small'
    const actionDisplay = action.display ? action.display : 'Action' // the display of the button
    const comment_upload = false //temp for testing
    //button logic
    // const [showUpload, setShowUpload] = useState(false)
    const textAreaRef = createRef() //reference for the text area (used to access the value of the text area input)
    //const {didPost} = props //NEED TO MAKE A WAY TO HANDLE NEW COMMENTS
    // const handleBackendUpdate = (response, status) => { //backend api response handler
    //   if (status === 201) {
    //     didPost(response) //triggers handleNewPost callback
    //   } else {
    //     console.log(response) 
    //     alert("An error occured, please try again")
    //   }
    // }
    // const handleSubmit = (event) => {
    //   event.preventDefault()
    //   const newVal = textAreaRef.current.value //the text being submitted (to post)
    //   //backend api request
    //   apiPostCreate(newVal, handleBackendUpdate) //handleBackendUpdate is a callback function - once the operation of the createPost function is complete and the response is received from the backend, the createPost/lookup function will invoke the callback function handleBackendUpdate and passes the response and status as arguments
    //   textAreaRef.current.value = '' //clear the text box


    const handleActionBackendEvent = (response, status) => {
      console.log(response, status)
      if ((status === 200 || status === 201) && didPerformAction) { //status 200 OR status 201
        didPerformAction(response)
      }
    }

    const handleClick = (event) => {
      event.preventDefault()
      if (action.type === 'comment') {
        //open the comment input box and comment upload button
        didCommentForm()
      } else if (comment_upload === true) {
        //upload the comment
        const newVal = textAreaRef.current.value //the text being submitted (to comment)
        apiPostAction(post.id, 'comment', handleActionBackendEvent, newVal) //apiPostAction with the text areas value being the content of the comment
        textAreaRef.current.value = '' //clear the text box
      } else {
        apiPostAction(post.id, action.type, handleActionBackendEvent)
      }
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay // setting what the button says depending on the type of action set in props
    return <div>
    <button className={className} onClick={handleClick}>{display}</button> {/* button with the previously set class and when clicked will trigger the handleClick function */}
    {/* {showUpload && <div> Will only render if showUpload is equal to true 'col-md-4 mx-auto col-10' */}
      {/* <form onSubmit={handleClick}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='comment'>

        </textarea>
        <button type='submit' className={className}>{display}</button>
    </form>
    </div>} */}
    </div>
  }