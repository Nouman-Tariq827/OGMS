// Payment Methods Configuration
// This file makes the payment system scalable and easy to maintain

export const PAYMENT_METHODS = {
  COD: {
    id: 'COD',
    name: 'Cash on Delivery (COD)',
    description: 'Pay when you receive your order',
    icon: 'fas fa-money-bill-wave',
    enabled: true,
    requiresPaymentOnDelivery: true,
    showPayPalButton: false,
  },
  JazzCash: {
    id: 'JazzCash',
    name: 'JazzCash',
    description: 'Pay with JazzCash mobile wallet',
    icon: 'fas fa-mobile-alt',
    enabled: false, // Set to true when ready to implement
    requiresPaymentOnDelivery: false,
    showPayPalButton: false,
  },
  Easypaisa: {
    id: 'Easypaisa',
    name: 'Easypaisa',
    description: 'Pay with Easypaisa mobile wallet',
    icon: 'fas fa-wallet',
    enabled: false, // Set to true when ready to implement
    requiresPaymentOnDelivery: false,
    showPayPalButton: false,
  },
}

// Get enabled payment methods
export const getEnabledPaymentMethods = () => {
  return Object.values(PAYMENT_METHODS).filter(method => method.enabled)
}

// Get default payment method
export const getDefaultPaymentMethod = () => {
  const enabledMethods = getEnabledPaymentMethods()
  return enabledMethods.length > 0 ? enabledMethods[0].id : PAYMENT_METHODS.COD.id
}

// Check if payment method requires payment on delivery
export const requiresPaymentOnDelivery = (paymentMethod) => {
  const method = PAYMENT_METHODS[paymentMethod]
  return method ? method.requiresPaymentOnDelivery : false
}

// Check if payment method should show PayPal button
export const shouldShowPayPalButton = (paymentMethod) => {
  const method = PAYMENT_METHODS[paymentMethod]
  return method ? method.showPayPalButton : false
}

// Get payment method display name
export const getPaymentMethodDisplayName = (paymentMethod) => {
  const method = PAYMENT_METHODS[paymentMethod]
  return method ? method.name : paymentMethod
}
