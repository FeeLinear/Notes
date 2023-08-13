/**
 * 255颜色值转16进制颜色值
 * @param n 255颜色值
 * @returns hex 16进制颜色值
 */
export const toHex = (n) => `${n > 15 ? '' : 0}${n.toString(16)}`

/**
 * 颜色对象转化为16进制颜色字符串
 * @param colorObj 颜色对象
 */
export const toHexString = (colorObj) => {
  const { r, g, b, a = 1 } = colorObj
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a === 1 ? '' : toHex(Math.floor(a * 255))}`
}

/**
 * 颜色对象转化为rgb颜色字符串
 * @param colorObj 颜色对象
 */
export const toRgbString = (colorObj) => {
  const { r, g, b } = colorObj
  return `rgb(${r},${g},${b})`
}

/**
 * 颜色对象转化为rgba颜色字符串
 * @param colorObj 颜色对象
 */
export const toRgbaString = (colorObj, n = 10000) => {
  const { r, g, b, a = 1 } = colorObj
  return `rgba(${r},${g},${b},${Math.floor(a * n) / n})`
}

/**
 * 16进制颜色字符串解析为颜色对象
 * @param color 颜色字符串
 * @returns IColorObj
 */
export const parseHexColor = (color) => {
  let hex = color.slice(1)
  let a = 1
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }
  if (hex.length === 8) {
    a = parseInt(hex.slice(6), 16) / 255
    hex = hex.slice(0, 6)
  }
  const bigint = parseInt(hex, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
    a,
  }
}

/**
 * rgba颜色字符串解析为颜色对象
 * @param color 颜色字符串
 * @returns IColorObj
 */
export const parseRgbaColor = (color) => {
  const arr = color.match(/(\d(\.\d+)?)+/g) || []
  const res = arr.map((s) => parseInt(s, 10))
  return {
    r: res[0],
    g: res[1],
    b: res[2],
    a: parseFloat(arr[3]),
  }
}

/**
 * 颜色字符串解析为颜色对象
 * @param color 颜色字符串
 * @returns IColorObj
 */
export const parseColorString = (color) => {
  if (color.startsWith('#')) {
    return parseHexColor(color)
  } else if (color.startsWith('rgb')) {
    return parseRgbaColor(color)
  } else if (color === 'transparent') {
    return parseHexColor('#00000000')
  }
  throw new Error(`color string error: ${color}`)
}

/**
 * 颜色字符串解析为各种颜色表达方式
 * @param color 颜色字符串
 * @returns IColorObj
 */
export const getColorInfo = (color) => {
  const colorObj = parseColorString(color)
  const hex = toHexString(colorObj)
  const rgba = toRgbaString(colorObj)
  const rgb = toRgbString(colorObj)
  return {
    hex,
    rgba,
    rgb,
    rgbaObj: colorObj,
  }
}

/**
 * 16进制颜色字符串转化为rgba颜色字符串
 * @param hex 16进制颜色字符串
 * @returns rgba颜色字符串
 */
export const hexToRgba = (hex) => {
  const colorObj = parseColorString(hex)
  return toRgbaString(colorObj)
}

/**
 * rgba颜色字符串转化为16进制颜色字符串
 * @param rgba rgba颜色字符串
 * @returns 16进制颜色字符串
 */
export const rgbaToHex = (rgba) => {
  const colorObj = parseColorString(rgba)
  return toHexString(colorObj)
}

// str: 十六进制颜色值，n：透明度
export const colorRgba = (str, n) => {
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let sColor = str.toLowerCase()
  n = n || 1
  // 十六进制颜色转换为RGB格式
  if (sColor && reg.test(sColor)) {
    let sColorChange = getRgbNum(sColor)
    return 'rgba(' + sColorChange.join(',') + ',' + n + ')'
  } else {
    return sColor
  }
}
// 获取 rgb 颜色值
export const getRgbNum = (sColor) => {
  if (sColor.length === 4) {
    let sColorNew = '#'
    for (let i = 1; i < 4; i += 1) {
      // 补全颜色值 例如：#eee,#fff等
      sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
    }
    sColor = sColorNew
  }
  // 处理六位颜色值
  let sColorChange = []
  for (let i = 1; i < 7; i += 2) {
    // 核心代码，通过parseInt将十六进制转为十进制，parseInt只有一个参数时是默认转为十进制的，第二个参数则是指定转为对应进制
    sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
  }
  return sColorChange
}
// 加深或减弱颜色值
export const lightDarkenColor = (color, num) => {
  let colorArr = getRgbNum(color)
  let sColorChange = []
  for (let i = 0; i < colorArr.length; i++) {
    let val = colorArr[i] + num
    if (val < 0) {
      val = 0
    }
    if (val > 255) {
      val = 255
    }
    sColorChange.push(val)
  }
  return 'rgba(' + sColorChange.join(',') + ',1)'
}
