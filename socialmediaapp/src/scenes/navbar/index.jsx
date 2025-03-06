import { useState } from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close,
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import FlexBetween from "components/FlexBetween";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user)
    const navigate = useNavigate();
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)');

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = `${user ? user.firstName : ''} ${user ? user.lastName : ''}`;
    return (
        <FlexBetween padding='1rem 6%' backgroundColor={alt} position='sticky' zIndex='100' top="0">
            <FlexBetween gap='1.75rem'>
                <Typography
                    fontWeight="bold"
                    fontSize="clamp( 1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate('/home')}
                    sx={{
                        "&:hover": {
                            color: primaryLight,
                            cursor: 'pointer',
                        },
                    }}
                >
                    SocialMedia
                </Typography>
                {/* SEARCH BAR FOR DESKTOP */}
                {isNonMobileScreen && (
                    <FlexBetween backgroundColor={neutralLight} padding="0.1rem 1.5rem" gap="3rem" borderRadius="7px">
                        <InputBase placeholder="Search..." />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>
                )}
            </FlexBetween>

            {/* DESKTOP NAV */}
            {isNonMobileScreen ? (
                <FlexBetween gap='2rem'>
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === 'light' ?
                            <LightMode sx={{ fontSize: '25px', color: dark }} />
                            :
                            <DarkMode sx={{ fontSize: '25px' }} />
                        }
                    </IconButton>
                    <Message sx={{ fontSize: '25px' }} />
                    <Notifications sx={{ fontSize: '25px' }} />
                    <Help sx={{ fontSize: '25px' }} />
                    <FormControl variant="standard" value={fullName}>
                        <Select
                            value={fullName}
                            sx={{
                                backgroundColor: neutralLight,
                                width: '140px',
                                borderRadius: '0.225',
                                padding: '0.3rem 1rem',
                                "& .MuiSvgIcon-root": {
                                    paddingRight: '0.25rem',
                                    width: '3rem',
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight,
                                }
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>) : (
                <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                    <Menu />
                </IconButton>
            )}
            {/* MOBILE NAV */}
            {!isNonMobileScreen && isMobileMenuToggled && (
                <Box
                    position='fixed'
                    right='0'
                    bottom="0"
                    height="100%"
                    backgroundColor={background}
                    zIndex='10'
                    maxWidth='500px'
                    minWidth="300px"
                >
                    {/* CLOSE ICON */}
                    <Box display='flex' justifyContent='flex-end' padding='1rem'>
                        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                            <Close />
                        </IconButton>
                    </Box>
                    {/* MENU ITEMS FOR MOBILE */}
                    <FlexBetween
                        display='flex'
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        gap='2rem'>

                        <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: '25px' }} >
                            {theme.palette.mode === 'light' ?
                                <LightMode sx={{ fontSize: '25px', color: dark }} />
                                :
                                <DarkMode sx={{ fontSize: '25px' }} />
                            }
                        </IconButton>
                        <Message sx={{ fontSize: '25px' }} />
                        <Notifications sx={{ fontSize: '25px' }} />
                        <Help sx={{ fontSize: '25px' }} />
                        <FormControl variant="standard" value={fullName}>
                            <Select
                                value={fullName}
                                sx={{
                                    backgroundColor: neutralLight,
                                    width: '140px',
                                    borderRadius: '0.225',
                                    padding: '0.3rem 1rem',
                                    "& .MuiSvgIcon-root": {
                                        paddingRight: '0.25rem',
                                        width: '3rem',
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight,
                                    }
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    );
}

export default Navbar;