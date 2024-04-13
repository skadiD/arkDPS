/** @type {import('tailwindcss').Config} */
function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `hsl(var(${variable}))`;
    }
    return `hsl(var(${variable}) / ${opacityValue})`;
  };
}
function defaultColor(variable){
  return `var(${variable})`
}
module.exports = {
  content: [
    "./index.html", "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        default: defaultColor("--default"),
        system: defaultColor("--system"),
      },
      boxShadow: {
        'sm': '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
        'md': '0 3px 3px -2px rgba(0,0,0,0.2),0 3px 4px 0 rgba(0,0,0,0.14),0 1px 8px 0 rgba(0,0,0,0.12)',
        'lg': '0 3px 5px -1px rgba(0,0,0,0.2),0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12)',
        'xl': '0 5px 6px -3px rgba(0,0,0,0.2),0 9px 12px 1px rgba(0,0,0,0.14),0 3px 16px 2px rgba(0,0,0,0.12)',
        '3xl': '0 11px 15px -7px rgba(0,0,0,0.2),0 24px 38px 3px rgba(0,0,0,0.14),0 9px 46px 8px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      halloween: {
        ...require("daisyui/src/theming/themes")['halloween'],
        info: '#5e72e4',
        primary: '#5e72e4',
        neutral: '#5e72e4',
       'base-300': '#2a2a2a'
      }
    }],
  },
}
