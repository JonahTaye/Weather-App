export function displayWeather (days, location) {
  const today = days[0]
  displayLocation(today, location)
}

function displayLocation (today, location) {
  const cityCard = document.querySelector('#city')
  const countryCard = document.querySelector('#country')
  const [city, country] = parseLocation(location)

  cityCard.textContent = city
  countryCard.textContent = country
}

function parseLocation (location) {
  const parsedValue = location.split(', ')
  let city, country
  if (parsedValue.length > 2) {
    city = parsedValue[0]
    country = parsedValue.slice(-1)[0]
  } else {
    [city, country] = parsedValue
  }

  return [city, country]
}
