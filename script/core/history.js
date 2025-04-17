// history.js
import { canvas, context } from './canvas.js'

// Configuración del historial
const MAX_HISTORY_LENGTH = 20 // Máximo número de estados en el historial

// Estado del historial
let history = [] // Almacena los estados del canvas
let currentIndex = -1 // Índice actual en el historial
let undoDisabled = true // Estado del botón retroceder
let redoDisabled = true // Estado del botón avanzar

// Inicializar el historial con el estado inicial del canvas vacío
const initHistory = () => {
  const initialState = context.getImageData(0, 0, canvas.width, canvas.height)
  history = [initialState]
  currentIndex = 0
  updateButtonStates()
}

// Actualizar los estados de los botones deshacer y rehacer
const updateButtonStates = () => {
  undoDisabled = currentIndex <= 0
  redoDisabled = currentIndex >= history.length - 1

  // Actualizar la apariencia visual de los botones
  const backButton = document.querySelector('[data-tool="back"]')
  const forwardButton = document.querySelector('[data-tool="forward"]')

  if (backButton) {
    if (undoDisabled) {
      backButton.classList.add('disabled')
    } else {
      backButton.classList.remove('disabled')
    }
  }

  if (forwardButton) {
    if (redoDisabled) {
      forwardButton.classList.add('disabled')
    } else {
      forwardButton.classList.remove('disabled')
    }
  }
}

// Guardar un nuevo estado en el historial
const saveToHistory = () => {
  const currentState = context.getImageData(0, 0, canvas.width, canvas.height)

  // Si hemos retrocedido y hacemos una nueva acción, eliminar el futuro
  if (currentIndex < history.length - 1) {
    history = history.slice(0, currentIndex + 1)
  }

  // Agregar el nuevo estado
  history.push(currentState)

  // Limitar el tamaño del historial
  if (history.length > MAX_HISTORY_LENGTH) {
    history.shift()
  } else {
    currentIndex++
  }

  updateButtonStates()
}

// Retroceder un paso en el historial (deshacer)
const undo = () => {
  if (currentIndex > 0) {
    currentIndex--
    const prevState = history[currentIndex]
    context.putImageData(prevState, 0, 0)
    updateButtonStates()
    return true
  }
  return false
}

// Avanzar un paso en el historial (rehacer)
const redo = () => {
  if (currentIndex < history.length - 1) {
    currentIndex++
    const nextState = history[currentIndex]
    context.putImageData(nextState, 0, 0)
    updateButtonStates()
    return true
  }
  return false
}

// Verificar si podemos deshacer
const canUndo = () => currentIndex > 0

// Verificar si podemos rehacer
const canRedo = () => currentIndex < history.length - 1

export { initHistory, saveToHistory, undo, redo, canUndo, canRedo }
