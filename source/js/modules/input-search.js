/**
 * The input itself for search.
 */
export class Input extends HTMLInputElement {

	constructor () {
		super()
	}

	connectedCallback() {
		this.autocomplete = "off"
		this.type = "text"
		this.placeholder = "O que você procura?"
	}

	/**
	* Searches current value through API.
	* @returns {Promise<Array<string>>}
	*/
	async search () {

		if (!this.value.length)
			return []

		const response = await fetch(`https://araa.extravi.dev/suggestions?q=${this.value}`)
		/**
		 * First item is the query itself, the last is an array of suggestions.
		 * @type {[ string, Array<string> ]}
		 */
		const data = await response.json()

		return data[1]
	}
}

customElements.define('input-search', Input, { extends: 'input' })
