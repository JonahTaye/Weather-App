import { formatRelative } from 'date-fns'

export function displayWeather (days, location) {
  const today = days[0]
  displayLocation(location)
  displayTodayIcon(today.icon)
  displayTemp(today)
  displayAddInfo(today)
  displayUpcoming(days)
}

export function displayError () {
  const weatherCard = document.querySelector('.weather-card')
  weatherCard.innerHtml = 'Errorr'
}

function displayLocation (location) {
  const cityCard = document.getElementById('city')
  const countryCard = document.getElementById('country')
  const [city, country] = parseLocation(location)

  cityCard.textContent = city
  countryCard.textContent = country
}

async function displayTodayIcon (icon) {
  const img = document.querySelector('.today-icon')
  const image = await import(`./icons/conditions/${icon}.svg`)
  img.src = image.default
}

function displayTemp (today) {
  const todayTemp = document.getElementById('todays-temp')
  const feelsLike = document.getElementById('today-feelslike')
  const tempMax = document.getElementById('temp-max')
  const tempMin = document.getElementById('temp-min')

  todayTemp.textContent = today.temp
  feelsLike.textContent = today.feelslike
  tempMax.textContent = today.tempmax
  tempMin.textContent = today.tempmin
}

function displayAddInfo (today) {
  const humidity = today.humidity
  const windspeed = today.windspeed
  const precipChance = today.precipprob
  const precipType = today.preciptype
  const uvIndex = today.uvindex

  displayWindandHumidity(humidity, windspeed)
  displayPrecipitation(precipChance, precipType)
  displayUVIndex(uvIndex)
}

function displayWindandHumidity (humidity, windspeed) {
  const windCard = document.getElementById('wind')
  const humidityCard = document.getElementById('humidity')

  windCard.textContent = windspeed
  humidityCard.textContent = humidity
}

function displayPrecipitation (chance, type) {
  const precipCard = document.getElementById('prec')
  const precipImage = document.getElementById('prec-image')
  let image = ''
  let icon = ''
  let precip = ''

  try {
    precip = type[0]
  } catch (error) {
    precip = 'rain'
  }

  switch (precip) {
    case 'rain':
      icon = 'rain'
      break
    case 'snow':
      icon = 'snow'
      break
    case 'freezing rain':
      icon = 'freezing-rain'
      break
    case 'ice':
      icon = 'ice'
      break
    default:
      icon = 'rain'
      break
  }

  if (chance <= 25) image = `${icon}-1`
  else if (chance > 25 && chance <= 50) image = `${icon}-2`
  else image = `${icon}-3`

  import(`./icons/precip/${image}.svg`).then(function (img) { precipImage.src = img.default })
  precipCard.textContent = chance
}

function displayUVIndex (uvIndex) {
  const uvCard = document.getElementById('uv-index')
  const uvImage = document.getElementById('uv-index-icon')
  let uvText = ''

  switch (uvIndex) {
    case 1:
    case 2:
      uvText = 'Low'
      break

    case 3:
    case 4:
    case 5:
      uvText = 'Moderate'
      break

    case 6:
    case 7:
      uvText = 'High'
      break

    case 8:
    case 9:
    case 10:
      uvText = 'Very High'
      break
  }

  uvCard.textContent = uvText
  import(`./icons/uv-index/uv-index-${uvIndex}.svg`).then(function (img) { uvImage.src = img.default })
}

function displayUpcoming (days) {
  const container = document.querySelector('.card-container')
  const card = document.querySelector('.day-card')

  container.innerHTML = ''

  for (let i = 1; i <= 6; i++) {
    const day = days[i]
    const clone = card.cloneNode(true)
    clone.style.display = 'grid'

    const dayCard = clone.querySelector('.day')
    dayCard.textContent = dateConverter(day.datetime)

    const precipImage = clone.querySelector('img')
    console.log(day)
    importIcon(day.preciptype).then(function (img) { precipImage.src = img })

    const precipAmount = clone.querySelector('.upcoming-prec span.upcoming-prec')
    precipAmount.textContent = day.precipprob

    const condition = clone.querySelector('.upcoming-condition')
    import(`./icons/conditions/${day.icon}.svg`).then(function (img) { condition.src = img.default })

    const temp = clone.querySelector('.upcoming-temp span.upcoming-temp')
    temp.textContent = day.temp

    container.appendChild(clone)
  }
}

async function importIcon (type) {
  let icon = ''
  let precip = ''

  try {
    precip = type[0]
  } catch (error) {
    precip = 'rain'
  }

  switch (precip) {
    case 'rain':
      icon = 'rain'
      break
    case 'snow':
      icon = 'snow'
      break
    case 'freezing rain':
      icon = 'freezing-rain'
      break
    case 'ice':
      icon = 'ice'
      break
    default:
      icon = 'rain'
      break
  }
  console.log(icon)
  const img = await import(`./icons/upcoming-precip/${icon}.svg`)
  return img.default
}

function dateConverter (date) {
  const dateObj = new Date(date)
  const today = new Date()

  const formatedDate = formatRelative(dateObj, today)
  let capitalizedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1)
  capitalizedDate = capitalizedDate.split(' at')[0]

  return capitalizedDate
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
