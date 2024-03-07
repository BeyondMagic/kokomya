/**
 * List of suggestions.
 */
export class Suggestions extends HTMLElement {

	constructor () {
		super()
	}

	connectedCallback() {
		this.className = 'suggestions'
	}

	/**
	* Highlight the matched query in the items of the list.
	* @param {string} suggestion
	* @param {string} match
	*/
	_highlight (suggestion, match) {
		return suggestion.replace(match, `<span class="match">${match}</span>`)
	}

	/**
	* @param {Object} items The list data and its metadata.
	* @param {Array<string>} items.list The list of suggestions itself..
	* @param {string} items.match The email of the user.
	* @param {string} items.hyperlink The email of the user.
	*/
	set_items ({ list, match, hyperlink }) {
		const children = list.map(suggestion => {
			const item = document.createElement('a')
			item.href = hyperlink + suggestion
			item.className = 'item'
			item.innerHTML = this._highlight(suggestion, match)
			return item
		})

		this.replaceChildren(...children)
	}
}

customElements.define('list-suggestions', Suggestions, { extends: 'section' })
