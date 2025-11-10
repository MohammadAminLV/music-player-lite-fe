import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
};

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
    className = "",
    children,
    ...props
}) => {
    return (
        <button
            {...props}
            className={`px-3 py-2 cursor-pointer rounded-md bg-black text-white text-sm shadow-sm hover:brightness-95 active:scale-95 transition min-w-[70px] ${className}`}
        >
            {children}
        </button>
    );
};