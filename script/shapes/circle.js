import {
  getCoordinates,
  startDrawing,
  stopDrawing,
  createTool,
} from '../core/drawingUtils.js'

// Función para dibujar un círculo al estilo Paint de Windows
// El punto inicial y final determinan un rectángulo, y el círculo/elipse
// queda inscrito en ese rectángulo
const drawCircle = (context, startX, startY, endX, endY) => {
  if (endX === null || endY === null) return

  // Calcular el centro y los radios
  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  const radiusX = Math.abs(endX - startX) / 2
  const radiusY = Math.abs(endY - startY) / 2

  context.beginPath()
  // Dibujar elipse (círculo si width == height)
  context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
  context.stroke()
}

// Configurar la herramienta círculo
const setCircleTool = (context) => {
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

      // Dibujar el círculo en previsualización
      drawCircle(context, startX, startY, currentX, currentY)

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

      // Dibujar el círculo final con línea sólida
      context.save()
      context.setLineDash([]) // Línea sólida
      drawCircle(context, startX, startY, endX, endY)
      context.restore()

      // Limpiar
      canvasBackup = null
    },
  })
}

export { drawCircle, setCircleTool }
