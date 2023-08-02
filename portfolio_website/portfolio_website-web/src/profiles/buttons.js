import React from "react"

export function FollowBtn(props) {
    const {user, didFollowToggle, profileLoading} = props
    let currentVerb = (user && user.is_following) ? "Unfollow" : "Follow"
    currentVerb = profileLoading ? "Loading..." : currentVerb

    const handleFollowToggle = (event) => {
        event.preventDefault()
        if (didFollowToggle && !profileLoading) { //if a didFollowToggle function is set and if the profile is not loading
            didFollowToggle(currentVerb) //trigger the didFollowToggle and pass down the currentVerb (is the action following/unfollowing)
        }
    }

    return <React.Fragment>
    {user.can_be_followed === "follow" ? <button className='btn btn-secondary' onClick={handleFollowToggle}>{currentVerb}</button> : //if get_can_be_followed returns "follow" (user is followable)
    user.can_be_followed === "edit" ? <a className='btn btn-secondary' href='/profile/edit'>Edit profile</a> ://if get_can_be_followed returns "edit" (the profile is the requests user's)
    null} {/* error or not authenticated */}
    </React.Fragment>
}