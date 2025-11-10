import React from "react";
import { TrackListWithSuspense } from "../components/TrackList";

export default function Page() {
  return (
    <>
      <h2 style={{ marginTop: 8 }}>All Tracks</h2>
      <React.Suspense fallback={<div>Loading tracks…</div>}>
        <TrackListWithSuspense />
      </React.Suspense>
    </>
  );
}