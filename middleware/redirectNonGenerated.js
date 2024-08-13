export default async function ({ route, redirect }) {
  const fetchValidRoutes = async () => {
    const routes = [
      '/',
      '/trips',
      '/booking/trip',
      '/adventures',
      '/booking/adventure',
      '/comingSoon',
      '/hotels',
      '/cruises'
    ]

    try {
      const citiesResponse = await fetch('https://api.tanefer.com/api/v2/tours/list-city')
      const cities = await citiesResponse.json()
      const citySlugs = cities.cities.map(city => city.citySlug)

      for (const citySlug of citySlugs) {
        routes.push(`/adventures/${citySlug}`)
        routes.push(`/trips/${citySlug}`)
        routes.push(`/cruises/${citySlug}`)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching cities:', error)
    }

    return routes
  }

  // Fetch valid routes
  const validRoutes = await fetchValidRoutes()

  // Determine if the route is valid
  const isValidRoute = validRoutes.includes(route.fullPath)

  if (process.client) {
    const isInitialLoad = !sessionStorage.getItem('initialLoadChecked')

    if (!isValidRoute) {
      if (!isInitialLoad) {
        const lastValidRoute = localStorage.getItem('lastValidRoute') || '/'
        return redirect(lastValidRoute)
      }
    } else {
      localStorage.setItem('lastValidRoute', route.fullPath)
    }

    sessionStorage.setItem('initialLoadChecked', 'true')
  }
}
