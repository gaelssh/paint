// tools.js
import { canvas, context } from './canvas.js'
import { setPencilTool } from '../shapes/pencil.js'
import { setSquareTool } from '../shapes/square.js'
import { setTriangleTool } from '../shapes/triangle.js'
import { setCircleTool } from '../shapes/circle.js'
import { setRectangleTool } from '../shapes/rectangle.js'
import { setLineTool } from '../shapes/line.js'
import { addEvents } from './events.js'
import { colorPicker } from './inputs.js' // Importar colorPicker
import { clearCanvas } from './clear.js' // Importar clearCanvas

const tools = document.querySelectorAll('.tools button')
let currentTool = 'pencil'
let savedColor = '#000000' // Para guardar el color antes de cambiar al eraser

const setTool = (tool) => {
  // Desactivar todas las herramientas anteriores
  tools.forEach((button) => button.classList.remove('active'))

  // Activar la herramienta seleccionada
  const activeButton = document.querySelector(`button[data-tool="${tool}"]`)
  if (activeButton) {
    activeButton.classList.add('active')
  } else {
    console.error(`No se encontró botón con data-tool="${tool}"`)
    return
  }

  // Si estamos cambiando desde el eraser a otra herramienta
  if (currentTool === 'eraser' && tool !== 'eraser') {
    // Restaurar el color guardado
    context.strokeStyle = savedColor
  } else if (tool === 'eraser') {
    // Si estamos cambiando a eraser, guardar el color actual
    savedColor = colorPicker.value || '#000000'
  }

  // Actualizar la herramienta actual
  currentTool = tool

  // Aplicar la nueva herramienta
  switch (tool) {
    case 'pencil':
      context.strokeStyle = colorPicker.value || '#000000'
      setPencilTool(context)(canvas)
      break
    case 'eraser':
      // Eraser is just a white pencil, forzar color blanco siempre
      context.strokeStyle = '#ffffff'
      setPencilTool(context)(canvas)
      break
    case 'clear':
      // Clear the canvas
      clearCanvas(context, canvas)

      // Manually reset to pencil without recursive call
      tools.forEach((button) => button.classList.remove('active'))
      const pencilButton = document.querySelector('button[data-tool="pencil"]')
      if (pencilButton) {
        pencilButton.classList.add('active')
      }
      currentTool = 'pencil'
      context.strokeStyle = colorPicker.value || '#000000'
      setPencilTool(context)(canvas)
      break
    case 'triangle':
      context.strokeStyle = colorPicker.value || '#000000'
      setTriangleTool(context)(canvas)
      break
    case 'square':
      context.strokeStyle = colorPicker.value || '#000000'
      setSquareTool(context)(canvas)
      break
    case 'rectangle':
      context.strokeStyle = colorPicker.value || '#000000'
      setRectangleTool(context)(canvas)
      break
    case 'circle':
      context.strokeStyle = colorPicker.value || '#000000'
      setCircleTool(context)(canvas)
      break
    case 'line':
      context.strokeStyle = colorPicker.value || '#000000'
      setLineTool(context)(canvas)
      break
    case 'back':
      console.log("Herramienta 'back' no implementada aún")
      break
    case 'forward':
      console.log("Herramienta 'forward' no implementada aún")
      break
    case 'download':
      console.log("Herramienta 'download' no implementada aún")
      break
    case 'upload':
      console.log("Herramienta 'upload' no implementada aún")
      break
    default:
      console.error(`Herramienta desconocida: ${tool}`)
  }
}

const setupToolListeners = () => {
  if (tools.length === 0) {
    console.error('Botones de herramientas no encontrados')
    return
  }

  tools.forEach((button) => {
    const handlers = {
      click: () => {
        const tool = button.getAttribute('data-tool')
        setTool(tool)
      },
    }
    addEvents(button, handlers)
  })
}

const getCurrentTool = () => currentTool

export { setTool, setupToolListeners, getCurrentTool, tools }
