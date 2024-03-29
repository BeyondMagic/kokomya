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

	constructor () {
		super()


		/**
		 * Search engines that will be used for the search.
		 * The query will be appended to the url.
		 * @type {Array<{icon: string, url: string}>}
		 */
		this.searches = [
			{
				icon: 'Araa',
				url: 'https://araa.extravi.dev/search?t=text&q='
			},
			{
				icon: 'Google',
				url: 'https://www.google.com/search?q='
			},
			{
				icon: 'YouTube',
				url: 'https://www.youtube.com/results?search_query='
			},
			{
				icon: 'GitHub',
				url: 'https://github.com/search?type=repositories&q='
			},
			{
				icon: 'LibGen',
				url: 'https://www.libgen.is/search.php?lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def&req='
			},
			{
				icon: 'Jisho',
				url: 'https://jisho.org/search/'
			}
		]

		/**
		 * Chosen search.
		 * @type {number}
		 */
		this.chosen = 0

		this.className = 'search-engine'

		/**
		* Suggestions list for the search.
		* @type {Suggestions}
		*/
		this.suggestions = new Suggestions()

		/**
		* Input search itself.
		* @type {Input}
		*/
		this.input = new Input()
	}

	connectedCallback() {
		const input_container = document.createElement('section')
		input_container.className = 'input-container'
		input_container.append(this.input)

		this.append(input_container, this.suggestions)

		// Get suggestions with a debouncer.
		this.input.addEventListener('keyup',
			debounce(async () =>
				this.suggestions.set_items({
					list: await this.input.search(),
					match: this.input.value,
					hyperlink: this.searches[this.chosen].url
				})
			, 250)
		)

		// Highlight as the user types.
		this.input.addEventListener('keyup', () => {
			for (const suggestion of this.suggestions.children)
				suggestion.innerHTML = this.suggestions.highlight({
					suggestion: suggestion.textContent ?? '',
					match: this.input.value
				})
		})
	}

	disconnectedCallback() {
		this.suggestions.remove()
		this.input.remove()
	}
}
