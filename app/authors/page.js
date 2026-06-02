import { Suspense } from "react";
import BrowseAuthors from "../components/BrowseAuthors";

export default function AuthorsPage() {
  return (
    <Suspense>
      <BrowseAuthors />
    </Suspense>
  );
}
