/**
 * List of suggestions.
 */
export class Suggestions extends HTMLElement {

	constructor () {
		super()

		/**
		* Which string to match in highlighting.
		* @type {string}
		*/
		this.match = ''

		/**
		 * The hyperlink of the search engine.
		 * @type {string}
		 */
		this.hyperlink = ''
	}

	connectedCallback() {
		this.className = 'suggestions'
	}

	/**
	* Highlight the matched query in the items of the list.
	* @param {string} suggestion
	*/
	_highlight (suggestion) {
		return suggestion.replace(this.match, `<span class="match">${this.match}</span>`)
	}

	/**
	* Add list of queries and highlight them.
	* @param {Array<string>} list
	*/
	set items (list) {
		const children = list.map(suggestion => {
			const item = document.createElement('a')
			item.href = this.hyperlink + suggestion
			item.className = 'item'
			item.innerHTML = this._highlight(suggestion)
			return item
		})

		this.replaceChildren(...children)
	}
}

customElements.define('list-suggestions', Suggestions, { extends: 'section' })
