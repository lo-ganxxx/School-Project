import React from 'react'
import {useEffect, useState} from 'react'

import {apiProfileDetail, apiProfileFollowToggle} from './lookup'
import {UserDisplay, UserPicture} from './components'
import {DisplayCount} from './utils'

function ProfileBadge(props) {
    const {user, didFollowToggle, profileLoading} = props
    let currentVerb = (user && user.is_following) ? "Unfollow" : "Follow"
    currentVerb = profileLoading ? "Loading..." : currentVerb
    const handleFollowToggle = (event) => {
        event.preventDefault()
        if (didFollowToggle && !profileLoading) { //if a didFollowToggle function is set and if the profile is not loading
            didFollowToggle(currentVerb) //trigger the didFollowToggle and pass down the currentVerb (is the action following/unfollowing)
        }
    }
     return user ? <div> {/* redesigned using bootstrap classes */}
        <span class="badge d-flex align-items-center text-dark-emphasis bg-primary-subtle border border-dark-subtle rounded-pill">
                <UserPicture user={user} hideLink pictureSize="150px"/>
        </span>
        <div class="row dropdown-menu d-block position-static mx-0 border-0 shadow w-220px">
            <h2>
            <div class="col d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <UserDisplay user={user} hideLink />
            </div>
            <div class="col d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <button className='btn btn-secondary' onClick={handleFollowToggle}>{currentVerb}</button>
            </div>
            </h2>
            <hr class="dropdown-divider"></hr>
            <div class="col dropdown-item d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <b><DisplayCount>{user.post_count}</DisplayCount></b> {user.post_count === 1 ? "post" : "posts"}
            </div>
            <div class="col dropdown-item d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <b><DisplayCount>{user.follower_count}</DisplayCount></b> {user.following_count === 1 ? "follower" : "followers"} {/* on click use modular to show list of followers? */}
            </div>
            <div class="col dropdown-item d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <b><DisplayCount>{user.following_count}</DisplayCount></b> following
            </div>
            <hr class="dropdown-divider"></hr>
            <p><b>Full Name: </b>{user.first_name} {user.last_name}</p>
            <p><b>Location: </b>{user.location}</p>
            <p><b>Bio: </b>{user.bio}</p>
        </div>
   </div> : null
   }
        // <div> {/* ugly display, needs to be redesigned with bootstrap  */}
        // <UserPicture user={user} hideLink />
        // <p><UserDisplay user={user} includeFullName hideLink /></p>
        // <p><DisplayCount>{user.follower_count}</DisplayCount> {user.following_count === 1 ? "follower" : "followers"}</p>
        // <p><DisplayCount>{user.following_count}</DisplayCount> following</p>
        // <p>{user.location}</p>
        // <p>{user.bio}</p>
        // <button className='btn btn-primary' onClick={handleFollowToggle}>{currentVerb}</button>
        // </div> : null

export function ProfileBadgeComponent(props) {
    const {username} = props
    const [didLookup, setDidLookup] = useState(false)
    const [profile, setProfile] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const handleBackendLookup = (response, status) => {
        if (status === 200) {
        setProfile(response)
        } else {
        alert("There was an error finding the profile.")
        }
    }
    useEffect(()=>{
        if (didLookup === false) {
        apiProfileDetail(username, handleBackendLookup)
        setDidLookup(true)
        }
    }, [username, didLookup, setDidLookup])
    const handleNewFollow = (actionVerb) => {
        apiProfileFollowToggle(username, actionVerb, (response, status)=>{
            //console.log(response.status)
            if (status===200) {
                setProfile(response) //updating profiles information to that of response
            }
            setProfileLoading(false)
        })
        setProfileLoading(true)
    }

    return didLookup === false ? "Loading..." : profile ? <ProfileBadge user={profile} didFollowToggle={handleNewFollow} profileLoading={profileLoading} /> : null
}