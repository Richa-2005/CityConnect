import { severityConfig } from "../../config/severityConfig";
import Badge from "../common/Badge";

export default function SeverityTag({ level }) {
  const severity = severityConfig[level];

  if (!severity) return null;

  return <Badge label={severity.label} color={severity.color} />;
}
