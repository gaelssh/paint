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
import { undo, redo, saveToHistory } from './history.js' // Importar funciones de historial

const tools = document.querySelectorAll('.tools button')
let currentTool = 'pencil'
let savedColor = '#000000' // Para guardar el color antes de cambiar al eraser

// Función para exportar el canvas como PNG
const exportAsPNG = () => {
  try {
    // Crear un enlace temporal para la descarga
    const link = document.createElement('a')
    link.download = 'paint-dibujo.png'

    // Convertir el canvas a una URL de datos
    link.href = canvas.toDataURL('image/png')

    // Añadir al documento, simular clic y eliminar
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al exportar la imagen:', error)
    alert('Hubo un error al exportar la imagen. Por favor, intenta nuevamente.')
  }
}

// Función para importar una imagen al canvas
const importImage = () => {
  try {
    // Crear un input de tipo archivo temporal
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png, image/jpeg, image/gif'

    // Manejar el evento change
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          // Guardar estado anterior para historial
          const previousState = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          )

          // Dibujar la imagen en el canvas
          context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            canvas.width,
            canvas.height
          )

          // Guardar en el historial
          saveToHistory()
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }

    // Simular clic en el input
    input.click()
  } catch (error) {
    console.error('Error al importar la imagen:', error)
    alert('Hubo un error al importar la imagen. Por favor, intenta nuevamente.')
  }
}

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
      // Guardar el estado del canvas limpio en el historial
      saveToHistory()

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
      // Retroceder un paso en el historial
      undo()
      break
    case 'forward':
      // Avanzar un paso en el historial
      redo()
      break
    case 'download':
      // Exportar el canvas como PNG
      exportAsPNG()
      break
    case 'upload':
      // Importar una imagen al canvas
      importImage()
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
