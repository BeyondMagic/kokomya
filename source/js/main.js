import { Suggestions } from "./modules/list-suggestions.js"
import { Search } from "./modules/input-search.js"

customElements.define('input-search', Search, { extends: 'input' })
customElements.define('list-suggestions', Suggestions)
