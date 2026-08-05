'use client'

import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Description, Field, FieldGroup, Label } from '@/components/catalyst/fieldset'
import { Input } from '@/components/catalyst/input'
import { useCustom } from '@/lib/custom/store'
import { useState } from 'react'

/**
 * Real authentication, replacing the prototype's passcode gate. What you can
 * write is enforced by row-level security in Postgres — this dialog only gets
 * you a session; it is not what protects anything.
 */
export function AuthDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp, configured } = useCustom()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  function reset() {
    setPassword('')
    setError('')
    setNotice('')
    setBusy(false)
  }

  async function submit() {
    if (busy) return
    setError('')
    setNotice('')
    setBusy(true)

    if (mode === 'signin') {
      const err = await signIn(email.trim(), password)
      setBusy(false)
      if (err) {
        setError(err)
        return
      }
      reset()
      onClose()
      return
    }

    const { error: err, needsConfirmation } = await signUp(email.trim(), password)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    if (needsConfirmation) {
      setNotice('Check your email for the confirmation link, then sign in.')
      setMode('signin')
      setPassword('')
      return
    }
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} size="md">
      <DialogTitle>{mode === 'signin' ? 'Sign in' : 'Create an account'}</DialogTitle>
      <DialogDescription>
        {mode === 'signin'
          ? 'Everything on the site is readable without an account. Signing in is for the people who maintain it.'
          : 'Accounts are for maintainers. Creating one does not grant write access on its own — an existing maintainer has to add you.'}
      </DialogDescription>
      <DialogBody>
        {!configured ? (
          <p className="text-sm text-zinc-600">
            This deployment has no Supabase configuration, so accounts are unavailable. The four built sessions and the
            whole curriculum still work.
          </p>
        ) : (
          <FieldGroup>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
              />
            </Field>
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              {error ? (
                <Description className="text-red-600">{error}</Description>
              ) : notice ? (
                <Description className="text-green-700">{notice}</Description>
              ) : (
                <Description>
                  Handled by Supabase Auth. Signing in is only how you prove who you are — what you can actually change
                  is enforced by row-level security in the database, on every request.
                </Description>
              )}
            </Field>
          </FieldGroup>
        )}
      </DialogBody>
      <DialogActions>
        {configured && (
          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
              setError('')
              setNotice('')
            }}
            className="mr-auto cursor-pointer text-[13px] font-medium"
            style={{ color: 'var(--acc)' }}
          >
            {mode === 'signin' ? 'Create an account instead' : 'I already have an account'}
          </button>
        )}
        <Button plain onClick={onClose}>
          Cancel
        </Button>
        {configured && (
          <Button onClick={submit} disabled={busy || !email.trim() || !password}>
            {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
