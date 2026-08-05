import { courseById, courseOfTopic, groupById, sessionById, type Course, type TopicId } from '@/lib/data/curriculum'
import { knowledge, type ExamQuestion, type QuizQuestion } from '@/lib/data/knowledge'

export interface ScopedCheat {
  formula: string
  why: string
  from: string
}
export interface ScopedQuiz extends QuizQuestion {
  from: string
}

/**
 * What the four top-bar tabs act on. A session scopes to itself; a course
 * aggregates every session under it. Global pages have no scope, and therefore
 * no tabs at all.
 */
export interface Scope {
  /** Namespaces the quiz answers and expanded exam rows, so switching resets them. */
  key: string
  name: string
  kicker: string
  cheat: ScopedCheat[]
  quiz: ScopedQuiz[]
  exam: ExamQuestion[]
}

export function scopeForSession(topic: TopicId): Scope {
  const meta = sessionById[topic]
  const course = courseOfTopic(topic)
  const k = knowledge[topic]
  return {
    key: `session:${topic}`,
    name: meta.label,
    kicker: course ? `${course.name} · session` : 'session',
    cheat: k.cheat.map((c) => ({ ...c, from: meta.label })),
    quiz: k.quiz.map((q) => ({ ...q, from: meta.label })),
    exam: k.exam,
  }
}

export function scopeForCourse(course: Course): Scope {
  const cheat: ScopedCheat[] = []
  const quiz: ScopedQuiz[] = []
  const exam: ExamQuestion[] = []
  for (const topic of course.topics) {
    const k = knowledge[topic]
    if (!k) continue
    const label = sessionById[topic].label
    k.cheat.forEach((c) => cheat.push({ ...c, from: label }))
    k.quiz.forEach((q) => quiz.push({ ...q, from: label }))
    k.exam.forEach((e) => exam.push(e))
  }
  return {
    key: `course:${course.id}`,
    name: course.name,
    kicker: `${groupById[course.group]?.label ?? ''} · course`,
    cheat,
    quiz,
    exam,
  }
}

export function scopeForCourseId(courseId: string): Scope | null {
  const course = courseById[courseId]
  return course ? scopeForCourse(course) : null
}

/**
 * A user-added session has no quiz or exam bank — only the `symbol = meaning`
 * lines they typed. Saying so beats inventing questions.
 */
export function scopeForCustom(id: string, title: string, kicker: string, math: string): Scope {
  const cheat = math
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.indexOf('=')
      return at > 0
        ? { formula: line.slice(0, at).trim(), why: line.slice(at + 1).trim(), from: title }
        : { formula: line, why: '', from: title }
    })
  return { key: `custom:${id}`, name: title, kicker, cheat, quiz: [], exam: [] }
}
