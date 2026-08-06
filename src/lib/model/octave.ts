/**
 * A very small Octave, just big enough for the matrix commands in Lecture 0a.
 *
 * The lecture keeps saying "and here is how you do it in Octave". Screenshots
 * of a terminal teach nobody anything, so the site runs the commands instead.
 * It understands matrix literals, + − × ÷, the transpose quote, and the handful
 * of functions on slides 15 and 40. Anything else it turns down politely.
 */
import { fr, frAdd, frDiv, frIsZero, frStr, type Fr } from './fraction'
import {
  addM,
  detM,
  eqM,
  identity,
  inverseOf,
  isSquare,
  mulM,
  ncols,
  nrows,
  onesM,
  rankOf,
  rrefOf,
  scaleM,
  subM,
  transposeM,
  zerosM,
  type FMat,
} from './matrix'

export type Env = Record<string, FMat>

export interface RunResult {
  /** The name the answer was stored under — Octave calls it `ans` when you did not say. */
  name: string
  value: FMat
  env: Env
  /** True when the line ended in a semicolon, so Octave would stay quiet. */
  quiet: boolean
}

export type Outcome = RunResult | { error: string }

export const isError = (o: Outcome): o is { error: string } => 'error' in o

/* ------------------------------------------------------------------ tokens */

type Tok = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'op'; v: string }

function lex(src: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === ' ' || c === '\t') {
      i++
      continue
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      let j = i
      while (j < src.length && /[0-9.]/.test(src[j])) j++
      out.push({ t: 'num', v: Number(src.slice(i, j)) })
      i = j
      continue
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++
      out.push({ t: 'id', v: src.slice(i, j) })
      i = j
      continue
    }
    if ('+-*/()[];,=\''.includes(c)) {
      out.push({ t: 'op', v: c })
      i++
      continue
    }
    throw new Error(`I do not know what to do with the character “${c}”.`)
  }
  return out
}

/* ------------------------------------------------------------------ parser */

const scalar = (v: Fr): FMat => [[v]]
const isScalar = (m: FMat) => nrows(m) === 1 && ncols(m) === 1
const asInt = (m: FMat, what: string) => {
  if (!isScalar(m)) throw new Error(`${what} needs a plain number, not a matrix.`)
  const v = m[0][0]
  if (v.d !== 1 || v.n < 0) throw new Error(`${what} needs a whole number that is 0 or more.`)
  return v.n
}

class Parser {
  private at = 0
  constructor(
    private toks: Tok[],
    private env: Env
  ) {}

  peek() {
    return this.toks[this.at]
  }
  eat(v: string) {
    const t = this.peek()
    if (t && t.t === 'op' && t.v === v) {
      this.at++
      return true
    }
    return false
  }
  expect(v: string) {
    if (!this.eat(v)) throw new Error(`I expected a “${v}” here.`)
  }
  done() {
    return this.at >= this.toks.length
  }

  expr(): FMat {
    let left = this.term()
    for (;;) {
      if (this.eat('+')) {
        const right = this.term()
        const sum = this.broadcast(left, right, true)
        left = sum
      } else if (this.eat('-')) {
        const right = this.term()
        left = this.broadcast(left, right, false)
      } else return left
    }
  }

  private broadcast(a: FMat, b: FMat, plus: boolean): FMat {
    let x = a
    let y = b
    // Octave lets you add a plain number to every entry of a matrix.
    if (isScalar(x) && !isScalar(y)) x = y.map((row) => row.map(() => a[0][0]))
    if (isScalar(y) && !isScalar(x)) y = x.map((row) => row.map(() => b[0][0]))
    const r = plus ? addM(x, y) : subM(x, y)
    if (!r)
      throw new Error(
        `You cannot ${plus ? 'add' : 'subtract'} a ${nrows(a)}×${ncols(a)} and a ${nrows(b)}×${ncols(b)} — the shapes differ.`
      )
    return r
  }

  term(): FMat {
    let left = this.unary()
    for (;;) {
      if (this.eat('*')) {
        const right = this.unary()
        if (isScalar(left)) left = scaleM(left[0][0], right)
        else if (isScalar(right)) left = scaleM(right[0][0], left)
        else {
          const p = mulM(left, right)
          if (!p)
            throw new Error(
              `A ${nrows(left)}×${ncols(left)} times a ${nrows(right)}×${ncols(right)} is not defined — the columns on the left must match the rows on the right.`
            )
          left = p
        }
      } else if (this.eat('/')) {
        const right = this.unary()
        if (!isScalar(right)) throw new Error('This Octave only divides by a plain number.')
        if (frIsZero(right[0][0])) throw new Error('Division by zero.')
        left = left.map((row) => row.map((v) => frDiv(v, right[0][0])))
      } else return left
    }
  }

  unary(): FMat {
    if (this.eat('-')) return scaleM(fr(-1), this.unary())
    if (this.eat('+')) return this.unary()
    return this.postfix()
  }

  postfix(): FMat {
    let v = this.primary()
    while (this.eat("'")) v = transposeM(v)
    return v
  }

