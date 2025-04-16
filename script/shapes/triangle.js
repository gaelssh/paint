// shapes/triangle.js
import {
  getCoordinates,
  startDrawing,
  stopDrawing,
  createTool,
} from '../core/drawingUtils.js'

// Función para dibujar un triángulo al estilo Paint de Windows
// El punto inicial (clic) es la punta superior del triángulo,
// y se mantiene fijo mientras se mueve el cursor.
const drawTriangle = (context, startX, startY, endX, endY) => {
  if (endX === null || endY === null) return

  context.beginPath()

  // Punta superior fija (punto inicial)
  context.moveTo(startX, startY)

  // Esquina inferior izquierda
  context.lineTo(startX - (endX - startX), endY)

  // Esquina inferior derecha
  context.lineTo(endX, endY)

  // Cerrar el triángulo
  context.closePath()
  context.stroke()
}

// Configurar la herramienta triángulo
const setTriangleTool = (context) => {
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

      // Dibujar el triángulo en previsualización
      drawTriangle(context, startX, startY, currentX, currentY)

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

      // Dibujar el triángulo final con línea sólida
      context.save()
      context.setLineDash([]) // Línea sólida
      drawTriangle(context, startX, startY, endX, endY)
      context.restore()

      // Limpiar
      canvasBackup = null
    },
  })
}

export { drawTriangle, setTriangleTool }
