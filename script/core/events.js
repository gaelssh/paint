const addEvents = (element, handlers) => {
  Object.entries(handlers).forEach(([event, handler]) => {
    element.addEventListener(event, handler)
  })
}

const removeEvents = (element, handlers) => {
  Object.entries(handlers).forEach(([event, handler]) => {
    element.removeEventListener(event, handler)
  })
}

export { addEvents, removeEvents }
