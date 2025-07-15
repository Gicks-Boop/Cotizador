const BASE_PRICES = {
  web: 5000,
  mobile: 7000,
  desktop: 6000,
  ecommerce: 10000,
  custom: 8000
}

const FEATURE_PRICES = {
  auth: 1500,
  admin: 2500,
  api: 3000,
  responsive: 1800,
  offline: 3500,
  notifications: 2500,
  camera: 2800,
  cart: 3500,
  payments: 4000,
  inventory: 3000,
  reviews: 1800
}

export default {
  calculate(projectData) {
    // Precio base según tipo de proyecto
    let total = BASE_PRICES[projectData.type] || 0
    
    // Sumar características seleccionadas
    projectData.features.forEach(featureId => {
      total += FEATURE_PRICES[featureId] || 0
    })
    
    // Ajustar por tiempo (20% más por cada semana por debajo de 4)
    const weeks = parseInt(projectData.timeline) || 4
    if (weeks < 4) {
      const multiplier = 1 + (4 - weeks) * 0.2
      total *= multiplier
    }
    
    return Math.round(total)
  }
}