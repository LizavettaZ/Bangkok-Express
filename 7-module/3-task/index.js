import createElement from '../../assets/lib/create-element.js'

function stepSliderTemplate(num) {
    return `
        <div class="slider">
            <div class="slider__thumb">
                <span class="slider__value">${num}</span>
            </div>
            <div class="slider__progress" style="width: 0;"></div>
            <div class="slider__steps"></div>
        </div>
    `
}

export default class StepSlider {
    constructor({ steps, value = 0 }) {
        this._steps = steps
        this._value = value
        this.elem = this._slider
        this._sliderClick()
    }

    _sliderClick() {
        const sliderChildren = this.elem.querySelector('.slider__steps').childNodes
        const activeStep = this.elem.querySelector('.slider__thumb')
        const progressStep = this.elem.querySelector('.slider__progress')

        this.elem.addEventListener('click', (event) => {
            const stepLeft = event.clientX - this.elem.getBoundingClientRect().left
            const relativeStepLeft = stepLeft / this.elem.offsetWidth
            const stepValue = Math.round(relativeStepLeft * (this._steps - 1))
            const percentageValue = stepValue / (this._steps - 1) * 100

            sliderChildren.forEach(slider => {
                slider.classList.remove('slider__step-active')
            })

            sliderChildren[stepValue].classList.add('slider__step-active')

            sliderChildren[stepValue].dispatchEvent(new CustomEvent('slider-change', {
                detail: stepValue,
                bubbles: true
            }))

            activeStep.firstElementChild.textContent = `${stepValue}`
            activeStep.style.left = `${percentageValue}%`

            progressStep.style.width = `${percentageValue}%`
        })
    }

    get _slider() {
        const slider = createElement(stepSliderTemplate(this._value))
        const steps = slider.querySelector('.slider__steps')

        for (let i = 0; i < this._steps; i++) {
            steps.insertAdjacentHTML('beforeend',  `<span></span>`)
        }

        steps.querySelector('span').classList.add('slider__step-active')

        return slider
    }

}
