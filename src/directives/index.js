export const errimg = {
  inserted (el, opt) {
    el.onerror = () => {
      el.src = opt.value
    }
  }

}
