import {UserPicture, UserDisplay} from "./components"

export function ProfileInfo(props) { //info box for profiles that appears on search results list
    const {profile} = props

    return <div class="d-flex text-body-secondary pt-3">
        <div>
            <UserPicture user={profile} pictureSize="50px" />
        </div>
        <p class="pb-3 mb-0 small lh-sm border-bottom w-100 ms-1">
            <div class="d-flex justify-content-between">
                <strong class="d-block text-gray-dark"><UserDisplay user={profile} /></strong>
                {profile.follower_count}
            </div>
            {profile.bio}
        </p>
    </div>
}