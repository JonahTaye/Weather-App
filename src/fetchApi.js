import { displayError, displayLoading } from './display'

export async function fetchWeather (cityOrCountry, unit) {
  displayLoading()
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityOrCountry}?unitGroup=${unit}&key=8S4X6VXE6T99EPF7D3Y5D6YJV&contentType=json`,
    { mode: 'cors' }
  )
  console.log(response)
  if (!response.ok) {
    displayError()
    return 'Error'
  } else {
    const weather = await response.json()
    return weather
  }
}

export async function fetchLocation () {
  const response = await fetch('https://ipapi.co/json/')
  const location = await response.json()
  return location.city
}
