/**
 * Return callback with debouncer.
 * @param {Function} fun
 * @param {number} ms
 * @returns {Function}
 */
function debounce(fun, ms) {
	let timer = 0

	return function(...args) {
		clearTimeout(timer)
		timer = setTimeout(fun.bind(this, ...args), ms || 0)
	}
}

class Suggestions extends HTMLElement {

	/**
	* Which string to match in highlighting.
	* @type { string }
	*/
	query = ''

	constructor () {
		super()
	}

	/**
	* Highlight the matched query in the items of the list.
	* @param {string} suggestion
	*/
	_highlight (suggestion) {
		return suggestion.replace(this.query, `<span class="match">${this.query}</span>`)
	}

	/**
	* Add list of queries and highlight them.
	* @param {string} query
	* @param {Array<string>} list
	*/
	set items (list) {
		const children = list.map(suggestion => {
			const item = document.createElement('div')
			item.className = 'item'
			item.innerHTML = this._highlight(suggestion)
			return item
		})

		this.replaceChildren(...children)
	}
}

customElements.define('list-suggestions', Suggestions)

class Search extends HTMLInputElement {

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
		 */
		this.suggestions = document.querySelector(`list-suggestions[for="${this.name}"]`)

		this.search()

		this.onkeyup = debounce(this.search, 250)
	}

	disconnectedCallback() {
		this.suggestions.remove()
	}

	/**
	* Searches current value through API.
	* @param {string} query
	* @returns {void}
	*/
	async search () {

		if (!this.suggestions || !this.value.length)
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

customElements.define('input-search', Search, { extends: 'input' })
