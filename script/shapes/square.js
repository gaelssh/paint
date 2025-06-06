// shapes/square.js
import {
  getCoordinates,
  startDrawing,
  stopDrawing,
  createTool,
} from '../core/drawingUtils.js'

// Función para dibujar un cuadrado al estilo Paint de Windows
// El punto inicial queda fijo y el lado del cuadrado se determina por
// la distancia más grande entre el punto inicial y el punto final
const drawSquare = (context, startX, startY, endX, endY) => {
  if (endX === null || endY === null) return

  // Calcular el lado del cuadrado
  const width = endX - startX
  const height = endY - startY
  const side = Math.max(Math.abs(width), Math.abs(height))

  // Determinar la dirección del cuadrado
  const signX = Math.sign(width) || 1
  const signY = Math.sign(height) || 1

  // Calcular el punto final manteniendo la proporción de cuadrado
  const finalX = startX + side * signX
  const finalY = startY + side * signY

  // Dibujar el cuadrado
  context.beginPath()
  context.rect(startX, startY, finalX - startX, finalY - startY)
  context.stroke()
}

// Configurar la herramienta cuadrado
const setSquareTool = (context) => {
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

      // Dibujar el cuadrado en previsualización
      drawSquare(context, startX, startY, currentX, currentY)

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

      // Dibujar el cuadrado final con línea sólida
      context.save()
      context.setLineDash([]) // Línea sólida
      drawSquare(context, startX, startY, endX, endY)
      context.restore()

      // Limpiar
      canvasBackup = null
    },
  })
}

export { drawSquare, setSquareTool }
