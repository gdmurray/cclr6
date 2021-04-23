import React from "react";

export default function Title({children}): JSX.Element {
    return (
        <div className="px-4 py-2 font-semibold text-2xl dark:text-gray-50 text-gray-900">
            {children}
        </div>
    )
}