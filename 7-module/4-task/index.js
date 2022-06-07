import createElement from '../../assets/lib/create-element.js'

function stepSliderTemplate(num, steps) {
    return `
        <div class="slider">
            <div class="slider__thumb" style="left: ${num / (steps - 1) * 100}%;">
                <span class="slider__value">${num}</span>
            </div>
            <div class="slider__progress" style="width: ${num / (steps - 1) * 100}%;"></div>
            <div class="slider__steps"></div>
        </div>
    `
}

export default class StepSlider {
    constructor({steps, value = 0}) {
        this._steps = steps
        this._value = value
        this.elem = this._slider
        this._sliderDragAndDrop()
    }

    _sliderDragAndDrop() {
        const thumb = this.elem.querySelector('.slider__thumb')
        thumb.ondragstart = (event) => event.preventDefault()

        const onClick = (event) => {
            const stepLeft = event.clientX - this.elem.getBoundingClientRect().left
            const relativeStepLeft = stepLeft / this.elem.offsetWidth
            const stepValue = Math.round(relativeStepLeft * (this._steps - 1))
            const percentageValue = stepValue / (this._steps - 1) * 100

            this._changeStep(stepValue)
            this._changeActiveStep(stepValue, percentageValue)
            this._changeSliderProgress(percentageValue)
            this._newCustomEvent(stepValue)
        }

        this.elem.addEventListener('click', onClick)

        thumb.addEventListener('pointerdown', () => {
            this.elem.removeEventListener('click', onClick)
            this.elem.classList.add('slider_dragging')

            const onMove = (event) => {
                const stepLeft = event.pageX - this.elem.getBoundingClientRect().left
                const leftPercents = stepLeft / this.elem.offsetWidth * 100

                switch (true) {
                    case leftPercents <= 0 :
                        return thumb.style.left = `${0}`
                    case leftPercents >= 100 :
                        return thumb.style.left = `${100}%`
                    default :
                        thumb.style.left = `${leftPercents}%`
                }

                this._changeSliderProgress(leftPercents)
            }

            document.addEventListener('pointermove', onMove)

            const onUp = (event) => {
                const stepLeft = event.pageX - this.elem.getBoundingClientRect().left
                const relativeStepLeft = stepLeft / this.elem.offsetWidth
                const stepValue = Math.round(relativeStepLeft * (this._steps - 1))
                const leftPercents = stepLeft / this.elem.offsetWidth * 100

                this._changeStep(stepValue)
                this._changeActiveStep(stepValue, leftPercents)
                this._changeSliderProgress(leftPercents)
                this._newCustomEvent(stepValue)
            }

            document.addEventListener('pointerup', (event) => {
                document.removeEventListener('pointermove', onMove)
                this.elem.classList.remove('slider_dragging')
                onUp(event)

                this.elem.addEventListener('click', onClick )
            }, {once: true})
        })
    }

    _changeStep(value) {
        const sliderChildren = this.elem.querySelector('.slider__steps').childNodes
        sliderChildren.forEach(slider => {
            slider.classList.remove('slider__step-active')
        })
        sliderChildren[value].classList.add('slider__step-active')
    }

    _changeActiveStep(value, position) {
        const activeStep = this.elem.querySelector('.slider__thumb')
        activeStep.firstElementChild.textContent = value
        activeStep.style.left = `${position}%`
    }

    _changeSliderProgress(value) {
        const progressStep = this.elem.querySelector('.slider__progress')
        progressStep.style.width = `${value}%`
    }

    _newCustomEvent(value) {
        const activeStep = this.elem.querySelector('.slider__step-active')

        activeStep.dispatchEvent(new CustomEvent('slider-change', {
            detail: value,
            bubbles: true
        }))
    }

    get _slider() {
        const slider = createElement(stepSliderTemplate(this._value, this._steps))
        const steps = slider.querySelector('.slider__steps')

        for (let i = 0; i < this._steps; i++) {
            steps.insertAdjacentHTML('beforeend', `<span></span>`)
            if (i === this._value) {
                steps.lastChild.classList.add('slider__step-active')
            }
        }

        return slider
    }
}


