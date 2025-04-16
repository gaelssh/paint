import {
  getCoordinates,
  startDrawing,
  stopDrawing,
  createTool,
} from '../core/drawingUtils.js'

const drawLine = (context, x, y) => {
  context.lineWidth = context.lineWidth || 1
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(context.lastX || x, context.lastY || y)
  context.lineTo(x, y)
  context.stroke()
  context.lastX = x
  context.lastY = y
}

const drawPencil = (event, context, getRect) => {
  const { x, y } = getCoordinates(event, getRect)
  drawLine(context, x, y)
}

const setPencilTool = (context) => {
  return createTool(context, {
    onStart: startDrawing,
    onMove: drawPencil,
    onStop: stopDrawing,
  })
}

export { drawLine, setPencilTool }
