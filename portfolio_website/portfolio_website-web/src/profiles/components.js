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
  const {user, includeFullName, hideLink} = props
  const nameDisplay = includeFullName === true ? `${user.first_name} ${user.last_name} ` : null // only display full name if it is set to true

  return <React.Fragment>
    {nameDisplay}
    {hideLink === true ? `@${user.username}` : <UserLink username={user.username}>@{user.username}</UserLink>}
  </React.Fragment>
}

export function UserPicture(props) { // will return users profile picture
  const {user, hideLink, pictureSize} = props
  const fontSize = `calc(${parseInt(pictureSize, 10) / 4}px + 10px)` //calculating size of font so that it fits in the circle
  // if the user has a profile picture set, the contents of the profile picture area will be that
  const pictureContents = user.picture ? <img src={user.picture} alt={user.username} style={{  width: pictureSize, //alt is for screen readers/text browsers, style is css attributes for the image (make its a circle of 150x150)
    height: pictureSize, //uses size set in props
    overflow: "hidden",
    borderRadius: "50%",
    objectFit: "cover"}} /> : <span className='mx-1 px-3 py-2 rounded-circle bg-dark text-white' style={{
      width: pictureSize,
      height: pictureSize,
      fontSize: fontSize, //font size that was calculated depending on picture size
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>{user.username[0]}</span> // otherwise will be the first character of the username
  //if users dont want to upload picture, add option to customize colour of circle? i.e. bg-success, bg-warning
  //if user has picture it will be their picture, otherwise just a character
  return hideLink === true ? pictureContents : <UserLink username={user.username}>{pictureContents}</UserLink> 
}