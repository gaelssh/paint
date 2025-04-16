// core/drawingUtils.js
import { addEvents, removeEvents } from './events.js'

// Calcular coordenadas relativas al canvas
const getCoordinates = (event, getRect) => {
  const rect = getRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

// Iniciar dibujo (guardar posición inicial)
const startDrawing = (event, context, getRect) => {
  const { x, y } = getCoordinates(event, getRect)
  context.lastX = x
  context.lastY = y
  return true
}

// Detener dibujo
const stopDrawing = (context) => {
  context.lastX = null
  context.lastY = null
}

// Configurar eventos genéricos para herramientas
const createTool = (context, { onStart, onMove, onStop }) => {
  let isDrawing = false

  return (canvas) => {
    const getRect = () => canvas.getBoundingClientRect()

    const handlers = {
      mousedown: (event) => {
        isDrawing = onStart(event, context, getRect)
      },
      mousemove: (event) => {
        if (isDrawing) onMove(event, context, getRect)
      },
      mouseup: () => {
        if (isDrawing) {
          onStop(context)
          isDrawing = false
        }
      },
      mouseout: () => {
        if (isDrawing) {
          onStop(context)
          isDrawing = false
        }
      },
    }

    removeEvents(canvas, handlers)
    addEvents(canvas, handlers)
  }
}

export { getCoordinates, startDrawing, stopDrawing, createTool }
