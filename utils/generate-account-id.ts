export const generateAccountId = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const letters = []

  for (let i = 0; i < 2; i++) {
    const letter = alphabet.split('')[Math.round(Math.random() * alphabet.length)]
    letters.push(letter)
  }

  const accountId = letters.reduce((prev, current) => prev + current, '').toString() + String(Math.round(Math.random() * 100000)).padStart(5, '0')

  return accountId
}