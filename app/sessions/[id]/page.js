import SessionDetailClient from "../../components/SessionDetailClient";

export default async function SessionDetailPage({ params }) {
  const { id } = await params;
  return <SessionDetailClient sessionId={decodeURIComponent(id)} />;
}
