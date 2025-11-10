import { useQuery } from "@tanstack/react-query";
import { Track } from "../types";
import { API as API_ROUTE } from "../lib/environment";

export type Payload = {
    data: Track[]
};

export async function fetchData(): Promise<Payload> {
    const res = await fetch(`${API_ROUTE}/api/tracks`);
    if (!res.ok) {
        throw new Error(`Failed to fetch tracks: ${res.status}`);
    }
    const json = await res.json();
    return json as Payload;
}

export default function useTracks() {
    return useQuery({
        queryKey: ["tracks"],
        queryFn: fetchData,
        suspense: true,
        staleTime: 1000 * 60 * 2
    });
}