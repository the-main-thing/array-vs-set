import fs from 'fs'
import path from 'path'
import { benchmark } from './benchmark.mjs'

const mode = process.argv.includes('set') ? 'set' : 'array'

const result = benchmark(mode)
const resultsPath = path.join(process.cwd(), `${mode}.json`)

fs.writeFileSync(
	resultsPath,
	JSON.stringify(
		result
			.sort((a, b) =>
				mode === 'array' ? a.time - b.time : b.time - a.time
			)
			.map(v => ({ ...v, time: `${v.time} ms` })),
		null,
		2
	),
	{ encoding: 'utf8' }
)
console.log(`Results saved to "${resultsPath}"`)
