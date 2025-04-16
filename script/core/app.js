import { canvas, context, initializeCanvas } from './canvas.js'
import { setupInputListeners } from './inputs.js'
import { setupToolListeners, setTool } from './tools.js'
import { clearCanvas } from './clear.js'
import { resetShapes } from './state.js'

const init = () => {
  if (!canvas || !context) {
    console.error('Canvas o contexto no encontrados')
    return
  }

  initializeCanvas()
  setupInputListeners()
  setupToolListeners()
  setTool('pencil') // Herramienta por defecto
}

// Ejecutar
init()

// Exponer funciones globalmente para compatibilidad con onclick (opcional)
window.clearCanvas = () => {
  clearCanvas(context, canvas)
  resetShapes()
}
window.setTool = setTool
