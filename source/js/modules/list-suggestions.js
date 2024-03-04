export class Suggestions extends HTMLElement {

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
