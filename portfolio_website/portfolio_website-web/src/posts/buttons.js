import {createRef} from 'react'
import {apiPostAction} from './lookup'

export function ActionBtn(props) {
    const {post, action, didPerformAction, didCommentForm} = props //takes the post
    const likes = post.likes ? post.likes : 0
    const className = props.className ? props.className : 'btn btn-primary btn-small'
    const actionDisplay = action.display ? action.display : 'Action' // the display of the button
    const comment_upload = false //temp for testing
    const textAreaRef = createRef() //reference for the text area (used to access the value of the text area input)

    const handleActionBackendEvent = (response, status) => {
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
    </div>
  }