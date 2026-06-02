import PaperDetailClient from "../../components/PaperDetailClient";

export default async function PaperDetailPage({ params }) {
  const { id } = await params;
  return <PaperDetailClient paperId={decodeURIComponent(id)} />;
}
