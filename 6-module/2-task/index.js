import createElement from '../../assets/lib/create-element.js'

export default class ProductCard {

    constructor(product) {
        this._name = product.name
        this._price = product.price
        this._category = product.category
        this._image = product.image
        this._id = product.id
        this.elem = this._card
        this._customEvent()
    }

    _cardTemplate() {
        return `<div class = "card"></div>`
   }

    _topCardTemplate = (image, price) => {
        return `
            <div class="card__top">
                <img src="/assets/images/products/${image}" class="card__image" alt="product">
                <span class="card__price">€${price.toFixed(2)}</span>
            </div>
        `
    }

    _bodyCardTemplate = (name) => {
        return `
            <div class="card__body">
                <div class="card__title">${name}</div>
                <button type="button" class="card__button">
                    <img src="/assets/images/icons/plus-icon.svg" alt="icon">
                </button>
            </div>
        `
    }

    _customEvent = () => {
        this.elem.addEventListener('click', (event) => {
            const target = event.target.closest('.card__button')
            if (!target) return
            target.dispatchEvent(new CustomEvent("product-add", {
                detail: this._id,
                bubbles: true
            }))
        })
    }

    get _card() {
        const card = createElement(this._cardTemplate())
        const topDiv = createElement(this._topCardTemplate(this._image, this._price))
        const bodyDiv = createElement( this._bodyCardTemplate(this._name))

        card.insertAdjacentElement('afterbegin', topDiv)
        card.insertAdjacentElement('beforeend', bodyDiv)

        return card
    }
}
