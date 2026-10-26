import type { Course, Lesson } from '../../types/course.ts';
import { trainers } from './trainers.ts';

function lessons(
  courseId: string,
  entries: [string, string, number][],
): Lesson[] {
  return entries.map(([title, description, durationSeconds], index) => ({
    id: `${courseId}-${index + 1}`,
    title,
    description,
    durationSeconds,
    // Stock videos will be selected when the player is added on day 7.
    videoUrl: null,
  }));
}

const [anna, tom, lena, max] = trainers;

export const courses: Course[] = [
  {
    id: 'balanced-seat',
    title: 'Build a balanced seat',
    description:
      'Start with your position at walk and trot. Learn to recognise tension and make small adjustments without losing your balance.',
    discipline: 'dressage',
    level: 'beginner',
    imageUrl:
      'https://images.pexels.com/photos/17393032/pexels-photo-17393032.jpeg?auto=compress&cs=tinysrgb&w=800',
    trainer: anna,
    lessons: lessons('balanced-seat', [
      [
        'Find your neutral position',
        'Look at your alignment and notice where you hold tension.',
        420,
      ],
      [
        'Follow the walk',
        'Practise following the movement through your hips and back.',
        540,
      ],
      [
        'Your first sitting trot exercises',
        'Work on short stretches of sitting trot with breaks.',
        600,
      ],
    ]),
  },
  {
    id: 'clear-transitions',
    title: 'Clearer transitions',
    description:
      'Prepare for changes of pace, coordinate your aids and keep a steady rhythm through each transition.',
    discipline: 'dressage',
    level: 'intermediate',
    imageUrl:
      'https://images.pexels.com/photos/7098068/pexels-photo-7098068.jpeg?auto=compress&cs=tinysrgb&w=800',
    trainer: anna,
    lessons: lessons('clear-transitions', [
      [
        'Prepare before you ask',
        'Plan the transition and check your rhythm first.',
        480,
      ],
      [
        'Walk to trot and back',
        'Use a simple exercise to make your aids more consistent.',
        660,
      ],
      [
        'Keep balance in canter transitions',
        'Build transitions into a short schooling pattern.',
        720,
      ],
    ]),
  },
  {
    id: 'first-poles',
    title: 'Your first pole exercises',
    description:
      'Use simple pole layouts to practise a steady approach, look ahead and follow your horse over the poles.',
    discipline: 'jumping',
    level: 'beginner',
    imageUrl:
      'https://images.pexels.com/photos/14233053/pexels-photo-14233053.jpeg?auto=compress&cs=tinysrgb&w=800',
    trainer: tom,
    lessons: lessons('first-poles', [
      [
        'Introduce a single pole',
        'Begin with one pole at walk and keep your line simple.',
        360,
      ],
      [
        'Find a steady trot',
        'Ride a short line of poles with a consistent approach.',
        540,
      ],
      [
        'Put the exercise together',
        'Link the pole exercise with a large circle and a change of rein.',
        600,
      ],
    ]),
  },
  {
    id: 'jumping-lines',
    title: 'Plan your jumping lines',
    description:
      'Work through turns, related distances and a short course with a clear plan for rhythm and direction.',
    discipline: 'jumping',
    level: 'advanced',
    imageUrl:
      'https://images.pexels.com/photos/17393032/pexels-photo-17393032.jpeg?auto=compress&cs=tinysrgb&w=800',
    trainer: tom,
    lessons: lessons('jumping-lines', [
      [
        'Walk the line',
        'Break down the approach, landing and next turn before riding.',
        480,
      ],
      [
        'Ride a related distance',
        'Observe the canter and compare different approaches.',
        780,
      ],
      [
        'Review a short course',
        'Put the lines together and reflect on each round.',
        840,
      ],
    ]),
  },
  {
    id: 'groundwork-basics',
    title: 'Groundwork basics',
    description:
      'Practise leading, stopping and changing direction with calm, consistent signals from the ground.',
    discipline: 'groundwork',
    level: 'beginner',
    imageUrl:
      'https://images.pexels.com/photos/7098068/pexels-photo-7098068.jpeg?auto=compress&cs=tinysrgb&w=800',
    trainer: lena,
    lessons: lessons('groundwork-basics', [
      [
        'Start with leading',
        'Notice your position and practise walking together.',
        420,
      ],
      [
        'Ask for a quiet halt',
        'Make your stop signal clear and allow time for a response.',
        480,
      ],
      [
        'Change direction together',
        'Use a few simple turns to practise consistency.',
        540,
      ],
    ]),
  },
  {
    id: 'stable-routine',
    title: 'A simple stable routine',
    description:
      'Build a consistent routine around grooming, equipment checks and looking after your horse after a ride.',
    discipline: 'horse-care',
    level: 'beginner',
    imageUrl:
      'https://images.pexels.com/photos/14233053/pexels-photo-14233053.jpeg?auto=compress&cs=tinysrgb&w=800',
    trainer: max,
    lessons: lessons('stable-routine', [
      [
        'Organise your grooming kit',
        'Get familiar with the tools in a basic grooming kit.',
        360,
      ],
      [
        'Prepare for a ride',
        'Follow a simple grooming and equipment preparation routine.',
        600,
      ],
      [
        'Finish your stable visit',
        'Put equipment away and review the session in your notes.',
        420,
      ],
    ]),
  },
];
