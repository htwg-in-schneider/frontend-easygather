import { notifyWarning } from '@/composables/useNotification.js'

const MAX_FILE_SIZE = 3 * 1024 * 1024

export function useProductImageUpload(form) {
  function onImageFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    if (!file.type.startsWith('image/')) {
      notifyWarning('Bitte eine Bilddatei wählen (JPG, PNG, WebP …).')
      event.target.value = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      notifyWarning('Das Bild darf maximal 3 MB groß sein.')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      form.value.imageUrl = reader.result
    }
    reader.readAsDataURL(file)
  }

  function clearCustomImage() {
    form.value.imageUrl = ''
  }

  return { onImageFileChange, clearCustomImage }
}
