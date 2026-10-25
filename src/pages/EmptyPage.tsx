import { Link } from 'react-router';

const sections = {
  courses: {
    title: 'Courses',
    message: 'No courses yet',
    text: 'The course catalog is being prepared.',
  },
  learning: {
    title: 'My learning',
    message: 'No saved courses',
    text: 'Your saved courses and lesson progress will appear here.',
  },
  diary: {
    title: 'Training diary',
    message: 'No training entries',
    text: 'The training diary is coming soon.',
  },
  statistics: {
    title: 'Statistics',
    message: 'No data yet',
    text: 'Your statistics will appear here after you start logging rides.',
  },
};

export function EmptyPage({ section }: { section: keyof typeof sections }) {
  const content = sections[section];
  return (
    <>
      <h1>{content.title}</h1>
      <div className="panel empty-state">
        <h2>{content.message}</h2>
        <p>{content.text}</p>
        <Link className="text-link" to="/">
          Back to home
        </Link>
      </div>
    </>
  );
}
