import { Link } from 'react-router';

const sections = {
  courses: {
    eyebrow: 'The course library',
    title: 'Room for your next discovery.',
    text: 'Our first riding courses are on their way. Soon you’ll be able to browse by discipline and experience level.',
    badge: 'Courses are coming soon',
  },
  learning: {
    eyebrow: 'My learning',
    title: 'Every journey starts somewhere.',
    text: 'Your saved courses and lesson progress will live here. The library is being prepared — check back soon.',
    badge: 'No courses yet',
  },
  diary: {
    eyebrow: 'Training diary',
    title: 'Small moments. Real progress.',
    text: 'A place to reflect on your rides. Training notes, goals and the little things you want to remember are coming soon.',
    badge: 'Your notebook is on its way',
  },
  statistics: {
    eyebrow: 'Your riding, in perspective',
    title: 'See how far you’ve come.',
    text: 'Once the training diary is ready, you’ll find your weekly activity, disciplines and mood here.',
    badge: 'Waiting for your first rides',
  },
};

export function EmptyPage({ section }: { section: keyof typeof sections }) {
  const content = sections[section];
  return (
    <section className="empty-page">
      <p className="eyebrow">{content.eyebrow}</p>
      <span className="empty-symbol" aria-hidden="true">
        ✳
      </span>
      <h1>{content.title}</h1>
      <p className="empty-description">{content.text}</p>
      <p className="empty-badge">{content.badge}</p>
      <Link className="text-link" to="/">
        Back to overview <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
