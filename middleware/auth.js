export default function ({ store, redirect, route }) {
  if (!store.getters['auth/isAuthenticated']) {
    const redirectTo = route.fullPath
    return redirect(`/login?redirect=${redirectTo}`)
  }
}
