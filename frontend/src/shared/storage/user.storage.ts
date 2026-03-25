export const userStorage = {
  get: () => localStorage.getItem('user'),
  set: (value: string) => localStorage.setItem('user', value),
}
