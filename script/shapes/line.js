import {
  getCoordinates,
  startDrawing,
  stopDrawing,
  createTool,
} from '../core/drawingUtils.js'

// Función para dibujar una línea al estilo Paint de Windows
// El punto inicial y final determinan el comienzo y fin de la línea
const drawLine = (context, startX, startY, endX, endY) => {
  if (endX === null || endY === null) return

  context.beginPath()
  context.moveTo(startX, startY)
  context.lineTo(endX, endY)
  context.stroke()
}

// Configurar la herramienta línea
const setLineTool = (context) => {
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

      // Dibujar la línea en previsualización
      drawLine(context, startX, startY, currentX, currentY)

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

      // Dibujar la línea final con línea sólida
      context.save()
      context.setLineDash([]) // Línea sólida
      drawLine(context, startX, startY, endX, endY)
      context.restore()

      // Limpiar
      canvasBackup = null
    },
  })
}

export { drawLine, setLineTool }
