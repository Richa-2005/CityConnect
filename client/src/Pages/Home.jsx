import Button from "../components/common/Button";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Report. Track. Improve <span>Your City</span>
        </h1>

        <p>
          CityConnect helps citizens report civic issues, track resolutions,
          and stay informed through transparent government updates.
        </p>

        <div className="hero-actions">
          <button className="primary-btn">Report an Issue</button>
          <button className="secondary-btn">View Alerts</button>
        </div>
      </div>
    </section>
  );
}
