import {
  getCoordinates,
  startDrawing,
  stopDrawing,
  createTool,
} from '../core/drawingUtils.js'

// Función para dibujar un rectángulo al estilo Paint de Windows
// El punto inicial queda fijo en una esquina y el punto final determina
// la esquina opuesta
const drawRectangle = (context, startX, startY, endX, endY) => {
  if (endX === null || endY === null) return

  // Usamos la API rect que es más eficiente y precisa
  context.beginPath()
  context.rect(startX, startY, endX - startX, endY - startY)
  context.stroke()
}

// Configurar la herramienta rectángulo
const setRectangleTool = (context) => {
  let startX, startY
  let canvasBackup = null

  return createTool(context, {
    onStart: (event, context, getRect) => {
      // Capturar la posición inicial (primer clic)
      const coords = getCoordinates(event, getRect)
      startX = coords.x
      startY = coords.y

      // Guardar el estado actual del canvas
      canvasBackup = context.getImageData(
        0,
        0,
        context.canvas.width,
        context.canvas.height
      )

      return true
    },
    onMove: (event, context, getRect) => {
      // Restaurar el canvas al estado original
      if (canvasBackup) {
        context.putImageData(canvasBackup, 0, 0)
      }

      // Obtener la posición actual del mouse
      const { x: currentX, y: currentY } = getCoordinates(event, getRect)

      // Estilo de previsualización
      context.save()
      context.setLineDash([5, 5]) // Línea punteada

      // Dibujar el rectángulo en previsualización
      drawRectangle(context, startX, startY, currentX, currentY)

      // Restaurar estilo
      context.restore()
    },
    onStop: (event, context, getRect) => {
      // Si no hay evento, salir
      if (!event) return

      // Restaurar el canvas a su estado previo
      if (canvasBackup) {
        context.putImageData(canvasBackup, 0, 0)
      }

      // Obtener la posición final del mouse
      const { x: endX, y: endY } = getCoordinates(event, getRect)

      // Dibujar el rectángulo final con línea sólida
      context.save()
      context.setLineDash([]) // Línea sólida
      drawRectangle(context, startX, startY, endX, endY)
      context.restore()

      // Limpiar
      canvasBackup = null
    },
  })
}

export { drawRectangle, setRectangleTool }
