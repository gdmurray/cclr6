import {motion} from "framer-motion";
import React from "react";

interface IDashboardButton {
    className?: string;
    children: React.ReactNode;

    onClick(): void
}

const DashboardButton = ({children, className, onClick}: IDashboardButton): JSX.Element => {
    return <motion.button
        onClick={onClick}
        className={"tracking-wide font-semibold inline-flex text-white border-0 py-2 px-4 focus:outline-none text-lg " + className}
        whileTap={{scale: 0.95}}
    >
        {children}
    </motion.button>
}

DashboardButton.defaultProps = {
    className: "",
    children: <></>,
    onClick: () => {
    }
}

export default DashboardButton