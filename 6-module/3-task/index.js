import createElement from '../../assets/lib/create-element.js'

export default class Carousel {
    constructor(slides) {
        this.slides = slides
        this.elem = this._carousel
        this. _customEvent()
    }

    _createCarouselTemplate() {
        return `<div class="carousel"></div>`
    }

    _createSlidesContainer() {
        return `<div class="carousel__inner"></div>`
    }

    _createSlide({name, price, image, id}) {
        return `
            <div class="carousel__slide" data-id="${id}">
                <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
                <div class="carousel__caption">
                    <span class="carousel__price">€${price.toFixed(2)}</span>
                    <div class="carousel__title">${name}</div>
                    <button type="button" class="carousel__button">
                        <img src="/assets/images/icons/plus-icon.svg" alt="icon">
                    </button>
                </div>
            </div>
        `
    }

    _createArrowRight() {
        return `
            <div class="carousel__arrow carousel__arrow_right">
                <img src="/assets/images/icons/angle-icon.svg" alt="icon">
            </div>
        `
    }

    _createArrowLeft() {
        return `
            <div class="carousel__arrow carousel__arrow_left">
                <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
            </div>
        `
    }

    _customEvent() {
        this.elem.addEventListener('click', (event) => {
        const target = event.target.closest('button')
        if (!target) return
            target.dispatchEvent(new CustomEvent("product-add", {
                detail: target.closest('.carousel__slide').dataset.id,
                bubbles: true
            }))
        })
    }

    _moveArrows(object) {
        const containerOfCarousel = object.querySelector('.carousel__inner')
        const carouselArrowLeft = object.querySelector('.carousel__arrow_left')
        const carouselArrowRight = object.querySelector('.carousel__arrow_right')
        const sliderList = containerOfCarousel.querySelectorAll('.carousel__slide')

        let position = 0
        let numOfSlide = 0

        if (position === 0) {
          carouselArrowLeft.style.display = 'none'
        }

        carouselArrowRight.addEventListener('click', () => {
            const widthOfSlide = object.querySelector('.carousel__img').offsetWidth
            carouselArrowLeft.style.display = ''
            position = widthOfSlide * ++numOfSlide
            containerOfCarousel.style.transform = `translateX(-${position}px)`

            if (numOfSlide === sliderList.length - 1) {
                carouselArrowRight.style.display = 'none'
                numOfSlide = 0
            }
        })

        carouselArrowLeft.addEventListener('click', () => {
            const widthOfSlide = object.querySelector('.carousel__img').offsetWidth
            carouselArrowRight.style.display = ''
            containerOfCarousel.style.transform = `translateX(-${position - widthOfSlide * ++numOfSlide}px)`

            if (numOfSlide === sliderList.length - 1) {
                carouselArrowLeft.style.display = 'none'
                numOfSlide = 0
            }
        })
    }

    get _carousel() {
        const carousel = createElement(this._createCarouselTemplate())
        const containerOfSlides = createElement(this._createSlidesContainer())
        const arrowLeft = createElement(this._createArrowLeft())
        const arrowRight = createElement(this._createArrowRight())

        carousel.insertAdjacentElement('beforeend', containerOfSlides)
        carousel.insertAdjacentElement('afterbegin', arrowRight)
        carousel.insertAdjacentElement('afterbegin', arrowLeft)

        this.slides.forEach(slide => {
            containerOfSlides.insertAdjacentHTML('beforeend', this._createSlide(slide))
        })

        this._moveArrows(carousel)

        return carousel
    }
}
