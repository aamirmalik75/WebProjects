import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import NavbarPage from "scenes/navbar";
import UserWidgets from "scenes/widgets/UserWidgets";
import MyPostWidgets from "scenes/widgets/MyPostWidgets";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";

const HomePage = () => {
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
    const { _id, picturePath } = useSelector((state) => state.user)
    return (
        <Box>
            <NavbarPage />
            <Box
                width='100%'
                padding='2rem 2%'
                display={isNonMobileScreen ? 'flex' : 'block'}
                gap='0.5rem'
                justifyContent='space-between'
            >
                <Box flexBasis={isNonMobileScreen ? '25%' : undefined}>
                    <UserWidgets userID={_id} userPhoto={picturePath} />
                </Box>
                <Box flexBasis={isNonMobileScreen ? '42%' : undefined} marginTop={isNonMobileScreen ? '' : '2rem'}>
                    <MyPostWidgets picturePath={picturePath} />
                    <PostsWidget userID={_id} />
                </Box>
                {isNonMobileScreen && <Box flexBasis='26%'>
                    <FriendListWidget userID={_id} />
                </Box>
                }
            </Box>
        </Box>
    );
}

export default HomePage;