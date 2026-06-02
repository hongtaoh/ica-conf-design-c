import AuthorDetailClient from "../../components/AuthorDetailClient";

export default async function AuthorDetailPage({ params }) {
  const { name } = await params;
  return <AuthorDetailClient authorName={decodeURIComponent(name)} />;
}
