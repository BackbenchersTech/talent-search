const CandidateDetailPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  return <div>Candidate detail page for: {id}</div>;
};

export default CandidateDetailPage;
