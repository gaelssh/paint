import { context } from './canvas.js'
import { addEvents } from './events.js'
import { getCurrentTool } from './tools.js'

const thicknessInput = document.getElementById('thickness')
const colorPicker = document.getElementById('colorPicker')

const setupInputListeners = () => {
  if (!thicknessInput || !colorPicker) {
    console.error('Inputs no encontrados')
    return
  }

  const handlers = {
    input: (e) => {
      if (e.target === thicknessInput) {
        context.lineWidth = parseInt(e.target.value, 10)
      } else if (e.target === colorPicker) {
        if (getCurrentTool() === 'eraser') {
          context.strokeStyle = '#ffffff'
        } else {
          context.strokeStyle = e.target.value
        }
      }
    },
  }

  addEvents(thicknessInput, handlers)
  addEvents(colorPicker, handlers)
}

export { setupInputListeners, thicknessInput, colorPicker }
