export const getRandomInt = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

export const shuffle = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}
