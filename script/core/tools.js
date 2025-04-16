// tools.js
import { canvas, context } from './canvas.js'
import { setPencilTool } from '../shapes/pencil.js'
import { setSquareTool } from '../shapes/square.js'
import { addEvents } from './events.js'
import { colorPicker } from './inputs.js' // Importar colorPicker
import { clearCanvas } from './clear.js' // Importar clearCanvas

const tools = document.querySelectorAll('.tools button')
let currentTool = 'pencil'

const setTool = (tool) => {
  tools.forEach((button) => button.classList.remove('active'))
  const activeButton = document.querySelector(`button[data-tool="${tool}"]`)
  if (activeButton) {
    activeButton.classList.add('active')
  } else {
    console.error(`No se encontró botón con data-tool="${tool}"`)
  }
  currentTool = tool

  switch (tool) {
    case 'pencil':
      context.strokeStyle = colorPicker.value || '#000000'
      setPencilTool(context)(canvas)
      break
    case 'eraser':
      // Eraser is just a white pencil
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
      console.log("Herramienta 'triangle' no implementada aún")
      break
    case 'square':
      setSquareTool(context)(canvas)
      break
    case 'rectangle':
      console.log("Herramienta 'rectangle' no implementada aún")
      break
    case 'circle':
      console.log("Herramienta 'circle' no implementada aún")
      break
    case 'line':
      console.log("Herramienta 'line' no implementada aún")
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
