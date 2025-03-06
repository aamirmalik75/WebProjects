import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    useTheme,
    InputBase,
    Button,
    IconButton,
    useMediaQuery
} from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { setPosts } from "state";

const MyPostWidgets = ({ picturePath }) => {
    const dispatch = useDispatch();
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');
    const token = useSelector((state) => state.token);
    const { _id } = useSelector((state) => state.user);
    const theme = useTheme();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [post, setPost] = useState('');
    const mediumMain = theme.palette.neutral.mediumMain;
    const medium = theme.palette.neutral.medium;

    const handlePost = async () => {
        const formData = new FormData();
        formData.append('userId', _id);
        formData.append('description', post);
        if (image) {
            formData.append('picture', image);
            formData.append('picturePath', image.name);
        }

        const postResponse = await fetch(`http://localhost:4000/posts`, {
            method: 'POST',
            headers: { Authorization: `PhotoSynthesis ${token}` },
            body: formData,
        })
        const posts = await postResponse.json();
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost('');
    }

    return (
        <WidgetWrapper border={`2px solid ${theme.palette.primary.main}`}>
            <FlexBetween gap='1.5rem'>
                <UserImage image={picturePath} />
                <InputBase
                    placeholder="What's in your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: theme.palette.neutral.light,
                        borderRadius: '1.5rem',
                        padding: "0.7rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius='5px'
                    marginTop='1rem'
                    padding='1rem'
                >
                    <Dropzone
                        acceptedFiles='.jpg,.jpeg,.png'
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${theme.palette.primary.main}`}
                                    padding="1rem"
                                    width='100%'
                                    sx={{ "&:hover": { cursor: 'pointer' } }}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? (<p>Add Image Here</p>) :
                                        (
                                            <FlexBetween>
                                                <Typography>{image.name}</Typography>
                                                <EditOutlined />
                                            </FlexBetween>
                                        )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        width="15%"
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}
            <Divider sx={{ margin: "1rem 0" }} />
            <FlexBetween>
                <FlexBetween gap="0.3rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: 'pointer', color: medium } }}
                    >Image</Typography>
                </FlexBetween>
                {isNonMobileScreen ? (
                    <>
                        <FlexBetween gap="0.3rem">
                            <GifBoxOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>
                        <FlexBetween gap="0.3rem">
                            <AttachFileOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>
                        <FlexBetween gap="0.3rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>
                    </>
                ) : (
                    <FlexBetween gap="0.3rem">
                        <MoreHorizOutlined sx={{ color: mediumMain }} />
                    </FlexBetween>
                )}
                <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        borderRadius: '3rem',
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.background.alt,
                    }}
                >Post</Button>
            </FlexBetween>
        </WidgetWrapper >
    );
}

export default MyPostWidgets;