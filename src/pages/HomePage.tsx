import { Link } from 'react-router';
import { BrandMark } from '../components/BrandMark';

const areas = [
  {
    number: '01',
    title: 'Find your next lesson',
    text: 'Explore riding courses, from the first steps to a more confident seat.',
    to: '/courses',
    label: 'Explore courses',
  },
  {
    number: '02',
    title: 'Make it your journey',
    text: 'Keep the courses you love together and pick up where you left off.',
    to: '/my-learning',
    label: 'My learning',
  },
  {
    number: '03',
    title: 'Remember every ride',
    text: 'A place for small wins, training notes and things to try next time.',
    to: '/diary',
    label: 'Training diary',
  },
];

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">A little progress, every ride</p>
          <h1 id="home-title">
            Good riding starts
            <br />
            with <em>curiosity.</em>
          </h1>
          <p className="hero-description">
            Learn at your own pace. Take it to the arena.
            <br className="desktop-break" /> Build a better partnership with
            your horse.
          </p>
          <Link className="button button-primary" to="/courses">
            Discover courses <span aria-hidden="true">↗</span>
          </Link>
          <p className="preview-note">
            We’re building a new place to learn. Come along for the ride.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-label">THE RIDER’S NOTEBOOK</span>
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-horse">
            <BrandMark />
          </div>
          <span className="art-caption">
            Stay curious.
            <br />
            <em>Ride thoughtfully.</em>
          </span>
          <span className="art-edition">VOL. 01 / THE BEGINNING</span>
        </div>
      </section>
      <section className="journey-section" aria-labelledby="journey-title">
        <div className="section-heading">
          <h2 id="journey-title">Your space to grow</h2>
          <span>Learning, beyond the lesson.</span>
        </div>
        <div className="journey-grid">
          {areas.map((area) => (
            <article className="journey-card" key={area.number}>
              <span className="card-number">{area.number}</span>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
              <Link className="text-link" to={area.to}>
                {area.label} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
