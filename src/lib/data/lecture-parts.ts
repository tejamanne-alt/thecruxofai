import type { TopicId } from './curriculum'

/**
 * A chapter is a whole lecture, which is too much for one page. So it is split
 * into parts, and each part is its own page and its own row in the left menu.
 * You can send someone a link to one idea instead of to a wall of text.
 *
 * This file holds names only — no components. The left menu imports it, and the
 * menu must not drag every chart on the site into its bundle.
 */
export interface PartMeta {
  id: string
  /** Short name, shown in the menu. */
  title: string
  /** One line, shown on the chapter's front page and under the menu row. */
  teaser: string
  /** Which slides of the lecture this part came from. */
  slides?: string
}

export const LECTURE_PARTS: Partial<Record<TopicId, PartMeta[]>> = {
  lec1: [
    {
      id: 'what',
      title: 'What linear algebra is',
      teaser: 'It is the study of vectors, and the rules for adding and stretching them.',
      slides: 'Slides 1–2',
    },
    {
      id: 'equation',
      title: 'A linear equation is a line',
      teaser: 'One equation with two unknowns has a whole line of right answers.',
      slides: 'Slides 1–2',
    },
    {
      id: 'system',
      title: 'Putting equations together',
      teaser: 'Add two equations and one unknown can vanish. That trick runs the whole lecture.',
      slides: 'Slides 2–4',
    },
    {
      id: 'workshop',
      title: 'A real one: the furniture workshop',
      teaser: 'Four resources, three products, and a table that turns into equations.',
      slides: 'Slides 3–4',
    },
    {
      id: 'howmany',
      title: 'How many answers can there be?',
      teaser: 'Only three: one, none, or endless. Drag two lines and try to find a fourth.',
      slides: 'Slides 4–8',
    },
    {
      id: 'planes',
      title: 'The same idea in 3D',
      teaser: 'With three unknowns each equation is a flat sheet. Spin them and watch them meet.',
      slides: 'Slides 7–9',
    },
    {
      id: 'matrices',
      title: 'What a matrix is',
      teaser: 'A box of numbers in rows and columns. A vector is a box one column wide.',
      slides: 'Slide 9',
    },
    {
      id: 'arithmetic',
      title: 'Adding and multiplying matrices',
      teaser: 'Adding is easy. Multiplying is the odd one — click a number and see where it came from.',
      slides: 'Slides 10–11, 14',
    },
    {
      id: 'inverse',
      title: 'The inverse and the transpose',
      teaser: 'An undo button that goes missing when one number hits zero.',
      slides: 'Slides 11–13',
    },
    {
      id: 'axb',
      title: 'Writing it all as Ax = b',
      teaser: 'A whole page of equations shrinks to three letters. Edit one and watch the other change.',
      slides: 'Slides 14–15',
    },
    {
      id: 'columns',
      title: 'x is a recipe for mixing columns',
      teaser: 'The better way to read Ax = b. It makes "no answer" obvious instead of odd.',
      slides: 'Slides 15–16',
    },
    {
      id: 'general',
      title: 'One answer, then all of them',
      teaser: 'Find any answer, then find every move that goes nowhere. Slide along the answer line.',
      slides: 'Slides 16–19',
    },
    {
      id: 'moves',
      title: 'The three moves you may use',
      teaser: 'Watch the lines change while the crossing point stays put. That is why they are safe.',
      slides: 'Slide 20',
    },
    {
      id: 'lab',
      title: 'Gaussian elimination, step by step',
      teaser: 'The full method on the lecture’s own systems. One legal move per press.',
      slides: 'Slides 21–24',
    },
    {
      id: 'echelon',
      title: 'The staircase: pivots and free variables',
      teaser: 'Spot the pivots yourself, and see which unknowns you get to choose.',
      slides: 'Slides 24–25',
    },
    {
      id: 'rref',
      title: 'Going further: the tidiest form',
      teaser: 'Clear above the pivots too, and the answers can just be read off.',
      slides: 'Slides 26–29',
    },
    {
      id: 'recipe',
      title: 'The method as a recipe',
      teaser: 'Zero out below the diagonal, then above it. Step through the pattern.',
      slides: 'Slides 29–30',
    },
    {
      id: 'invert',
      title: 'Bonus: it also finds the inverse',
      teaser: 'Put A next to I, run the method, and the inverse appears where I was.',
      slides: 'Slide 31',
    },
  ],
}

export function partsOf(topic: TopicId): PartMeta[] {
  return LECTURE_PARTS[topic] ?? []
}

export function partIndex(topic: TopicId, partId: string) {
  return partsOf(topic).findIndex((p) => p.id === partId)
}
