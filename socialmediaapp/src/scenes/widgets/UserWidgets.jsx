import { Box, Typography, Divider, useTheme } from "@mui/material";
import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined
} from '@mui/icons-material'
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserWidgets = ({ userID, userPhoto }) => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const medium = theme.palette.neutral.medium;
    const main = theme.palette.neutral.main;

    const getUser = async () => {
        const userResponse = await fetch(`http://localhost:4000/users/${userID}`, {
            method: 'GET',
            headers: { Authorization: `PhotoSynthesis ${token}` }
        })

        const data = await userResponse.json();
        setUser(data.user);
    };

    useEffect(() => {
        getUser();
    }, [user])  //eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null;

    const {
        firstName,
        lastName,
        location,
        occupation,
        viewedProfile,
        impressions,
        friends
    } = user;

    return (
        <WidgetWrapper border={`2px solid ${theme.palette.primary.main}`}  >
            {/* FIRST ROW */}
            <FlexBetween
                gap='0.5rem'
                paddingBottom='0.9rem'
                onClick={() => navigate(`/profile/${userID}`)}
            >
                <FlexBetween gap='0.5rem'>
                    <UserImage image={userPhoto} />
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight={600}
                            sx={{
                                "&:hover": {
                                    color: theme.palette.primary.light,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            {firstName} {lastName}
                        </Typography>
                        <Typography color={medium}>{friends === undefined ? 0 : friends.length} Friends</Typography>
                    </Box>
                </FlexBetween>
                <ManageAccountsOutlined />
            </FlexBetween>

            <Divider />
            {/* SECOND ROW */}
            <Box padding='1rem 0'>
                <Box display='flex' alignItems='center' gap="0.7rem" marginBottom='0.7rem'>
                    <LocationOnOutlined fontSize="large" color={dark} />
                    <Typography color={medium}>{location}</Typography>
                </Box>
                <Box display='flex' alignItems='center' gap="0.7rem" >
                    <WorkOutlineOutlined fontSize="large" color={dark} />
                    <Typography color={medium}>{occupation}</Typography>
                </Box>
            </Box>

            <Divider />
            {/* THIRD ROW */}
            <Box padding='1rem 0'>
                <FlexBetween marginBottom='0.5rem'>
                    <Typography color={medium}>Who's viewed your profile</Typography>
                    <Typography color={main} fontWeight='600'>{viewedProfile}</Typography>
                </FlexBetween>
                <FlexBetween>
                    <Typography color={medium}>Impressions on your post</Typography>
                    <Typography color={main} fontWeight='600'>{impressions}</Typography>
                </FlexBetween>
            </Box>

            <Divider />
            {/* FOURTH ROW */}
            <Box padding='1rem 0'>
                <Typography color={main} fontWeight='700' fontSize='16px' marginBottom='1rem'>Social Profiles</Typography>
                <FlexBetween gap="1rem" marginBottom='0.5rem'>
                    <FlexBetween gap="1rem">
                        <img src="../assets/twitter.png" alt="twitter" />
                        <Box >
                            <Typography color={main} fontWeight='600'>
                                Twitter
                            </Typography>
                            <Typography color={medium}>Social Network</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined color={main} />
                </FlexBetween>
                <FlexBetween gap="1rem">
                    <FlexBetween gap="1rem">
                        <img src="../assets/linkedin.png" alt="linkedin" />
                        <Box >
                            <Typography color={main} fontWeight='600'>
                                Linkedin
                            </Typography>
                            <Typography color={medium}>Network Platform</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined color={main} />
                </FlexBetween>
            </Box>
        </WidgetWrapper>
    );

}

export default UserWidgets;