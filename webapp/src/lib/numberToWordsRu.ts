const UNITS = [
  ['ноль', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
  ['ноль', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
]
const TEENS = [
  'десять',
  'одиннадцать',
  'двенадцать',
  'тринадцать',
  'четырнадцать',
  'пятнадцать',
  'шестнадцать',
  'семнадцать',
  'восемнадцать',
  'девятнадцать',
]
const TENS = [
  '',
  'десять',
  'двадцать',
  'тридцать',
  'сорок',
  'пятьдесят',
  'шестьдесят',
  'семьдесят',
  'восемьдесят',
  'девяносто',
]
const HUNDREDS = [
  '',
  'сто',
  'двести',
  'триста',
  'четыреста',
  'пятьсот',
  'шестьсот',
  'семьсот',
  'восемьсот',
  'девятьсот',
]

const THOUSANDS: [string, string, string, 0 | 1][] = [
  ['рубль', 'рубля', 'рублей', 0],
  ['тысяча', 'тысячи', 'тысяч', 1],
  ['миллион', 'миллиона', 'миллионов', 0],
  ['миллиард', 'миллиарда', 'миллиардов', 0],
]

function morph(n: number, f1: string, f2: string, f5: string) {
  n = Math.abs(n) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) {
    return f5
  }
  if (n1 > 1 && n1 < 5) {
    return f2
  }
  if (n1 === 1) {
    return f1
  }
  return f5
}

function tripletToWords(n: number, gender: 0 | 1): string[] {
  const words: string[] = []
  if (n >= 100) {
    words.push(HUNDREDS[Math.floor(n / 100)])
    n %= 100
  }
  if (n >= 20) {
    words.push(TENS[Math.floor(n / 10)])
    n %= 10
  } else if (n >= 10) {
    words.push(TEENS[n - 10])
    n = 0
  }
  if (n > 0) {
    words.push(UNITS[gender][n])
  }
  return words
}

export function numberToWordsRu(amount: number): string {
  const value = Math.round(amount * 100)
  let intPart = Math.floor(value / 100)
  const fracPart = value % 100

  if (intPart === 0) {
    return `Ноль рублей ${fracPart.toString().padStart(2, '0')} копеек`
  }

  const words: string[] = []
  let i = 0
  while (intPart > 0 && i < THOUSANDS.length) {
    const n = intPart % 1000
    if (n > 0) {
      const gender = THOUSANDS[i][3]
      const segment = tripletToWords(n, gender)
      segment.push(morph(n, THOUSANDS[i][0], THOUSANDS[i][1], THOUSANDS[i][2]))
      words.unshift(segment.join(' '))
    }
    intPart = Math.floor(intPart / 1000)
    i += 1
  }

  const wordsStr = words.join(' ').replace(/\s+/g, ' ').trim()
  const kop = fracPart.toString().padStart(2, '0')
  return `${wordsStr} ${kop} ${morph(fracPart, 'копейка', 'копейки', 'копеек')}`
}
