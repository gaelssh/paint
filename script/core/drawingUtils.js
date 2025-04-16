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

// Almacenar la herramienta activa (para evitar múltiples herramientas activas)
let currentActiveHandler = null

// Limpiar los handlers anteriores de cualquier herramienta
const cleanupPreviousHandlers = (canvas) => {
  if (currentActiveHandler) {
    removeEvents(canvas, currentActiveHandler)
    currentActiveHandler = null
  }
}

// Configurar eventos genéricos para herramientas
const createTool = (context, { onStart, onMove, onStop }) => {
  return (canvas) => {
    // Limpiar cualquier herramienta activa anterior
    cleanupPreviousHandlers(canvas)

    const getRect = () => canvas.getBoundingClientRect()
    let isDrawing = false

    const handlers = {
      mousedown: (event) => {
        isDrawing = onStart(event, context, getRect) || false
      },
      mousemove: (event) => {
        if (isDrawing) onMove(event, context, getRect)
      },
      mouseup: (event) => {
        if (isDrawing) {
          onStop(event, context, getRect)
          isDrawing = false
        }
      },
      mouseout: (event) => {
        if (isDrawing) {
          onStop(event, context, getRect)
          isDrawing = false
        }
      },
    }

    // Guardar los handlers actuales
    currentActiveHandler = handlers

    // Aplicar los eventos
    addEvents(canvas, handlers)
  }
}

export { getCoordinates, startDrawing, stopDrawing, createTool }
