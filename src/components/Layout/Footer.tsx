import React from "react";

const FooterData = [
    {
        name: "Social",
        links: [
            {
                name: "Discord",
                link: "https://google.com",
                icon: <></>
            },
            {
                name: "Twitter",
                link: "https://twitter.com",
                icon: <></>
            }
        ]
    }
]

export default function Footer(): JSX.Element {
    return (
        <footer className="text-gray-50 font-medium bg-gray-900 p-8">
            <div>This is where we'd do foot stuff</div>
        </footer>
    )
}