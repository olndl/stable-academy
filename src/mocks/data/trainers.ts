import type { Trainer } from '../../types/course.ts';

// All trainers and courses in the demo are fictional.
export const trainers: Trainer[] = [
  {
    id: 'anna-weber',
    name: 'Anna Weber',
    bio: 'Anna focuses on the basics of dressage and helps riders develop a balanced, quiet seat.',
    disciplines: ['dressage'],
  },
  {
    id: 'tom-becker',
    name: 'Tom Becker',
    bio: 'Tom teaches jumping with an emphasis on rhythm, straight lines and clear preparation.',
    disciplines: ['jumping'],
  },
  {
    id: 'lena-fischer',
    name: 'Lena Fischer',
    bio: 'Lena works with horses from the ground and teaches riders to notice small changes in their responses.',
    disciplines: ['groundwork'],
  },
  {
    id: 'max-keller',
    name: 'Max Keller',
    bio: 'Max introduces everyday stable routines, grooming and preparation before a ride.',
    disciplines: ['horse-care'],
  },
];
