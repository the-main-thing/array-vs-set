/**
 * @param { mode } mode - either 'array' or'set'
 */
export const benchmark = mode => {
	const getValue = () => {
		const value = crypto.randomUUID()
		const size = Math.floor(Math.random() * 10) + 1
		return value.slice(0, size)
	}

	const getRandomValueFromAnArray = array => {
		return array[Math.floor(Math.random() * array.length)]
	}

	const results = []

	const warmingUpCountdown = 10

	console.log('Measuring performance for mode:', mode)

	console.log(`Warming up for ${warmingUpCountdown} iterations...`)

	for (
		let iteration = 0;
		iteration < 100 + warmingUpCountdown;
		iteration += 1
	) {
		const i =
			iteration >= warmingUpCountdown
				? iteration - warmingUpCountdown
				: iteration

		const array = Array(i + 1)
			.fill('')
			.map(() => getValue())

		const set = new Set(array)

		const valuesToCheck = Array(array.length)
			.fill('')
			.map(() => getRandomValueFromAnArray(array))

		let fakeResult = ''

		const start = Date.now()
		let valueToCheckIndex = 0
		for (let j = 0; j < 100_000; j += 1) {
			let valueToCheck = '_'
			if (j % 13) {
				valueToCheck = valuesToCheck[valueToCheckIndex]
				valueToCheckIndex =
					(valueToCheckIndex + 1) % valuesToCheck.length
			}
			if (mode === 'array') {
				if (array.includes(valueToCheck)) {
					fakeResult += valueToCheck
				} else {
					fakeResult += ', '
				}
			} else {
				if (set.has(valueToCheck)) {
					fakeResult += valueToCheck
				} else {
					fakeResult += ', '
				}
			}
		}
		const end = Date.now()

		if (iteration < warmingUpCountdown) {
			continue
		}

		results.push({
			size: i + 1,
			time: end - start,
		})

		if (!fakeResult) {
			throw new Error(
				'This thing is needed to surpass the optimization of node avoiding the loop when the results from the loop is unused'
			)
		}
	}

	return results
}
