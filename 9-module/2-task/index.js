import Carousel from '../../6-module/3-task/index.js'
import slides from '../../6-module/3-task/slides.js'

import RibbonMenu from '../../7-module/1-task/index.js'
import categories from '../../7-module/1-task/categories.js'

import StepSlider from '../../7-module/4-task/index.js'
import ProductGrid from '../../8-module/2-task/index.js'

import CartIcon from '../../8-module/1-task/index.js'
import Cart from '../../8-module/4-task/index.js'

export default class Main {

  constructor() {
    this._carousel = new Carousel(slides)
    this._ribbon = new RibbonMenu(categories)
    this._cartIcon = new CartIcon()
    this._cart = new Cart(this._cartIcon)
    this._productGrid = null

    this._stepSlider = new StepSlider({
      steps: 5,
      value: 3
    })
  }

  async render() {
    document.body.querySelector('[data-carousel-holder]').append(this._carousel.elem)
    document.querySelector('[data-ribbon-holder]').append(this._ribbon.elem)
    document.querySelector('[data-slider-holder]').append(this._stepSlider.elem)
    document.querySelector('[data-cart-icon-holder]').append(this._cartIcon.elem)

    await fetch('products.json', {
      method: 'GET'
    }).then(res => res.json()
    ).then(products => {
      this._productGrid = new ProductGrid(products)
      document.querySelector('[data-products-grid-holder]').innerHTML = ''
      document.querySelector('[data-products-grid-holder]').append(this._productGrid.elem)
    }).then(() => {
      this._productGrid.updateFilter({
        noNuts: document.getElementById('nuts-checkbox').checked,
        vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
        maxSpiciness: this._stepSlider._value,
        category: this._ribbon._value
      })
    }).catch(err => console.log('Error: '+ err))

    this._ribbon.elem.addEventListener('ribbon-select', (event) => {
      this._productGrid.updateFilter({
        category: event.detail
      })
    })

    this._stepSlider.elem.addEventListener('slider-change', (event) => {
      this._productGrid.updateFilter({
        maxSpiciness: event.detail
      })
    })

    document.querySelector('#nuts-checkbox').addEventListener('change', (event) => {
      this._productGrid.updateFilter({
        noNuts: event.target.checked
      })
    })

    document.querySelector('#vegeterian-checkbox').addEventListener('change', (event) => {
      this._productGrid.updateFilter({
        vegeterianOnly: event.target.checked
      })
    })

    document.body.addEventListener('product-add', (event) => {
      this._cart.addProduct(this._productGrid._products.find(product => (product.id === event.detail)))
    })
  }
}

