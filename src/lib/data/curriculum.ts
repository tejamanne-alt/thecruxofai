import raw from './curriculum.json'

export type GroupId = 's1' | 's2' | 'eg' | 'edl' | 'enlp' | 'eav' | 's4'
export type TopicId =
  | 'algebra'
  | 'linalg'
  | 'regression'
  | 'gradient'
  | 'kmeans'
  | 'perceptron'
  | 'matmul'
  | 'determinant'
  | 'rank'
  | 'dotproduct'
  | 'covariance'
  | 'vectorspace'
  | 'basis'
  | 'lec0a'
  | 'lec0b'
  | 'lec1'
  | 'lec2'
  | 'ism1'
  | 'ism2'
  | 'centre'
  | 'spread'
  | 'outliers'
  | 'probability'
  | 'events'
export type ChartKind = 'line' | 'bowl' | 'clusters' | 'boundary'

/**
 * Every page under a course sits in one of two buckets.
 *
 *   concept — one idea, explained on its own terms. Algebra, gradient descent.
 *             Reusable: the same concept underpins several courses.
 *   chapter — the course's own material as it was actually taught, in the
 *             order it was taught. Tied to this course and nothing else.
 *
 * Keeping them apart matters for revision: before an exam you want the
 * chapters, and when something will not click you want the concept.
 */
export type SessionKind = 'concept' | 'chapter'

export const SESSION_KINDS: Array<{ id: SessionKind; label: string; blurb: string }> = [
  { id: 'concept', label: 'Concepts', blurb: 'One idea, explained on its own terms.' },
  { id: 'chapter', label: 'Chapters', blurb: 'The course material, in the order it was taught.' },
]

export interface Group {
  id: GroupId
  label: string
  meta: string
  hint: string
}

export interface Course {
  id: string
  group: GroupId
  name: string
  topics: TopicId[]
  /** Brochure text where it exists; otherwise the honest stand-in below. */
  syllabus: string
  /** True when the brochure prints the title without a syllabus. */
  syllabusIsPlaceholder: boolean
}

export interface SessionMeta {
  id: TopicId
  label: string
  blurb: string
  kind: SessionKind
  /**
   * Only a hint about which template a session resembles. Built-in sessions
   * render their own bespoke component, so nothing reads this — the two
   * foundation pages have graphics with no template equivalent and omit it.
   */
  chart?: ChartKind
}

/**
 * Courses the brochure lists by title only. Saying so is deliberate — nothing
 * on this site is invented to fill a gap.
 */
function placeholderSyllabus(group: GroupId) {
  return group === 's1' || group === 's2'
    ? 'This is a core course of the semester, but the brochure prints its title without a detailed syllabus. Its real scope goes here once the sessions begin.'
    : 'The brochure lists this course in the elective pool without a detailed syllabus. Its scope goes here after the first session.'
}

export const groups: Group[] = raw.groups as Group[]

export const courses: Course[] = (
  raw.courses as Array<Omit<Course, 'syllabus' | 'syllabusIsPlaceholder'> & { syllabus: string | null }>
).map((c) => ({
  id: c.id,
  group: c.group,
  name: c.name,
  topics: c.topics,
  syllabus: c.syllabus ?? placeholderSyllabus(c.group),
  syllabusIsPlaceholder: c.syllabus === null,
}))

export const sessions: SessionMeta[] = Object.entries(
  raw.sessions as Record<string, { label: string; blurb: string; kind: SessionKind; chart?: ChartKind }>
).map(([id, s]) => ({ id: id as TopicId, ...s }))

export const sessionById = Object.fromEntries(sessions.map((s) => [s.id, s])) as Record<TopicId, SessionMeta>
export const courseById = Object.fromEntries(courses.map((c) => [c.id, c])) as Record<string, Course>
export const groupById = Object.fromEntries(groups.map((g) => [g.id, g])) as Record<GroupId, Group>

export function coursesInGroup(id: GroupId) {
  return courses.filter((c) => c.group === id)
}

export function courseOfTopic(topic: TopicId): Course | undefined {
  return courses.find((c) => c.topics.includes(topic))
}

export function topicsOfKind(course: Course, kind: SessionKind) {
  return course.topics.filter((t) => sessionById[t].kind === kind)
}

export function isTopicId(value: string): value is TopicId {
  return value in sessionById
}
