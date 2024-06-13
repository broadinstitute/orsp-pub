export const THEME = "snow";

export const STYLE = {
    height: "12rem",
    marginBottom: "3rem",
    backgroundColor: "#FFFFFF",
};

export const MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link"],
        [{ script: "sub" }, { script: "super" }],
        [{ color: [] }, { background: [] }],
    ],
    history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true,
    },
};
