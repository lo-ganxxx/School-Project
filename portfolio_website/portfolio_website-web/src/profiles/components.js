import React from 'react'

export function UserLink(props) { // will return link to users profile
  const {username} = props
  const handleUserLink = (event) => {
    window.location.href = `/profile/${username}` //redirects user to profile page of the user they clicked on (using the username) -- doesnt need an event.preventDefault() because it is not a button
  }
  return <div className='pointer' onClick={handleUserLink}> {/* className of 'pointer' is used to reference the pointer class defined in the index.css stylesheet -- In React, practical CSS styles are applied through the className property*/}
    {props.children} {/* renders the content included between the opening and closing tags when invoking the component */}
  </div>
}

export function UserDisplay(props) { // will return render for username and name
  const {user, includeFullName} = props
  const nameDisplay = includeFullName === true ? `${user.first_name} ${user.last_name}` : null // only display full name if it is set to true

  return <React.Fragment>
    {nameDisplay}
    <UserLink username={user.username}>@{user.username}</UserLink>
  </React.Fragment>
}

export function UserPicture(props) { // will return users profile picture
  const {user} = props
  return <UserLink username={user.username}><span className='mx-1 px-3 py-2 rounded-circle bg-dark text-white'>
    {user.username[0]}
    </span></UserLink>
}