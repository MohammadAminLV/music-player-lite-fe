import { useQuery } from "@tanstack/react-query";
import { Track } from "../types";
import { API as API_ROUTE } from "../lib/environment";

export type TracksResponse = {
    data: Track[];
};

export async function fetchTracks(): Promise<TracksResponse> {
    const res = await fetch(`${API_ROUTE}/api/tracks`);
    if (!res.ok) {
        throw new Error(`Failed to fetch tracks: ${res.status}`);
    }
    const json = (await res.json()) as TracksResponse;
    return json;
}

export default function useTracks() {
    return useQuery<TracksResponse, Error, Track[]>({
        queryKey: ["tracks"],
        queryFn: fetchTracks,
        staleTime: 1000 * 60 * 2,
        select: (data) => data.data,
    });
}