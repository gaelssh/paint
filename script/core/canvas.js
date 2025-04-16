const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const initializeCanvas = (initialColor = '#000000', initialThickness = 1) => {
  if (!context) throw new Error('Contexto del canvas no disponible')
  context.lineCap = 'round'
  context.strokeStyle = initialColor
  context.lineWidth = initialThickness
}

export { canvas, context, initializeCanvas }
