import createElement from '../../assets/lib/create-element.js'
import escapeHtml from '../../assets/lib/escape-html.js'

import Modal from '../../7-module/2-task/index.js'

export default class Cart {
    cartItems = []

    constructor(cartIcon) {
        this.cartIcon = cartIcon

        this._addEventListeners()
    }

    addProduct(product) {
        if (!product) return
        const noProduct = this.cartItems.every(cartItem => cartItem.product.name !== product.name)

        if (noProduct) {
            this.cartItems.push({ product, count: 1 })
            this.onProductUpdate({ product, count: 1 })
        } else {
            this.cartItems.forEach(cartItem => {
                if (cartItem.product.name === product.name) {
                    cartItem.count++
                    this.onProductUpdate(cartItem)
            }
        })
      }
    }

    updateProductCount(productId, amount) {
        this.cartItems.forEach((cartItem, index) => {
            if (cartItem.product.id === productId) {
                cartItem.count = amount

                if (cartItem.count === 0) {
                    this.cartItems.splice(index, 1)
                }
                this.onProductUpdate(cartItem)
            }
        })
    }

    isEmpty() {
        return !this.cartItems.length
    }

    getTotalCount() {
        return this.cartItems.reduce((sum, item) => sum + item.count, 0)
    }

    getTotalPrice() {
        return this.cartItems.reduce((sum, item) => sum + item.count * item.product.price, 0)
    }

    renderProduct(product, count) {
        return createElement(`
            <div class="cart-product" data-product-id="${product.id}">
                <div class="cart-product__img">
                    <img src="../../assets/images/products/${product.image}" alt="product">
                </div>
                <div class="cart-product__info">
                    <div class="cart-product__title">${escapeHtml(product.name)}</div>
                    <div class="cart-product__price-wrap">
                        <div class="cart-counter">
                            <button type="button" class="cart-counter__button cart-counter__button_minus">
                                <img src="../../assets/images/icons/square-minus-icon.svg" alt="minus">
                            </button>
                            <span class="cart-counter__count">${count}</span>
                            <button type="button" class="cart-counter__button cart-counter__button_plus">
                                <img src="../../assets/images/icons/square-plus-icon.svg" alt="plus">
                            </button>
                        </div>
                        <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `)
    }

    renderOrderForm() {
        return createElement(`
            <form class="cart-form">
                <h5 class="cart-form__title">Delivery</h5>
                    <div class="cart-form__group cart-form__group_row">
                        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
                        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
                        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
                    </div>
                <div class="cart-form__group">
                    <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
                </div>
                <div class="cart-buttons">
                    <div class="cart-buttons__buttons btn-group">
                        <div class="cart-buttons__info">
                            <span class="cart-buttons__info-text">total</span>
                            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
                        </div>
                        <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
                    </div>
                </div>
            </form>
        `)
    }

    renderModal() {
        const modal = new Modal()
        modal.setTitle('Your order')
        modal.setBody(createElement('<div></div>'))
        modal.open()

        const modalBody = document.querySelector('.modal__inner .modal__body')

        this.cartItems.forEach(cartItem => {
            modalBody.querySelector('div').append(this.renderProduct(cartItem.product, cartItem.count))
        })

        modalBody.querySelector('div').append(this.renderOrderForm())

        modalBody.addEventListener('click', (event) => {
            if (!event.target.closest('.cart-product')) return

            const productId = event.target.closest('.cart-product').dataset.productId

            this.cartItems.forEach(cartItem => {
                if (cartItem.product.id === productId) {
                    if (event.target.closest('button').classList.contains('cart-counter__button_minus')) {
                        cartItem.count--
                        this.updateProductCount(productId, cartItem.count)
                    } else {
                        cartItem.count++
                        this.updateProductCount(productId, cartItem.count)
                    }
                }
            })
        })

        modalBody.querySelector('.cart-form').addEventListener('submit', (event) => {
            this.onSubmit(event)
        }, {once: true})
    }

    onProductUpdate(cartItem) {
        if (document.body.classList.contains('is-modal-open')) {

            const productId = cartItem.product.id
            const modalBody = document.querySelector('.modal__body')
            const productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`)
            const productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`)
            const infoPrice = modalBody.querySelector(`.cart-buttons__info-price`)

            productCount.innerHTML = `${cartItem.count}`
            productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`
            infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`

            if (cartItem.count === 0 && this.cartItems.length !== 0) {
                document.body.querySelector(`[data-product-id=${cartItem.product.id}]`).remove()
            } else if (this.cartItems.length === 0) {
                document.body.querySelector('.container').remove()
                document.body.classList.remove('is-modal-open')
            }
        }

        this.cartIcon.update(this)
    }

    onSubmit(event) {
        const module = document.querySelector('.modal__inner')

        event.preventDefault()

        event.target.querySelector(`[type="submit"]`).classList.add('is-loading')

        const formData = new FormData(event.target)

        const responsePromise = fetch('https://httpbin.org/post', {
            body: formData,
            method: 'POST'
        })

        responsePromise
            .then(() => {
                this.cartItems.length = 0
                this.cartIcon.update(this)

                module.querySelector('.modal__title').innerHTML = 'Success!'
                module.querySelector('.modal__body').innerHTML = ''
                module.querySelector('.modal__body').insertAdjacentHTML("afterbegin", `
                    <div class="modal__body-inner">
                        <p>
                            Order successful! Your order is being cooked :) <br>
                            We’ll notify you about delivery time shortly.<br>
                            <img src="/assets/images/delivery.gif" alt="">
                        </p>
                    </div>
                `)
            })
    }

    _addEventListeners() {
        this.cartIcon.elem.onclick = () => this.renderModal()
    }
}

