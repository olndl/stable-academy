import { Link } from 'react-router';

export function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <p className="page-description">
        Riding courses and your training notes in one place.
      </p>
      <section className="panel" aria-labelledby="courses-title">
        <h2 id="courses-title">Courses</h2>
        <p>
          The first courses are being prepared. You’ll be able to save them and
          track your progress here.
        </p>
        <Link className="button" to="/courses">
          Browse courses
        </Link>
      </section>
      <section className="panel" aria-labelledby="diary-title">
        <h2 id="diary-title">Training diary</h2>
        <p>
          No training entries yet. The diary will let you keep notes about your
          rides.
        </p>
        <Link className="text-link" to="/diary">
          Open diary
        </Link>
      </section>
    </>
  );
}
