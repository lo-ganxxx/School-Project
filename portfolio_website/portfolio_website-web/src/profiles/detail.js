import {UserPicture, UserDisplay} from "./components"
import {DisplayCount} from "./utils"

export function ProfileInfo(props) { //info box for profiles that appears on search results list
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