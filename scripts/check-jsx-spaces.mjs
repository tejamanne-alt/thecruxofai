/**
 * Finds words that get glued together when JSX is compiled.
 *
 * JSX throws away the whitespace at the start and end of every line of a text
 * node. So this, which reads perfectly well in the editor:
 *
 *     nothing has said how <em>long</em> one is or what
 *     <em>angle</em> sits between two of them.
 *
 * compiles to "...one is or whatangle sits between two of them." The space is
 * gone, because it was the last thing on its line. Nothing warns you: the page
 * builds, the types check, and the mistake only shows up when you read the
 * sentence — usually the night before an exam.
 *
 * Prettier re-wraps prose every time it runs, so any line can become the last
 * line at any moment. That makes this a class of bug rather than a typo, and
 * the only safe guard is to check the compiled output rather than the source.
 * This walks the real parse tree and applies the real whitespace rule, so it
 * reports the joins a browser would actually show. A regular expression cannot
 * do this — it flags hundreds of innocent lines and still misses real ones.
 *
 * The fix is always the same: write the space as {' '} so it survives.
 *
 * Two kinds of join get reported:
 *
 *   ERROR — text next to an element, as above. A space was meant. These fail.
 *   note  — text next to a {...} expression, like "carr{plural}" or "{d}x₂²".
 *           Gluing is nearly always the point, and Prettier only ever breaks a
 *           line there when no space was meant, so these are printed for a
 *           human to glance at and never fail the check.
 *
 *   node scripts/check-jsx-spaces.mjs
 */
import { globSync, readFileSync } from 'node:fs'
import ts from 'typescript'

const files = globSync('src/**/*.tsx').sort()

/** React's rule: drop whitespace-only first and last lines, trim each line's
 *  edges where a newline is involved, and join what is left with one space. */
function emitted(raw) {
  const lines = raw.split('\n')
  const kept = []
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (i > 0) line = line.replace(/^[ \t\r]+/, '')
    if (i < lines.length - 1) line = line.replace(/[ \t\r]+$/, '')
    if (line === '' && (i === 0 || i === lines.length - 1)) continue
    kept.push(line)
  }
  return kept.join(' ')
}

/** Characters after which, or before which, a reader expects a space. */
const WORDY_END = /[\p{L}\p{N}\p{M}.,;:!?%)\]}’”]$/u
const WORDY_START = /^[\p{L}\p{N}\p{M}(\[{‘“]/u

/** Tags that attach to the word beside them rather than standing apart, so
 *  "a<sub>11</sub>" reads as a₁₁ and is not a missing space. */
const ATTACHED = new Set(['sub', 'sup'])

function tagName(node) {
  if (ts.isJsxElement(node)) return node.openingElement.tagName.getText()
  if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText()
  return ''
}

/** What a child contributes at one of its edges, as far as we can tell
 *  statically. Returns '' when it contributes nothing (so we look further). */
function edgeText(node, side) {
  if (ts.isJsxText(node)) return emitted(node.text)
  if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
    const kids = node.children
    for (let i = 0; i < kids.length; i++) {
      const k = side === 'end' ? kids[kids.length - 1 - i] : kids[i]
      const t = edgeText(k, side)
      if (t !== '') return t
    }
    return ''
  }
  if (ts.isJsxExpression(node)) return expressionEdge(node.expression, side)
  return ''
}

/** An expression's edge. String literals are exactly how a deliberate space is
 *  written, so they must be read properly — {' '} is not a word. Conditionals
 *  and && guards are followed into their branches for the same reason. */
function expressionEdge(e, side) {
  if (!e) return ''
  if (ts.isParenthesizedExpression(e)) return expressionEdge(e.expression, side)
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text
  if (ts.isJsxElement(e) || ts.isJsxFragment(e) || ts.isJsxSelfClosingElement(e)) return edgeText(e, side)
  if (ts.isConditionalExpression(e)) {
    // Either branch can render, so the join is only safe if both are.
    const a = expressionEdge(e.whenTrue, side)
    const b = expressionEdge(e.whenFalse, side)
    return side === 'end' ? (WORDY_END.test(a) ? a : b) : WORDY_START.test(a) ? a : b
  }
  if (ts.isBinaryExpression(e)) {
    const k = e.operatorToken.kind
    if (k === ts.SyntaxKind.AmpersandAmpersandToken) return expressionEdge(e.right, side)
    if (k === ts.SyntaxKind.BarBarToken || k === ts.SyntaxKind.QuestionQuestionToken) {
      const a = expressionEdge(e.left, side)
      return a !== '' ? a : expressionEdge(e.right, side)
    }
  }
  return 'x' // renders some value; treat as a word
}

const errors = []
const notes = []

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  const record = (list, node, glued) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getEnd())
    list.push({ file, line: line + 1, glued })
  }

  const visit = (node) => {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const kids = node.children
      for (let i = 0; i < kids.length; i++) {
        const cur = kids[i]
        if (!ts.isJsxText(cur)) continue
        const raw = cur.text
        const out = emitted(raw)
        if (out === '') continue

        // A leading space was eaten by a line break, and the sibling before
        // this text ends in a word.
        if (i > 0 && /^[ \t]*\r?\n/.test(raw) && WORDY_START.test(out)) {
          const prev = kids[i - 1]
          if (ATTACHED.has(tagName(prev))) continue
          const before = edgeText(prev, 'end')
          if (before !== '' && WORDY_END.test(before)) {
            const glue = `${before.slice(-20)}|${out.slice(0, 20)}`
            record(ts.isJsxExpression(prev) ? notes : errors, prev, glue)
          }
        }

        // A trailing space was eaten, and the sibling after starts with a word.
        if (i + 1 < kids.length && /\r?\n[ \t]*$/.test(raw) && WORDY_END.test(out)) {
          const next = kids[i + 1]
          if (ATTACHED.has(tagName(next))) continue
          const after = edgeText(next, 'start')
          if (after !== '' && WORDY_START.test(after)) {
            const glue = `${out.slice(-20)}|${after.slice(0, 20)}`
            record(ts.isJsxExpression(next) ? notes : errors, cur, glue)
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}

for (const n of notes) console.log(`note  ${n.file}:${n.line}  ${n.glued}`)
for (const e of errors) console.log(`ERROR ${e.file}:${e.line}  ${e.glued}`)

if (errors.length === 0) {
  console.log(`\nno glued words in ${files.length} .tsx files (${notes.length} deliberate join(s) noted)`)
  process.exit(0)
}
console.log(`\n${errors.length} place(s) where JSX will glue two words together. Write the space as {' '}.`)
process.exit(1)
