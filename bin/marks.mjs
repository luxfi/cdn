#!/usr/bin/env node
// What the exchange may draw from this host, listed once from the files that
// are here. `exchange/marks.json` is the manifest a client vendors so it knows
// a mark exists before it asks for it and draws letters where it does not.
import { readdirSync, writeFileSync } from 'node:fs'
const dir = (at) => readdirSync(new URL(`../public/exchange/${at}/`, import.meta.url))
const names = (at, ext) => dir(at).filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)).sort()
// The marks under `token/` are filed by the chain they are on and named for
// the address the token is at, because that is what a chain nobody indexed
// answers with — a symbol is a label a token chose and two of them can choose
// the same one. They keep their extension: these arrive as PNG, JPEG and WebP,
// and re-encoding a picture to make the names agree would be redrawing it.
const listed = Object.fromEntries(dir('token').map((chain) => [chain, dir(`token/${chain}`).sort()]))
const marks = { tokens: names('icon-svg', '.svg'), chains: names('chains', '.png'), flags: names('flags', '.svg'), listed }
writeFileSync(new URL('../public/exchange/marks.json', import.meta.url), JSON.stringify(marks, null, 2) + '\n')
const held = Object.values(listed).reduce((n, f) => n + f.length, 0)
console.log(`tokens ${marks.tokens.length} · chains ${marks.chains.length} · flags ${marks.flags.length} · listed ${held} on ${Object.keys(listed).length} chains`)
