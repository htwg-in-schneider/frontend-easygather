import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCheckoutStore = defineStore('checkout', () => {
  const delivery = ref({
    firstName: '',
    lastName: '',
    street: '',
    postalCode: '',
    city: '',
    phone: '',
    deliveryNote: '',
  })
  const paymentMethod = ref('KARTE')
  const paymentDetails = ref({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    paypalEmail: '',
  })

  function setDelivery(address) {
    delivery.value = {
      firstName: address.firstName ?? '',
      lastName: address.lastName ?? '',
      street: address.street ?? '',
      postalCode: address.postalCode ?? '',
      city: address.city ?? '',
      phone: address.phone ?? '',
      deliveryNote: address.deliveryNote ?? '',
    }
  }

  function setPaymentMethod(method) {
    paymentMethod.value = method
  }

  function reset() {
    delivery.value = {
      firstName: '',
      lastName: '',
      street: '',
      postalCode: '',
      city: '',
      phone: '',
      deliveryNote: '',
    }
    paymentMethod.value = 'KARTE'
    paymentDetails.value = {
      cardHolder: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      paypalEmail: '',
    }
  }

  return {
    delivery,
    paymentMethod,
    paymentDetails,
    setDelivery,
    setPaymentMethod,
    reset,
  }
})
