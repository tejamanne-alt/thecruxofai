'use client'

import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Description, Field, FieldGroup, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { Select } from '@/components/catalyst/select'
import { Textarea } from '@/components/catalyst/textarea'
import { useCustom } from '@/lib/custom/store'
import { courses, groups, type ChartKind, type GroupId } from '@/lib/data/curriculum'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CHART_OPTIONS: Array<{ id: ChartKind | 'none'; label: string }> = [
  { id: 'none', label: 'No graphic — words only' },
  { id: 'line', label: 'Line through points (regression)' },
  { id: 'bowl', label: 'Bowl and a ball (optimisation)' },
  { id: 'clusters', label: 'Clusters and flags (grouping)' },
  { id: 'boundary', label: 'Split the plane (classification)' },
]

export function LoginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { hasPin, signIn } = useCustom()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit() {
    const err = signIn(code)
    if (err) {
      setError(err)
      return
    }
    setCode('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} size="md">
      <DialogTitle>{hasPin ? 'Admin sign in' : 'Set an admin passcode'}</DialogTitle>
      <DialogDescription>
        {hasPin
          ? 'Enter the passcode you set on this browser. Editing tools stay hidden for everyone else.'
          : 'Nobody has claimed this copy yet. Pick a passcode and you become the admin — the only one who can add or delete sessions.'}
      </DialogDescription>
      <DialogBody>
        <Field>
          <Label>Passcode</Label>
          <Input
            type="password"
            value={code}
            autoFocus
            onChange={(e) => {
              setCode(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          {error ? (
            <Description className="text-red-600">{error}</Description>
          ) : (
            <Description>
              This is a visibility gate, not security. It hides the editing buttons in this browser; it does not protect
              anything, because the whole site runs on your machine. Real protection needs server-side auth on the write
              endpoints.
            </Description>
          )}
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit}>{hasPin ? 'Sign in' : 'Claim this copy'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export function AddSessionDialog({ open, group, onClose }: { open: boolean; group: GroupId; onClose: () => void }) {
  const { add } = useCustom()
  const router = useRouter()
  const firstCourse = courses.find((c) => c.group === group)?.id ?? 'ml'

  const [title, setTitle] = useState('')
  const [groupId, setGroupId] = useState<GroupId>(group)
  const [courseId, setCourseId] = useState(firstCourse)
  const [summary, setSummary] = useState('')
  const [math, setMath] = useState('')
  const [chart, setChart] = useState<ChartKind | 'none'>('line')
  const [image, setImage] = useState<string | null>(null)
  const [files, setFiles] = useState<string[]>([])

  // Re-key the form when the caller opens it against a different section.
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

    const img = arr.find((f) => /^image\//.test(f.type) && f.size < 3.5 * 1024 * 1024)
    if (img) {
      const reader = new FileReader()
      reader.onload = () => setImage(String(reader.result))
      reader.readAsDataURL(img)
    }
    const txt = arr.find((f) => /^text\//.test(f.type) || /\.(md|txt)$/i.test(f.name))
    if (txt && !summary.trim()) setSummary(await txt.text())
  }

  function submit() {
    const item = add({
      title: title.trim() || 'Untitled session',
      group: groupId,
      courseId,
      summary,
      math,
      chart,
      image,
      files,
    })
    onClose()
    setTitle('')
    setSummary('')
    setMath('')
    setImage(null)
    setFiles([])
    router.push(`/my/${item.id}`)
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
                  ? `Attached: ${files.join(' · ')}${image ? ' — the image is shown on the page.' : ''}`
                  : 'Slides, PDFs, board photos or a text file. Images are embedded, text files pre-fill the write-up, and every filename is listed as the source. PDF and PPTX contents are not read in the browser — they are recorded as sources only.'}
              </Description>
            </Field>
          </div>
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit}>Create session</Button>
      </DialogActions>
    </Dialog>
  )
}
