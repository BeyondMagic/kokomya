import { Suggestions } from "./list-suggestions.js"
import { Input } from "./input-search.js"

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


export class Search extends HTMLElement {

	/**
	* Suggestions list for the search.
	* @type {Suggestions}
	*/
	suggestions

	/**
	* Input search itself.
	* @type {Input}
	*/
	input

	/**
	* Suggestions list for the search.
	* @type {Suggestions}
	*/
	suggestions

	constructor () {
		super()
	}

	connectedCallback() {
		this.className = 'search-engine'

		this.suggestions = new Suggestions()
		this.input = new Input()

		const input_container = document.createElement('section')
		input_container.className = 'input-container'
		input_container.append(this.input)

		this.append(input_container, this.suggestions)

		this.input.onkeyup = debounce(async () => {
			this.suggestions.match = this.input.value
			this.suggestions.items = await this.input.search()
		}, 250)
	}

	disconnectedCallback() {
		this.suggestions.remove()
		this.input.remove()
	}
}
