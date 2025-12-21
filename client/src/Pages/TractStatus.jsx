import ComplaintCard from "../components/complaints/ComplaintCard";
import ComplaintTimeline from "../components/complaints/ComplaintTimeline";

export default function TrackStatus() {
  const timelineSteps = [
    { label: "Complaint Submitted", date: "21 Sep 2025", completed: true },
    { label: "Acknowledged by Authority", date: "22 Sep 2025", completed: true },
    { label: "Work in Progress", date: "23 Sep 2025", completed: false },
    { label: "Resolved", date: "—", completed: false },
  ];

  return (
    <div className="container" style={{ padding: "32px 0" }}>
      <h2 style={{ marginBottom: "16px" }}>Complaint Status</h2>

      <ComplaintCard
        title="Streetlight not working"
        category="Public Infrastructure"
        location="MG Road, Ward 12"
        severity="medium"
        status="In Progress"
      />

      <ComplaintTimeline steps={timelineSteps} />
    </div>
  );
}
