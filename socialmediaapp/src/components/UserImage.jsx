import { Box } from "@mui/material";

const UserImage = ({ size = "60px", image }) => {
    return (

        <Box width={size} height={size} >
            <img
                width={size}
                height={size}
                src={`http://localhost:4000/assets/${image}`}
                alt="user"
                style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
        </Box >
    )
}

export default UserImage;