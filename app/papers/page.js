import { Suspense } from "react";
import BrowsePapers from "../components/BrowsePapers";

export default function PapersPage() {
  return (
    <Suspense>
      <BrowsePapers />
    </Suspense>
  );
}
