import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, useTheme, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token)
    const { _id } = useSelector((state) => state.user)
    const friends = useSelector((state) => state.user.friends)

    const theme = useTheme();
    const primaryLight = theme.palette.primary.light;
    const primaryDark = theme.palette.primary.dark;
    const main = theme.palette.neutral.main;
    const medium = theme.palette.neutral.medium;

    const isFriend = friends.find((friend) => { return friend._id === friendId })

    const patchFriend = async () => {
        const response = await fetch(`http://localhost:4000/users/${_id}/${friendId}`, {
            method: "PATCH",
            headers: {
                Authorization: `PhotoSynthesis ${token}`,
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    }

    return (
        <FlexBetween>
            <FlexBetween gap='1rem'>
                <UserImage image={userPicturePath} />
                <Box
                    onClick={() => {
                        navigate(`/profile/${friendId}`)
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight='500'
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                cursor: "pointer",
                            }
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize='0.7rem'>{subtitle}</Typography>
                </Box>
            </FlexBetween>
            <IconButton
                onClick={() => patchFriend()}
                sx={{ backgroundColor: primaryLight, padding: '0.7rem' }}
            >
                {isFriend ? (
                    <PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (
                    <PersonAddOutlined sx={{ color: primaryDark }} />
                )}
            </IconButton>
        </FlexBetween>
    );
}

export default Friend;