import {apiPostAction} from './lookup'

export function ActionBtn(props) {
    const {post, action, didPerformAction} = props //takes the post
    const likes = post.likes ? post.likes : 0
    //const [likes, setLikes] = useState(post.likes ? post.likes : 0) // const [state, setState] = useState(initialValue)
    // here the (post.likes ? post.likes : 0) is the value to start with, and likes is the current likes value that can be used in the component. The setLikes function can be used to update the likes, triggering a re-render of the component.
    //const [userLike, setUserLike] = useState(post.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-primary btn-small'
    const actionDisplay = action.display ? action.display : 'Action' // the display of the button

    const handleActionBackendEvent = (response, status) => {
      console.log(response, status)
      if ((status === 200 || status === 201) && didPerformAction) { //status 200 OR status 201
        didPerformAction(response)
      }
    }

    const handleClick = (event) => {
      event.preventDefault()
      apiPostAction(post.id, action.type, handleActionBackendEvent)
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay // setting what the button says depending on the type of action set in props
    return <button className={className} onClick={handleClick}>{display}</button> //button with the previously set class and when clicked will trigger the handleClick function
  }