  primary(): FMat {
    const t = this.peek()
    if (!t) throw new Error('The line stops before it says anything.')
    if (t.t === 'num') {
      this.at++
      // Whole numbers stay whole; a decimal becomes an exact fraction.
      return scalar(Number.isInteger(t.v) ? fr(t.v) : fr(Math.round(t.v * 1e6), 1e6))
    }
    if (t.t === 'id') {
      this.at++
      if (this.eat('(')) return this.call(t.v)
      const found = this.env[t.v]
      if (!found) throw new Error(`There is no variable called ${t.v} yet.`)
      return found
    }
    if (this.eat('(')) {
      const v = this.expr()
      this.expect(')')
      return v
    }
    if (this.eat('[')) return this.literal()
    throw new Error(`I did not expect “${t.v}” here.`)
  }

  literal(): FMat {
    const rows: FMat = []
    let row: Fr[] = []
    if (this.eat(']')) return [[]]
    for (;;) {
      row.push(this.expr()[0][0])
      if (this.eat(',')) continue
      if (this.eat(';')) {
        rows.push(row)
        row = []
        continue
      }
      if (this.eat(']')) break
      // Octave also separates columns with a plain space, which the lexer drops.
      const t = this.peek()
      if (!t) throw new Error('The square bracket was never closed.')
      continue
    }
    rows.push(row)
    const w = rows[0].length
    if (rows.some((r) => r.length !== w)) throw new Error('Every row of a matrix must have the same number of entries.')
    return rows
  }

  call(name: string): FMat {
    const args: FMat[] = []
    if (!this.eat(')')) {
      for (;;) {
        args.push(this.expr())
        if (this.eat(',')) continue
        this.expect(')')
        break
      }
    }
    const need = (n: number) => {
      if (args.length !== n) throw new Error(`${name} takes ${n} thing${n === 1 ? '' : 's'} in its brackets.`)
    }
    const square = (m: FMat) => {
      if (!isSquare(m)) throw new Error(`${name} only works on a square matrix, and this one is ${nrows(m)}×${ncols(m)}.`)
      return m
    }

    switch (name) {
      case 'det': {
        need(1)
        const d = detM(square(args[0]))
        if (!d) throw new Error('det needs a square matrix.')
        return scalar(d)
      }
      case 'rank':
        need(1)
        return scalar(fr(rankOf(args[0])))
      case 'inv': {
        need(1)
        const inv = inverseOf(square(args[0]))
        if (!inv) throw new Error('This matrix has no inverse — its determinant is zero.')
        return inv
      }
      case 'rref':
        need(1)
        return rrefOf(args[0]).R
      case 'size':
        need(1)
        return [[fr(nrows(args[0])), fr(ncols(args[0]))]]
      case 'numel':
        need(1)
        return scalar(fr(nrows(args[0]) * ncols(args[0])))
      case 'eye':
        need(1)
        return identity(asInt(args[0], 'eye'))
      case 'zeros':
        if (args.length === 1) return zerosM(asInt(args[0], 'zeros'), asInt(args[0], 'zeros'))
        need(2)
        return zerosM(asInt(args[0], 'zeros'), asInt(args[1], 'zeros'))
      case 'ones':
        if (args.length === 1) return onesM(asInt(args[0], 'ones'), asInt(args[0], 'ones'))
        need(2)
        return onesM(asInt(args[0], 'ones'), asInt(args[1], 'ones'))
      case 'transpose':
        need(1)
        return transposeM(args[0])
      case 'trace': {
        need(1)
        const m = square(args[0])
        return scalar(m.reduce((acc, row, i) => frAdd(acc, row[i]), fr(0)))
      }
      case 'issymmetric':
        need(1)
        return scalar(fr(isSquare(args[0]) && eqM(args[0], transposeM(args[0])) ? 1 : 0))
      default:
        throw new Error(`This small Octave does not know the command ${name}.`)
    }
  }
}

/* --------------------------------------------------------------- the front */

export function run(line: string, env: Env): Outcome {
  const trimmed = line.trim()
  if (!trimmed) return { error: 'Type something first.' }
  const quiet = trimmed.endsWith(';')
  const body = quiet ? trimmed.slice(0, -1) : trimmed

  try {
    const toks = lex(body)
    // `name = …` is an assignment; anything else lands in `ans`, same as Octave.
    let name = 'ans'
    let rest = toks
    if (toks.length > 2 && toks[0].t === 'id' && toks[1].t === 'op' && toks[1].v === '=') {
      name = toks[0].v
      rest = toks.slice(2)
    }
    const p = new Parser(rest, env)
    const value = p.expr()
    if (!p.done()) throw new Error('There is something left over at the end of the line.')
    return { name, value, env: { ...env, [name]: value }, quiet }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Something went wrong.' }
  }
}

/** One line of output in Octave's own layout, for the transcript. */
export function display(name: string, m: FMat) {
  if (nrows(m) === 1 && ncols(m) === 1) return `${name} = ${frStr(m[0][0])}`
  const width = Math.max(...m.flat().map((v) => frStr(v).length))
  const body = m.map((row) => '   ' + row.map((v) => frStr(v).padStart(width)).join('   ')).join('\n')
  return `${name} =\n\n${body}\n`
}
