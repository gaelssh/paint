const clearCanvas = (context, canvas) => {
  if (!context || !canvas) throw new Error('Canvas o contexto no disponible')
  context.clearRect(0, 0, canvas.width, canvas.height)
}

export { clearCanvas }
