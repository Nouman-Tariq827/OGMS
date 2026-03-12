import React from 'react'
import { Carousel } from 'react-bootstrap'

const HeroSlider = () => {
  const sliders = [
    {
      image: '/sliders/SliderImage1.webp',
      link: '/'
    },
    {
      image: '/sliders/SliderImage2.webp',
      link: '/'
    },
    {
      image: '/sliders/SliderImage3.webp',
      link: '/'
    }
  ]

  return (
    <Carousel className='hero-slider' interval={3000} pause='hover' fade indicators={true} controls={true}>
      {sliders.map((slider, index) => (
        <Carousel.Item key={index}>
          <img
            className='d-block w-100'
            src={slider.image}
            alt={`Slide ${index + 1}`}
            style={{ height: '600px', objectFit: 'cover' }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default HeroSlider
