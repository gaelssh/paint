// shapes/square.js
import {
  getCoordinates,
  startDrawing,
  stopDrawing,
  createTool,
} from '../core/drawingUtils.js'

const drawSquare = (context, startX, startY, endX, endY) => {
  context.beginPath()
  context.rect(startX, startY, endX - startX, endY - startY)
  context.stroke()
}

const previewSquare = (event, context, getRect, startX, startY) => {
  const { x: endX, y: endY } = getCoordinates(event, getRect)
  // Guardar el estado actual del canvas
  context.save()
  // Configurar estilo para previsualización (opcional: línea punteada)
  context.setLineDash([5, 5])
  drawSquare(context, startX, startY, endX, endY)
  // Restaurar el estado original
  context.restore()
}

const setSquareTool = (context) => {
  let startX, startY

  return createTool(context, {
    onStart: (event, context, getRect) => {
      const coords = getCoordinates(event, getRect)
      startX = coords.x
      startY = coords.y
      return startDrawing(event, context, getRect)
    },
    onMove: (event, context, getRect) => {
      // Previsualizar sin borrar el canvas completo
      previewSquare(event, context, getRect, context.lastX, context.lastY)
    },
    onStop: (context) => {
      // Dibujar la forma final (aquí podrías guardarla en un historial)
      drawSquare(context, startX, startY, context.lastX, context.lastY)
      stopDrawing(context)
    },
  })
}

export { drawSquare, setSquareTool }
