// src/components/HelpModal.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css"; // uses your modal + guide styles

export default function HelpModal() {
  const { user, role } = useAuth();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);

  // Listen once globally
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("cc:open-help", handler);
    return () => window.removeEventListener("cc:open-help", handler);
  }, []);

  // Close on route change (optional but feels clean)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const content = useMemo(() => {
    // Decide content based on role + route
    const isCitizen = role === "citizen";
    const isGovt = role === "govt";
    const isAuthority = role === "authority";

    // Transport page
    if (pathname.startsWith("/transport")) {
      return {
        title: "🚌 Transport — Quick Guide",
        sub: "Pick pickup & drop → get connected legs with timings, frequency, and cost.",
        steps: [
          ["1", "Choose From / To", "Select two areas/stops from the dropdowns."],
          ["2", "Click Find Route", "Get step-by-step route (Bus → Transfer → etc.)."],
          ["3", "Check timings", "Each leg shows travel time + frequency + operating hours."],
          ["4", "Save money", "Shows cost + transfers so you can avoid unnecessary cabs."]
        ],
      };
    }

    // Citizen pages
    if (isCitizen && pathname.startsWith("/citizen/complaints")) {
      return {
        title: "🧾 Complaints — Quick Guide",
        sub: "Report issues, vote urgent ones, and track status transparently.",
        steps: [
          ["1", "Raise complaint", "Add title + department + area and submit."],
          ["2", "Vote urgent issues", "Upvote critical problems to push priority."],
          ["3", "Track status", "Follow Open → In Progress → Resolved."],
          ["4", "Community visibility", "See city-wide issues in one place."]
        ],
      };
    }

    if (isCitizen && pathname.startsWith("/citizen/projects")) {
      return {
        title: "🏗️ Projects — Quick Guide",
        sub: "Know what work is happening in your area so you can plan better.",
        steps: [
          ["1", "Browse projects", "See ongoing/planned/completed works by department."],
          ["2", "Check dates", "Start/end dates help you plan routes and commute."],
          ["3", "See location", "Area tagging shows if your locality is affected."],
          ["4", "Transparency", "Reduces surprises + builds trust."]
        ],
      };
    }

    // Govt pages
    if (isGovt && pathname.startsWith("/govt/complaints")) {
      return {
        title: "🧑‍💼 Officer — Complaints Guide",
        sub: `You are in ${user?.department?.toUpperCase() || "DEPT"} department.`,
        steps: [
          ["1", "Review urgent first", "Sort by Top Voted to pick high-impact issues."],
          ["2", "Update status", "Open → In Progress → Resolved to keep citizens updated."],
          ["3", "Department filter", "You only see complaints for your department."],
          ["4", "Accountability", "Creates a visible workflow for the public."]
        ],
      };
    }

    if (isGovt && pathname.startsWith("/govt/projects")) {
      return {
        title: "📌 Officer — Projects Guide",
        sub: "Publish project details so citizens know what’s happening in real-time.",
        steps: [
          ["1", "Add a project", "Enter title, area, dates, and department."],
          ["2", "Update progress", "Keep status Planned/Ongoing/Completed updated."],
          ["3", "Evidence builds trust", "Images/notes make updates believable."],
          ["4", "Public transparency", "Reduces confusion and misinformation."]
        ],
      };
    }

    if (isGovt && pathname.startsWith("/govt/analytics")) {
      return {
        title: "📊 Analytics — Quick Guide",
        sub: "See workload trends to plan manpower and budgets.",
        steps: [
          ["1", "Understand volume", "How many complaints are coming in."],
          ["2", "Spot hotspots", "Areas with repeated issues."],
          ["3", "Prioritize", "Top voted issues = high urgency."],
          ["4", "Plan action", "Allocate teams based on trend."]
        ],
      };
    }

    // Authority pages
    if (isAuthority && pathname.startsWith("/authority/alerts")) {
      return {
        title: "🚨 Alerts — Quick Guide",
        sub: "Issue city-wide trusted alerts during emergencies and public risks.",
        steps: [
          ["1", "Create an alert", "Enter title + short message + severity."],
          ["2", "Publish quickly", "Push alert to all citizens instantly."],
          ["3", "Prevent panic", "Only high authority can post alerts."],
          ["4", "Build trust", "Central official channel reduces misinformation."]
        ],
      };
    }

    if (isAuthority && pathname.startsWith("/authority/complaints")) {
      return {
        title: "🏛️ Authority — Complaints Guide",
        sub: "City-wide view of urgent issues and department-wise accountability.",
        steps: [
          ["1", "View top urgent", "See highest voted complaints first."],
          ["2", "Department snapshot", "Compare workload across departments."],
          ["3", "Track resolutions", "Monitor Open/In Progress/Resolved counts."],
          ["4", "Govern better", "Use data to allocate resources."]
        ],
      };
    }

    if (isAuthority && pathname.startsWith("/authority/projects")) {
      return {
        title: "🏗️ Authority — Projects Guide",
        sub: "City-wide project visibility for planning and monitoring.",
        steps: [
          ["1", "Monitor progress", "Watch Ongoing projects by department/area."],
          ["2", "Spot delays", "Identify delayed/blocked works quickly."],
          ["3", "Coordinate departments", "Reduce overlap and repeated digging."],
          ["4", "Transparency", "Citizens stay informed, fewer complaints."]
        ],
      };
    }

    // Default fallback
    return {
      title: "📍 CityConnect — Quick Guide",
      sub: "Use the navbar to explore role-based modules: complaints, projects, alerts and transport.",
      steps: [
        ["1", "Complaints", "Report and vote issues. Higher votes = higher priority."],
        ["2", "Projects", "Track ongoing works with dates and locations."],
        ["3", "Alerts", "Trusted emergency alerts from higher authority."],
        ["4", "Transport", "Connected public routes with timings + cost."]
      ],
    };
  }, [pathname, role, user?.department]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{content.title}</h3>
          <button className="modal-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <p className="modal-sub">{content.sub}</p>

        <div className="guide-big">
          {content.steps.map(([n, t, d]) => (
            <div className="guide-item-big" key={n + t}>
              <div className="guide-step-big">{n}</div>
              <div>
                <div className="guide-title-big">{t}</div>
                <div className="guide-text-big">{d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-foot">
          <button className="btn-sm primary" onClick={() => setOpen(false)}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}