"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <>
      <div>
        <p>Page Not Found.</p>
        <div style={{ display: "flex", flexDirection: "row", gap: 4 }}>
          <button onClick={() => router.push("/")}>
            Go Home
          </button>
          <button onClick={() => router.back()}>
            Back to previous page
          </button>
        </div>
      </div>
    </>
  );
}
