import { defineStore } from 'pinia'

export const useBannerStore = defineStore('banner', {
  state: () => ({
    isVisible: true,
  }),
  actions: {
    hideBanner() {
      this.isVisible = false
    },
  },
})
