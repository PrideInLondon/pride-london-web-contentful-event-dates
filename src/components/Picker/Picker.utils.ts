export function formatDate(date: Date) {
  return `${date.toLocaleString('en-gb', {
    weekday: 'short'
  })} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`
}
