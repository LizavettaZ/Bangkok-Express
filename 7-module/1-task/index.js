import createElement from '../../assets/lib/create-element.js'

function menuTemplate() {
    return `
        <div class="ribbon">
            <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
                <img src="/assets/images/icons/angle-icon.svg" alt="icon">
            </button>
            <nav class="ribbon__inner"></nav>
            <button class="ribbon__arrow ribbon__arrow_left ">
                <img src="/assets/images/icons/angle-icon.svg" alt="icon">
            </button>
        </div>
    `
}

function createRibbonPoint({ id, name }) {
    return `<a href="#" class="ribbon__item" data-id="${id}">${name}</a>`
}

export default class RibbonMenu {

    constructor(categories) {
        this._categories = categories
        this._value = ''
        this.elem = this._menu
        this._menuScrollByMouse()
        this._customEvent()
    }

    _menuScrollByMouse() {
        const menu = this.elem.querySelector('.ribbon__inner')
        const leftArrow = this.elem.querySelector('.ribbon__arrow_left')
        const rightArrow = this.elem.querySelector('.ribbon__arrow_right')

        this.elem.addEventListener('click', (event) => {
            const target = event.target.closest('button')

            if (!target) return

            if (target.classList.contains('ribbon__arrow_right')) {
                menu.scrollBy(350, 0)
            } else if (target.classList.contains('ribbon__arrow_left')) {
                menu.scrollBy(-350, 0)
            }
        })

        menu.addEventListener('scroll', () => {
            const scrollLeft = menu.scrollLeft
            const scrollRight = menu.scrollWidth - scrollLeft - menu.clientWidth

            if (scrollLeft < 1) {
                leftArrow.classList.remove('ribbon__arrow_visible')
            } else if (scrollRight <= 1) {
                rightArrow.classList.remove('ribbon__arrow_visible')
            } else {
                rightArrow.classList.add('ribbon__arrow_visible')
                leftArrow.classList.add('ribbon__arrow_visible')
            }
        })
    }

    _customEvent() {
        this.elem.querySelector('[data-id]').classList.add('ribbon__item_active')

        this.elem.addEventListener('click', (event) => {
            event.preventDefault()

            const target = event.target.closest('a')

            if (!target) return

            this.elem.querySelectorAll('.ribbon__item_active').forEach(href => {
                href.classList.remove('ribbon__item_active')
            })
            target.classList.add('ribbon__item_active')

            this._value = target.dataset.id

            target.dispatchEvent(new CustomEvent('ribbon-select', {
                detail: target.dataset.id,
                bubbles: true
            }))
        })
    }

    get _menu() {
        const menu = createElement(menuTemplate())
        const menuRibbon = menu.querySelector('.ribbon__inner')

        menuRibbon.style.overflowX = 'hidden'

        this._categories.forEach(category => {
            menuRibbon.insertAdjacentHTML('beforeend', createRibbonPoint(category))
         })

        return menu
    }
}

