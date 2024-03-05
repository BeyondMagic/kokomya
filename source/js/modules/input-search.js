/**
 * Return callback with debouncer.
 * @param {Function} fun
 * @param {number} ms
 * @returns {(...args : Array<any>) => any}
 */
function debounce(fun, ms) {
	let timer = 0

	return function(...args) {
		clearTimeout(timer)
		timer = setTimeout(fun.bind(this, ...args), ms || 0)
	}
}

/**
 * @typedef {import('./list-suggestions.js').Suggestions} Suggestions
 */

export class Search extends HTMLInputElement {

	/**
	* Which string to match in highlighting.
	* @type {string}
	*/
	query

	/**
	 * The list of suggestions to ad from each search.
	 * @type {Suggestions}
	 */
	suggestions

	constructor () {
		super()
	}

	connectedCallback() {
		/**
		 * The element must be rendered before this one.
		 * @type {Suggestions | null}
		 */
		const suggestions = document.querySelector(`list-suggestions[for="${this.name}"]`)

		if (!suggestions)
			throw Error("Not found list-suggestions.")

		this.suggestions = suggestions

		this.search()

		this.onkeyup = debounce(this.search, 250)
	}

	disconnectedCallback() {
		this.suggestions.remove()
	}

	/**
	* Searches current value through API.
	* @returns {Promise<void>}
	*/
	async search () {

		if (!this.value.length)
			return

		this.suggestions.query = this.value

		const response = await fetch(`https://araa.extravi.dev/suggestions?q=${this.value}`)
		/**
		 * First item is the query itself, the last is an array of suggestions.
		 * @type {[ string, Array<string> ]}
		 */
		const data = await response.json()

		this.suggestions.items = data[1]
	}
}
