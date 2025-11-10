"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../queries";
import { AudioProvider } from "./AudioProvider";

export const ClientProviders: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AudioProvider>
                {children}
            </AudioProvider>
        </QueryClientProvider>
    );
};
