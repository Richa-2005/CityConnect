import { useAuth } from "../context/AuthContext";
import CitizenDashboard from "./citizen/CitizenDashboard";
import GovtDashboard from "./govt/GovtDashboard";
import AuthorityDashboard from "./authority/AuthorityDashboard";

export default function Home() {
  const { role } = useAuth();
  const r = (role || "").toLowerCase();

  if (r === "citizen") return <CitizenDashboard />;
  if (r === "govt") return <GovtDashboard />;
  if (r === "authority") return <AuthorityDashboard />;

  return <div style={{ padding: "2rem" }}>Unknown role</div>;
}