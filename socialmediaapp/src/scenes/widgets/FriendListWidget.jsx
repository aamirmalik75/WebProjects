import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { Box, useTheme, Typography } from "@mui/material";
import { setFriends } from "state";
import { useEffect } from "react";

const FriendListWidget = ({userID}) => {
    const theme = useTheme()
    const dispatch = useDispatch();
    const friends = useSelector((state) => state.user.friends);
    const token = useSelector((state) => state.token)

    const fetchFriends = async () => {
        const response = await fetch(`http://localhost:4000/users/${userID}/friends`, {
            method: 'GET',
            headers: { Authorization: `PhotoSynthesis ${token}`, }
        })
        const data = await response.json();
        dispatch(setFriends({ friends: data }))
    }

    useEffect(() => {
        fetchFriends();
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper border={`2px solid ${theme.palette.primary.main}`}>
            <Typography
                color={theme.palette.neutral.dark}
                variant='h5'
                fontWeight='500'
                sx={{ marginBottom: '1.4rem' }}
            >Friend List</Typography>
            <Box display='flex' flexDirection='column' gap="1.5rem">
                {friends && friends.map((friend) => {
                    return <Friend
                        key={friend._id}
                        friendId={friend._id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle={friend.occupation}
                        userPicturePath={friend.picturePath}
                    />
                })
                }
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;