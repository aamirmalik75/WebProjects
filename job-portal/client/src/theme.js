import { createTheme } from "@mui/material";

export const tokens = () => ({
    ...({
        grey: {
            100: "#e0e0e0",
            200: "#c2c2c2",
            300: "#a3a3a3",
            400: "#858585",
            500: "#666666",
            600: "#525252",
            700: "#3d3d3d",
            800: "#292929",
            900: "#141414"
        },
        primary: {
            100: "#d7d6e0",
            200: "#afacc0",
            300: "#8683a1",
            400: "#5e5981",
            500: "#363062",
            600: "#2b264e",
            700: "#201d3b",
            800: "#161327",
            900: "#0b0a14"
        },
        whiteAccent: {
            100: "#fdfdfd",
            200: "#fbfbfb",
            300: "#f9f9f9",
            400: "#f7f7f7",
            500: "#f5f5f5",
            600: "#c4c4c4",
            700: "#939393",
            800: "#626262",
            900: "#313131"
        },
        orangeAccent: {
            100: "#faddcd",
            200: "#f5bb9b",
            300: "#ef9a68",
            400: "#ea7836",
            500: "#e55604",
            600: "#b74503",
            700: "#893402",
            800: "#5c2202",
            900: "#2e1101"
        },
        redAccent: {
            100: "#ffcccc",
            200: "#ff9999",
            300: "#ff6666",
            400: "#ff3333",
            500: "#ff0000",
            600: "#cc0000",
            700: "#990000",
            800: "#660000",
            900: "#330000"
        },
    })
})

export const themeSettings = () => {
    const colors = tokens();

    return {
        palette: {
            primary: {
                main: colors.primary[500],
            },
            secondary: {
                main: colors.orangeAccent[500],
            },
            neutral: {
                light: colors.grey[100],
                main: colors.grey[500],
                dark: colors.grey[700],
            },
            background: {
                default: colors.whiteAccent[500],
            }
        },
        typography: {
            fontFamily: ["Roboto", "sans-serif"].join(','),
            fontSize: 12,
            h1: {
                fontFamily: ["Roboto", "sans-serif"].join(','),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["Roboto", "sans-serif"].join(','),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["Roboto", "sans-serif"].join(','),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["Roboto", "sans-serif"].join(','),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Roboto", "sans-serif"].join(','),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Roboto", "sans-serif"].join(','),
                fontSize: 14,
            },
        },
    };
}

const theme = createTheme(themeSettings());
export default theme;
