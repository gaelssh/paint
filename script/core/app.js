import { canvas, context, initializeCanvas } from './canvas.js'
import { setupInputListeners } from './inputs.js'
import { setupToolListeners, setTool } from './tools.js'
import { clearCanvas } from './clear.js'
import { resetShapes } from './state.js'
import { initHistory, saveToHistory } from './history.js'

const init = () => {
  if (!canvas || !context) {
    console.error('Canvas o contexto no encontrados')
    return
  }

  initializeCanvas()
  setupInputListeners()
  setupToolListeners()

  // Inicializar el historial
  initHistory()

  // Establecer la herramienta de lápiz por defecto
  setTool('pencil')
}

// Ejecutar
init()

// Exponer funciones globalmente para compatibilidad con onclick (opcional)
window.clearCanvas = () => {
  clearCanvas(context, canvas)
  resetShapes()
  // Guardar el estado del canvas limpio en el historial
  saveToHistory()
}
window.setTool = setTool
