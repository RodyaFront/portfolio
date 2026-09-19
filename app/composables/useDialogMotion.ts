const DIALOG_EXIT_MS = 200

function prefersReducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Open/close helpers for native `<dialog>` with enter CSS animation
 * and exit via `.is-closing` before `close()`.
 */
export function useDialogMotion(dialogRef: Ref<HTMLDialogElement | null>) {
  let closing = false
  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (!timer) return
    clearTimeout(timer)
    timer = null
  }

  function openModal() {
    const el = dialogRef.value
    if (!el || el.open) return
    clearTimer()
    closing = false
    el.classList.remove('is-closing')
    el.showModal()
  }

  function requestClose() {
    const el = dialogRef.value
    if (!el?.open || closing) return

    if (prefersReducedMotion()) {
      el.close()
      return
    }

    closing = true
    el.classList.add('is-closing')
    clearTimer()
    timer = setTimeout(() => {
      timer = null
      el.classList.remove('is-closing')
      el.close()
      closing = false
    }, DIALOG_EXIT_MS)
  }

  /** Keep Escape from instant-closing so exit can animate. */
  function onCancel(event: Event) {
    event.preventDefault()
    requestClose()
  }

  onBeforeUnmount(() => {
    clearTimer()
  })

  return {
    openModal,
    requestClose,
    onCancel,
    exitMs: DIALOG_EXIT_MS,
  }
}
