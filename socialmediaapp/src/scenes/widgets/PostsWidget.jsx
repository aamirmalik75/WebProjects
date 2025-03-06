import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget"

const PostsWidget = ({ userID, isProfile = false }) => {
    const token = useSelector((state) => state.token)
    const posts = useSelector((state) => state.posts)
    const dispatch = useDispatch();

    const getPosts = async () => {
        const response = await fetch('http://localhost:4000/posts', {
            method: 'GET',
            headers: { Authorization: `PhotoSynthesis ${token}` },
        })
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    }
    const getUserPosts = async () => {
        const response = await fetch(`http://localhost:4000/posts/${userID}/posts`, {
            method: 'GET',
            headers: { Authorization: `PhotoSynthesis ${token}` },
        })
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    }

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        }
        else {
            getPosts();
        }
    }, []); //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {
                posts.map(
                    ({
                        _id,
                        userId,
                        firstName,
                        lastName,
                        description,
                        location,
                        picturePath,
                        userPicturePath,
                        likes,
                        comments,
                    }) => {
                        return <PostWidget
                            key={_id}
                            postId={_id}
                            postUserId={userId}
                            name={`${firstName} ${lastName}`}
                            description={description}
                            location={location}
                            picturePath={picturePath}
                            userPicturePath={userPicturePath}
                            likes={likes}
                            comments={comments}
                        />
                    }
                )
            }
        </>
    );
}

export default PostsWidget;