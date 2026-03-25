export const tokenStorage = {
  get: () => localStorage.getItem('access_token'),
  set: (token: string) => localStorage.setItem('access_token', token),
}
