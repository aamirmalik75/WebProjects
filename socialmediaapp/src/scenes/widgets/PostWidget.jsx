import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined
} from "@mui/icons-material";
import { Box, useTheme, Divider, IconButton, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments
}) => {

    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const [isComments, setIsComments] = useState(false);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likesCount = Object.keys(likes).length;

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const main = theme.palette.neutral.main;

    const patchLike = async () => {
        const response = await fetch(`http://localhost:4000/posts/${postId.toString()}/like`, {
            method: 'PATCH',
            headers: {
                Authorization: `PhotoSynthesis ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: loggedInUserId })
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    }

    return (
        <WidgetWrapper margin='2rem 0'>
            <Friend
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{ marginTop: '0.7rem' }}>{description}</Typography>
            {picturePath && (
                <img
                    height='auto'
                    width='100%'
                    src={`http://localhost:4000/assets/${picturePath}`}
                    alt="post"
                    style={{ borderRadius: '0.7rem', marginTop: '0.7rem' }}
                />
            )}
            <FlexBetween marginTop="0.4rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap='0.4rem'>
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likesCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap='0.4rem'>
                        <IconButton onClick={() => setIsComments(!isComments)}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>
                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            {isComments && (
                <Box marginTop='0.7rem'>
                    {comments.map((comment, i) => (
                        <Box key={`${name}-${i}`}>
                            <Divider />
                            <Typography sx={{ color: main, margin: '0.5rem 0', paddingLeft: '1rem' }} >{comment}</Typography>
                        </Box>
                    ))}
                    <Divider />
                </Box>
            )}
        </WidgetWrapper >
    );
}

export default PostWidget;