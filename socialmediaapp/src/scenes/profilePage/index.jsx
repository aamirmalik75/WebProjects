import { Box, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidgets from "scenes/widgets/MyPostWidgets";
import UserWidgets from "scenes/widgets/UserWidgets";
import PostsWidget from "scenes/widgets/PostsWidget";

const Profile = () => {
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState(null)
    const { userId } = useParams();
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');

    const fetchUser = async () => {
        const response = await fetch(`http://localhost:4000/users/${userId}`, {
            method: 'GET',
            headers: { Authorization: `PhotoSynthesis ${token}` }
        })
        const data = await response.json()
        setUser(data.user);
    }

    useEffect(() => {
        fetchUser();
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null;
    return (
        <Box>
            <Navbar />
            <Box
                padding='2rem 6%'
                display={isNonMobileScreen ? 'flex' : 'block'}
                gap='2rem'
                justifyContent='center'
            >
                <Box flexBasis={isNonMobileScreen ? '26%' : undefined}>
                    <UserWidgets userID={userId} userPhoto={user.picturePath} />
                    <Box margin="2rem 0" />
                    <FriendListWidget userID={userId} />
                </Box>
                <Box flexBasis={isNonMobileScreen ? '42%' : undefined} marginTop={isNonMobileScreen ? '' : '2rem'}>
                    <MyPostWidgets picturePath={user.picturePath} />
                    <PostsWidget userID={userId} isProfile />
                </Box>
            </Box>
        </Box>
    );
}

export default Profile;