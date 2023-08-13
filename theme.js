import Vue from 'vue'
import { lightDarkenColor } from '@/utils/colorTransfer'
export const themeList = [
  {
    value: '#4166ff',
  },
  {
    value: '#C341FF',
  },
  {
    value: '#11c1f3',
  },
  {
    value: '#fa541c',
  },
  {
    value: '#886aea',
  },
  {
    value: '#33cd5f',
  },
  {
    value: '#fa8c16',
  },
  {
    value: '#52c41a',
  },
  {
    value: '#722ed1',
  },
  {
    value: '#13c2c2',
  },
  {
    value: '#314659',
  },
]
/**
 * 主题颜色依次变浅
 *--theme-color-h
 *--theme-color-h1
 *--theme-color
 *--theme-color-1
 *--theme-color-2
 *--theme-color-3
 *--theme-color-4
 *--theme-color-5
 *--theme-color-6
 *--theme-color-7
 *--theme-color-8
 *--theme-color-9
 *--theme-color-95
 */
const renderBodyLightColor = (color) => {
  let styleStr = `:root{--theme-color: ${color}; --theme-color-h: ${lightDarkenColor(
    color,
    -50
  )};--theme-color-h1: ${lightDarkenColor(color, -30)};`
  for (let i = 1; i < 10; i++) {
    // 透明度占255颜色的比例
    let num = parseInt(((10 - i) / 10) * 255)
    let opacityStr = num.toString(16)
    styleStr += `--theme-color-${i}: ${color}${opacityStr}; `
  }
  let styleEle = document.querySelector('#theme-style')
  if (!styleEle) {
    styleEle = document.createElement('style')
    styleEle.id = 'theme-style'
    styleEle.type = 'text/css'
  }
  styleEle.type = 'text/css'
  styleEle.innerHTML = styleStr + `--theme-color-95: ${color}12; }`
  window.document.querySelector('head').appendChild(styleEle)
}
const renderTheme = (isLogin) => {
  let { theme = '#4166ff' } = Vue.prototype.$settings.data
  if (!themeList.some((item) => item.value === theme)) {
    theme = themeList[0].value
  }
  if (isLogin) {
    theme = window.localStorage.getItem('theme-color') || theme
  } else {
    window.localStorage.setItem('theme-color', theme)
  }
  renderBodyLightColor(theme)
}
export default renderTheme
