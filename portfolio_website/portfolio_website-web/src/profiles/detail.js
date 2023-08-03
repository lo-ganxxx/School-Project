import {useState} from 'react'

import {UserPicture, UserDisplay} from "./components"
import {DisplayCount} from "./utils"
import {apiProfileFollowToggle} from "./lookup"
import {FollowBtn} from "./buttons"

export function ProfileSearchBadge(props) { //info box for profiles that appears on search results list
    const {profile} = props

    return <div class="col-md-6">
        <div class="card flex-row p-2 mx-2 my-2 align-items-center">
            <div class="card-image m-2">
                <UserPicture user={profile} pictureSize="50px" />
            </div>
            <div class="card-body"> {/* add a followed by.. section for people the user follows that follow the person */}
                <UserDisplay user={profile} />
                {profile.first_name} {profile.last_name} • <DisplayCount>{profile.follower_count}</DisplayCount> {profile.follower_count === 1 ? "follower" : "followers"}
            </div>
            <div class="d-flex flex-row card-right flex-grow-1 justify-content-end mx-2">
                <a className='btn btn-primary' href={`/profile/${profile.username}`}>View profile</a>
            </div>
        </div>
    </div>
}

export function ProfileSuggestedBadge(props) {
    const [profile, setProfile] = useState(props.profile)
    const [profileLoading, setProfileLoading] = useState(false)

    const handleNewFollow = (actionVerb) => {
        apiProfileFollowToggle(profile.username, actionVerb, (response, status)=>{
            //console.log(response.status)
            if (status===200) {
                setProfile(response) //updating profiles information to that of response
            }
            setProfileLoading(false)
        })
        setProfileLoading(true)
        }

    return <li class="list-group-item mx-2 my-2">
        <div class="card flex-col p-2 ms-2 me-2 my-2 align-items-center" style={{height:'208px', width:'160px'}}>
            <div class="card-image mb-1 mt-3">
                <UserPicture user={profile} pictureSize="54px" />
            </div>
            <div class="text-truncate text-center" style={{maxWidth:'150px'}}>
                <b><UserDisplay user={profile} /></b>
                <p class="text-muted text-truncate text-center">{profile.first_name} {profile.last_name}</p>
            </div>
            <div class="d-flex flex-row card-right justify-content-center mx-2 mb-3">
                <FollowBtn user={profile} didFollowToggle={handleNewFollow} profileLoading={profileLoading} />
            </div>
        </div>
    </li>
}