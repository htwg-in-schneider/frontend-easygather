import { reactive } from 'vue'

export const notificationState = reactive({
  message: '',
  type: 'info',
})

let timer = null

export function dismissNotification() {
  notificationState.message = ''
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function showNotification(message, type = 'info', autoDismissMs = 5000) {
  dismissNotification()
  notificationState.message = message
  notificationState.type = type
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (autoDismissMs > 0) {
    timer = setTimeout(dismissNotification, autoDismissMs)
  }
}

export function notifySuccess(message, autoDismissMs = 4500) {
  showNotification(message, 'success', autoDismissMs)
}

export function notifyError(message, autoDismissMs = 6000) {
  showNotification(message, 'error', autoDismissMs)
}

export function notifyWarning(message, autoDismissMs = 5000) {
  showNotification(message, 'warning', autoDismissMs)
}

export function notifyInfo(message, autoDismissMs = 5000) {
  showNotification(message, 'info', autoDismissMs)
}

export function useNotification() {
  return {
    state: notificationState,
    dismiss: dismissNotification,
    success: notifySuccess,
    error: notifyError,
    warning: notifyWarning,
    info: notifyInfo,
  }
}
