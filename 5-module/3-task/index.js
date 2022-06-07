function initCarousel() {
    const containerOfCarousel = document.querySelector('.carousel__inner')
    const widthOfSlide = containerOfCarousel.querySelector('.carousel__img').offsetWidth
    const sliderList = containerOfCarousel.querySelectorAll('.carousel__slide')
    const carouselArrowLeft = document.querySelector('.carousel__arrow_left')
    const carouselArrowRight = document.querySelector('.carousel__arrow_right')
    let position = 0
    let numOfSlide = 0

    if (position === 0) {
        carouselArrowLeft.style.display = 'none'
    }

    carouselArrowRight.onclick =  () => {
        carouselArrowLeft.style.display = ''
        position = widthOfSlide * ++numOfSlide
        containerOfCarousel.style.transform = `translateX(-${position}px)`
        if (numOfSlide === sliderList.length - 1) {
            carouselArrowRight.style.display = 'none'
            numOfSlide = 0
        }
    }
    carouselArrowLeft.onclick = () => {
        carouselArrowRight.style.display = ''
        containerOfCarousel.style.transform = `translateX(-${position - widthOfSlide * ++numOfSlide}px)`
        if (numOfSlide === sliderList.length - 1)  {
            carouselArrowLeft.style.display = 'none'
            numOfSlide = 0
        }
    }
}
