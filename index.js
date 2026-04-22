const weatherApi = "https://api.weather.gov/alerts/active?area="

function getElements() {
  const input = document.querySelector('input[placeholder="Enter state abbreviation"]')
  const button = Array.from(document.querySelectorAll('button')).find(
    (btn) => btn.textContent.trim() === 'Get Weather Alerts'
  )
  const alertsDisplay = document.getElementById('alerts-display')
  const errorMessage = document.getElementById('error-message')

  return { input, button, alertsDisplay, errorMessage }
}

function clearError(errorMessage) {
  if (!errorMessage) return
  errorMessage.textContent = ''
  errorMessage.classList.add('hidden')
}

function showError(errorMessage, message) {
  if (!errorMessage) return
  errorMessage.textContent = message
  errorMessage.classList.remove('hidden')
}

function displayAlerts(data, alertsDisplay) {
  if (!alertsDisplay) return

  const features = Array.isArray(data.features) ? data.features : []
  const summary = document.createElement('h2')
  summary.textContent = `${data.title}: ${features.length}`

  const list = document.createElement('ul')

  features.forEach((alert) => {
    const item = document.createElement('li')
    item.textContent = alert?.properties?.headline || 'No headline available'
    list.appendChild(item)
  })

  alertsDisplay.innerHTML = ''
  alertsDisplay.appendChild(summary)
  alertsDisplay.appendChild(list)
}

async function fetchWeatherAlerts(state) {
  const response = await fetch(`${weatherApi}${state}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

function setupWeatherAlertsApp() {
  const { input, button, alertsDisplay, errorMessage } = getElements()

  if (!input || !button || !alertsDisplay || !errorMessage) return

  button.addEventListener('click', async () => {
    const state = input.value.trim().toUpperCase()

    input.value = ''

    try {
      const data = await fetchWeatherAlerts(state)
      clearError(errorMessage)
      displayAlerts(data, alertsDisplay)
    } catch (error) {
      showError(errorMessage, error.message)
    }
  })
}

document.addEventListener('DOMContentLoaded', setupWeatherAlertsApp)