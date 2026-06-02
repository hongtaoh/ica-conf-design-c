import { Suspense } from "react";
import BrowseSessions from "../components/BrowseSessions";

export default function SessionsPage() {
  return (
    <Suspense>
      <BrowseSessions />
    </Suspense>
  );
}
