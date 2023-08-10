import React from 'react'
import {useEffect, useState} from 'react'

import {apiProfileDetail, apiProfileFollowToggle} from './lookup'
import {UserDisplay, UserPicture} from './components'
import {DisplayCount} from './utils'
import {FollowBtn} from './buttons'

function ProfileBadge(props) {
    const {user, didFollowToggle, profileLoading} = props
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
                <FollowBtn user={user} didFollowToggle={didFollowToggle} profileLoading={profileLoading} />
            </div>
            <div class="col d-inline float-end"> {/* add more social icons etc here in future, maybe profile report button */}
            {user.instagram_username ? <a href={`https://www.instagram.com/${user.instagram_username}/`} target="_blank" rel="noreferrer" class="btn btn-warning"> {/* only shows if instagram username has been set for profile -> opens in new window */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                    </svg>
                </a> : null}
            </div>
            </h2>
            <hr class="dropdown-divider"></hr>
            <div class="col dropdown-item d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <b><DisplayCount>{user.post_count}</DisplayCount></b> {user.post_count === 1 ? "post" : "posts"}
            </div>
            <div class="col dropdown-item d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <b><DisplayCount>{user.follower_count}</DisplayCount></b> {user.follower_count === 1 ? "follower" : "followers"} {/* on click use modular to show list of followers? */}
            </div>
            <div class="col dropdown-item d-inline">
                <svg class="bi" width="16" height="16"></svg>
                <b><DisplayCount>{user.following_count}</DisplayCount></b> following
            </div>
            <hr class="dropdown-divider"></hr>
            {user.first_name ? <p><b>Full Name: </b>{user.first_name} {user.last_name}</p> : null}
            {user.location ? <p><b>Location: </b>{user.location}</p> : null}
            {user.qualification ? <p><b>Qualification: </b>{user.qualification}</p> : null}
            {user.bio ? <p><b>Bio: </b>{user.bio}</p> : null}
        </div>
   </div> : null
   }

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