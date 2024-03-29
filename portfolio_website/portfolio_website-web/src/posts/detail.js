import {useState, createRef} from 'react'

import {ActionBtn} from './buttons'
import {UserDisplay, UserPicture} from '../profiles'
import {apiPostAction, apiPostReport} from './lookup'

export function Post(props) {
    const {post, miniPost, didComment} = props // This line extracts the post prop from the props object using destructuring assignment. It allows the component to access the post prop directly without having to reference props.post throughout the component.
    const [actionPost, setActionPost] = useState(props.post ? props.post : null)
    const className = props.className ? props.className : 'col-10 max-auto col-md-6' // if the props object has a className prop it will use that, otherwise will use default value
    var path = window.location.pathname //getting pages path
    var idRegex = /(?<postid>\d+)/ //id regular expression
    var match = path.match(idRegex)
    const urlPostId = match ? match.groups.postid : -1
    const isDetail = `${post.id}` === `${urlPostId}`
    const [showCommentForm, setShowCommentForm] = useState(false) //comment form showing or not -- depends if comment button pressed in ActionButton component of action type comment
    const textAreaRef = createRef() //reference for the text area (used to access the value of the text area input)
    const [isReportDisabled, setIsReportDisabled] = useState(false)
    const handleNewComment = (response, status) => {
      if (status === 201) { //if new comment was successfully created
        didComment(response) //triggers handleNewComment callback
      } else {
        console.log(response)
        alert("An error occured, please try again")
      }
    }
    const handleCommentFormRender = () => {
      showCommentForm ? setShowCommentForm(false) : setShowCommentForm(true)
    }
    const handleCommentFormSubmit = (event) => {
      event.preventDefault()
      const newVal = textAreaRef.current.value //the text being submitted (to comment)
      //backend api request
      apiPostAction(post.id, 'comment', handleNewComment, newVal) //apiPostAction with the text areas value being the content of the comment
      textAreaRef.current.value = '' //clear the text box
    }
    const handleLink = (event) => {
      event.preventDefault()
      window.location.href = `/${post.id}` //redirects user to post detail page of the post they clicked on (using the posts id)
    }
    const handleReport = (event) => {
      event.preventDefault()
      apiPostReport(post.id, handleNewReport)
    }
    const handleNewReport = (response, status) => {
      if (status === 200) { //if report was successful
        setIsReportDisabled(true)
      } else {
        console.log(response)
        alert("An error occured, please try again")
      }
    }
    const handlePerformAction = (newActionPost) => {
      setActionPost(newActionPost) //updates component
    }
    
    if (miniPost === true) { //if the post was set as miniPost in props
      return <div class="col-md-4">
    <div class="card mb-4 shadow-sm">
      {/* NO NEED CURRENTLY AS YOU CANNOT UPLOAD IMAGES WITH POSTS YET <img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22348%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20348%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18976484533%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A17pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18976484533%22%3E%3Crect%20width%3D%22348%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22116.71875%22%20y%3D%22120.3%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-holder-rendered="true" /> */}
      <div class="card-body">
        <p class="card-text">{post.content}</p>
        <div class="d-flex justify-content-between align-items-center">
        {actionPost && <div className = 'btn-group'>
            <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "like", display: "Likes"}} className="btn btn-sm btn-outline-secondary"/>
            <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "unlike", display: "Unlike"}} className="btn btn-sm btn-outline-secondary"/>
            {/* <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "comment", display: "Comment"}} className="btn btn-sm btn-outline-secondary"/> causes error because no input - looks weird when adding input box*/}
            <button className="btn btn-sm btn-outline-secondary" onClick={handleLink}>Comment</button>
            {isDetail === true ? null : <button className="btn btn-sm btn-outline-secondary" onClick={handleLink}>View</button>}
          </div>}
          <button type='submit' className='btn btn-sm btn-danger btn-small' disabled={isReportDisabled} onClick={handleReport}>{isReportDisabled ? "Reported" : "Report"}</button>
          {/* <small class="text-muted">{post.user.username}</small> these posts are for the profiles so wont need to be links */}
        </div>
      </div>
    </div>
  </div>
    } else { //normal post rendering otherwise
      return <div className={className}>
      <div className='d-flex'>
        <div className='ms-1'> {/* margin of 1 pixel from start (left) */}
          <UserPicture user={post.user} pictureSize="50px" />
        </div>
        <div className='col-11 ms-1 overflow-wrap-break-word'>
      <p>
        <UserDisplay user={post.user} includeFullName /> {/* will add later that it will not includeFullName if the profile is private possibly? */}
      </p>
      <p>{post.content}</p>
      {actionPost && <div>
        <div className="d-flex justify-content-between align-items-center"> {/* puts content to either sides of the div */}
        <div className = 'btn btn-group px-0'>
        <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "like", display: "Likes"}}/>
        <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "unlike", display: "Unlike"}}/>
        <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "comment", display: "Comment"}} didCommentForm={handleCommentFormRender}/>
        {isDetail === true ? null : <button className='btn btn-outline-primary btn-sm' onClick={handleLink}>View</button>} {/* if isDetail is true it will render nothing (null) otherwise it will render the view button */}
        </div>
        <button type='submit' className='btn btn-danger btn-small' disabled={isReportDisabled} onClick={handleReport}>{isReportDisabled ? "Reported" : "Report"}</button>
        </div>
        {showCommentForm && <form onSubmit={handleCommentFormSubmit}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='comment' maxlength="240">

        </textarea>
        <button type='submit' className='btn btn-secondary btn-small'>Submit</button>
        </form>
        }
      </div>
    }
    </div>
    </div>
    </div>
  }
    }

export function Comment(props) {
  const {comment} = props

  return <div class="d-flex text-body-secondary pt-3">
      {/* <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#007bff"></rect><text x="50%" y="50%" fill="#007bff" dy=".3em">32x32</text></svg> */}
      <div>
      <UserPicture user={comment.user} pictureSize="50px" />
      </div>
      <p class="pb-3 mb-0 small lh-sm border-bottom w-100 ms-1">
      <div class="d-flex justify-content-between">
        <strong class="d-block text-gray-dark"><UserDisplay user={comment.user} /></strong>
        {comment.timestamp}
      </div>
      {comment.content}
      </p>
    </div>
}