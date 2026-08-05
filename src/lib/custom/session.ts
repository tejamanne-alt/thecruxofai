import type { ChartKind, GroupId } from '@/lib/data/curriculum'
import type { SessionRow } from '@/lib/supabase/database.types'
import { SUPABASE_URL } from '@/lib/supabase/env'

export const IMAGE_BUCKET = 'session-images'
/** Matches the ceiling set on the storage bucket itself. */
export const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024

/** A session page written by a signed-in user, as the app consumes it. */
export interface CustomSession {
  id: string
  title: string
  group: GroupId
  courseId: string
  summary: string
  /** One `symbol = meaning` per line. Becomes the legend and the cheat sheet. */
  math: string
  chart: ChartKind | 'none'
  /** Object path inside the bucket, or null. Use `imageUrl` for a src. */
  imagePath: string | null
  /** Filenames and sizes of everything uploaded, kept as the source list. */
  files: string[]
  authorId: string
  createdAt: string
}

/** The bucket is public-read, so the object URL can be built without a request. */
export function imageUrl(path: string | null | undefined) {
  if (!path || !SUPABASE_URL) return null
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`
}

export function rowToSession(row: SessionRow): CustomSession {
  return {
    id: row.id,
    title: row.title,
    group: row.group_id as GroupId,
    courseId: row.course_id,
    summary: row.summary,
    math: row.math,
    chart: row.chart as ChartKind | 'none',
    imagePath: row.image_path,
    // `files` is jsonb, so it is only a string[] by convention — verify rather
    // than cast, otherwise a hand-edited row crashes the page that renders it.
    files: Array.isArray(row.files) ? row.files.filter((f): f is string => typeof f === 'string') : [],
    authorId: row.author_id,
    createdAt: row.created_at,
  }
}
