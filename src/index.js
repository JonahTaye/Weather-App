import { fetchLocation, fetchWeather } from './fetchApi'
import { displayWeather } from './display'
import './style.css'

const button = document.querySelectorAll('button')
const input = document.querySelector('input')

button.forEach(button => {
  button.addEventListener('click', clickFunction)
})
input.addEventListener('keydown', clickFunction)

function clickFunction (event) {
  const btn = event.target.id
  const keydownEvent = event.type
  const key = event.key

  if ((btn === 'search-btn') || (keydownEvent === 'keydown' && key === 'Enter')) showInput()
  else if (btn === 'unit' || btn === 'change-unit') changeUnit()
}

function changeUnit () {
  console.log('chaingin units')
  const input = document.querySelector('input')
  const unit = document.querySelector('#unit')
  const units = document.querySelectorAll('#unit')
  const windUnit = document.querySelector('#wind-unit')

  if (unit.textContent === 'C') {
    unitSetterGetter.setter('us')
    units.forEach(function (unit) { unit.textContent = 'F' })
    windUnit.textContent = 'mph'
  } else {
    unitSetterGetter.setter('metric')
    units.forEach(function (unit) { unit.textContent = 'C' })
    windUnit.textContent = 'km/h'
  }

  if (input.value !== '') {
    const searchValue = input.value
    getLocation(searchValue)
  } else getLocation('')
}

function showInput () {
  const input = document.querySelector('input')
  const width = input.offsetWidth

  if (width === 0) {
    input.style.display = 'flex'
    for (let i = width; i < 100; i++) {
      setTimeout(() => {
        input.style.width = i + '%'
      }, i * 5)
    }
  } else if (input.value === '') {
    for (let j = 100; j >= 0; j--) {
      setTimeout(() => {
        input.style.width = j + '%'
        console.log('width', j)
      }, (100 - j) * 5)
    }

    setTimeout(() => {
      input.style.display = 'none'
    }, 500)
  } else if (input.value !== '') {
    const searchValue = input.value
    getLocation(searchValue)
  }
}

export async function getLocation (searchValue) {
  let location = ''

  if (searchValue) {
    location = searchValue
  } else {
    location = await fetchLocation()
  }

  getWeather(location)
}

async function getWeather (cityOrCountry) {
  const unit = unitSetterGetter.getter()
  const weather = await fetchWeather(cityOrCountry, unit)

  if (weather !== 'Error') displayWeather(weather.days, weather.resolvedAddress)
}

const unitSetterGetter = (function () {
  let unit = 'metric'

  const getter = function () {
    return unit
  }

  const setter = function (value) {
    unit = value
  }

  return { getter, setter }
})()

getLocation()
