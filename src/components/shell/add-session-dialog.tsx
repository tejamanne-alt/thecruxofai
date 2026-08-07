'use client'

import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Description, Field, FieldGroup, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { Select } from '@/components/catalyst/select'
import { Textarea } from '@/components/catalyst/textarea'
import { MAX_IMAGE_BYTES } from '@/lib/custom/session'
import { useCustom } from '@/lib/custom/store'
import { courses, groups, SESSION_KINDS, type ChartKind, type GroupId, type SessionKind } from '@/lib/data/curriculum'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CHART_OPTIONS: Array<{ id: ChartKind | 'none'; label: string }> = [
  { id: 'none', label: 'No graphic — words only' },
  { id: 'line', label: 'Line through points (regression)' },
  { id: 'bowl', label: 'Bowl and a ball (optimisation)' },
  { id: 'clusters', label: 'Clusters and flags (grouping)' },
  { id: 'boundary', label: 'Split the plane (classification)' },
]

export function AddSessionDialog({ open, group, onClose }: { open: boolean; group: GroupId; onClose: () => void }) {
  const { add } = useCustom()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [groupId, setGroupId] = useState<GroupId>(group)
  const [courseId, setCourseId] = useState(courses.find((c) => c.group === group)?.id ?? 'ml')
  const [summary, setSummary] = useState('')
  const [math, setMath] = useState('')
  const [chart, setChart] = useState<ChartKind | 'none'>('line')
  const [kind, setKind] = useState<SessionKind>('concept')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [files, setFiles] = useState<string[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Re-point the form when the caller opens it against a different section.
  const [lastGroup, setLastGroup] = useState(group)
  if (open && lastGroup !== group) {
    setLastGroup(group)
    setGroupId(group)
    setCourseId(courses.find((c) => c.group === group)?.id ?? courseId)
  }

  const courseOptions = courses.filter((c) => c.group === groupId)

  async function onFiles(list: FileList | null) {
    const arr = Array.from(list ?? [])
    setFiles(arr.map((f) => `${f.name} (${Math.round(f.size / 1024)} KB)`))
    setError('')

    const img = arr.find((f) => /^image\//.test(f.type))
    if (img && img.size > MAX_IMAGE_BYTES) {
      setError(`${img.name} is over 3.5 MB — it will not be uploaded. Shrink it and pick it again.`)
      setImageFile(null)
    } else {
      setImageFile(img ?? null)
    }

    const txt = arr.find((f) => /^text\//.test(f.type) || /\.(md|txt)$/i.test(f.name))
    if (txt && !summary.trim()) setSummary(await txt.text())
  }

  async function submit() {
    if (busy) return
    setBusy(true)
    setError('')

    const result = await add({ title, group: groupId, courseId, kind, summary, math, chart, files, imageFile })
    setBusy(false)

    if ('error' in result) {
      setError(result.error)
      return
    }

    onClose()
    setTitle('')
    setSummary('')
    setMath('')
    setImageFile(null)
    setFiles([])
    // The layout fetches sessions on the server, so refresh the tree too.
    router.push(`/my/${result.id}`)
    router.refresh()
  }

  return (
    <Dialog open={open} onClose={onClose} size="2xl">
      <DialogTitle>Add a session</DialogTitle>
      <DialogDescription>
        One weekend, one page. Write it the way you would explain it to a friend who missed the class.
      </DialogDescription>
      <DialogBody>
        <FieldGroup>
          <Field>
            <Label>Session title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Support vector machines" />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <Label>Section</Label>
              <Select
                value={groupId}
                onChange={(e) => {
                  const g = e.target.value as GroupId
                  setGroupId(g)
                  setCourseId(courses.find((c) => c.group === g)?.id ?? courseId)
                }}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Course</Label>
              <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                {courseOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field>
            <Label>Which bucket does it belong in?</Label>
            <Select value={kind} onChange={(e) => setKind(e.target.value as SessionKind)}>
              {SESSION_KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label} — {k.blurb}
                </option>
              ))}
            </Select>
            <Description>
              A <strong>concept</strong> is one idea explained on its own terms, and often turns up in more than one
              course. A <strong>chapter</strong> is this course&rsquo;s own material, in the order it was taught.
            </Description>
          </Field>

          <Field>
            <Label>Explain it the way you&rsquo;d explain it to a friend</Label>
            <Textarea
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What is the idea, why does it matter, where does it break?"
            />
          </Field>

          <Field>
            <Label>
              Formulas and symbols — one per line, as <code className="font-mono">symbol = meaning</code>
            </Label>
            <Textarea
              rows={4}
              className="font-mono"
              value={math}
              onChange={(e) => setMath(e.target.value)}
              placeholder={'λ = regularisation strength\nErr = bias² + variance + noise'}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <Label>Interactive graphic</Label>
              <Select value={chart} onChange={(e) => setChart(e.target.value as ChartKind | 'none')}>
                {CHART_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>Upload documents</Label>
              <input
                type="file"
                multiple
                onChange={(e) => onFiles(e.target.files)}
                className="w-full rounded-lg border border-dashed border-zinc-950/25 bg-zinc-50 p-[7px] text-xs text-zinc-600"
              />
              <Description>
                {files.length
                  ? `Attached: ${files.join(' · ')}${imageFile ? ' — the image is uploaded and shown on the page.' : ''}`
                  : 'Slides, PDFs, board photos or a text file. Images go to Supabase Storage, text files pre-fill the write-up, and every filename is listed as the source. PDF and PPTX contents are not read in the browser — they are recorded as sources only.'}
              </Description>
            </Field>
          </div>

          {error && <p className="text-[13px] text-red-600">{error}</p>}
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={busy}>
          {busy ? 'Saving…' : 'Create session'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
