export function create(tag, className, text = undefined) {
  const newElement = document.createElement(tag);
  newElement.className = className;
  if (text) {
    newElement.innerText = text;
  }
  return newElement;
}

export function bindToDOM(parent, element) {
  parent.appendChild(element);
}
