export function useWidth(dom) {
  let domW = 0
  if (dom && dom.value) {
    console.log(dom, dom.offsetWidth)
    domW = dom.value.offsetWidth
  }
  console.log(dom)
  return domW
}
