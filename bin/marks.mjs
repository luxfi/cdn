#!/usr/bin/env node
// What the exchange may draw from this host, listed once from the files that
// are here. `exchange/marks.json` is the manifest a client vendors so it knows
// a mark exists before it asks for it and draws letters where it does not.
import { readdirSync, writeFileSync } from 'node:fs'
const names = (dir, ext) => readdirSync(new URL(`../public/exchange/${dir}/`, import.meta.url))
  .filter((f) => f.endsWith(ext)).map((f) => f.slice(0, -ext.length)).sort()
const marks = { tokens: names('icon-svg', '.svg'), chains: names('chains', '.png'), flags: names('flags', '.svg') }
writeFileSync(new URL('../public/exchange/marks.json', import.meta.url), JSON.stringify(marks, null, 2) + '\n')
console.log(`tokens ${marks.tokens.length} · chains ${marks.chains.length} · flags ${marks.flags.length}`)
