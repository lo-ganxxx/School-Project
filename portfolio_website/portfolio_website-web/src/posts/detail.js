import {useState} from 'react'

import {ActionBtn} from './buttons'

import {UserDisplay, UserPicture} from '../profiles'

export function Post(props) {
    const {post} = props // This line extracts the post prop from the props object using destructuring assignment. It allows the component to access the post prop directly without having to reference props.post throughout the component.
    const [actionPost, setActionPost] = useState(props.post ? props.post : null)
    const className = props.className ? props.className : 'col-10 max-auto col-md-6' // if the props object has a className prop it will use that, otherwise will use default value
    var path = window.location.pathname //getting pages path
    var idRegex = /(?<postid>\d+)/ //id regular expression
    var match = path.match(idRegex)
    const urlPostId = match ? match.groups.postid : -1
    const isDetail = `${post.id}` === `${urlPostId}`
    const handleLink = (event) => {
      event.preventDefault()
      window.location.href = `/${post.id}` //redirects user to post detail page of the post they clicked on (using the posts id)
    }
    const handlePerformAction = (newActionPost) => {
      setActionPost(newActionPost) //updates component
    }
    
    return <div className={className}>
      <div className='d-flex'>
        <div className=''>
          <UserPicture user={post.user} />
        </div>
        <div className='col-11'>
      <p>
        <UserDisplay user={post.user} includeFullName /> {/* will add later that it will not includeFullName if the profile is private possibly? */}
      </p>
      <p>{post.content} - {post.id}</p>
      {actionPost && <div className = 'btn btn-group px-0'>
        <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "like", display: "Likes"}}/>
        <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "unlike", display: "Unlike"}}/>
        <ActionBtn post={actionPost} didPerformAction={handlePerformAction} action={{type: "comment", display: "Comment"}}/>
        {isDetail === true ? null : <button className='btn btn-outline-primary btn-sm' onClick={handleLink}>View</button>} {/* if isDetail is true it will render nothing (null) otherwise it will render the view button */}
      </div>
    }
    </div>
    </div>
    </div>
  }