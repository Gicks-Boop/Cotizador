<template>
  <div class="border-t border-gray-200 pt-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Resumen de Cotización</h2>
    
    <div class="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ projectData.name }}</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p class="text-sm text-gray-500">Tipo de proyecto</p>
          <p class="font-medium">{{ formatProjectType(projectData.type) }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Tiempo estimado</p>
          <p class="font-medium">{{ projectData.timeline }} semanas</p>
        </div>
      </div>
      
      <div v-if="projectData.features.length > 0">
        <h4 class="font-medium text-gray-800 mb-2">Características incluidas:</h4>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="featureId in projectData.features" :key="featureId">
            {{ getFeatureName(featureId) }}
          </li>
        </ul>
      </div>
    </div>
    
    <div class="bg-indigo-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-indigo-800 mb-4">Total estimado</h3>
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm text-indigo-600">Precio base + características</p>
          <p class="text-3xl font-bold text-indigo-800">${{ totalPrice.toLocaleString() }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-indigo-600">Tiempo estimado</p>
          <p class="text-lg font-medium text-indigo-800">{{ projectData.timeline }} semanas</p>
        </div>
      </div>
    </div>
    
    <div class="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
      <button 
        @click="$emit('reset')"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Crear nueva cotización
      </button>
      <button 
        class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Exportar a PDF
      </button>
    </div>
  </div>
</template>

<script>
const PROJECT_TYPES = {
  web: 'Aplicación Web',
  mobile: 'Aplicación Móvil',
  desktop: 'Software de Escritorio',
  ecommerce: 'Tienda en Línea',
  custom: 'Personalizado'
}

const FEATURES = {
  auth: 'Autenticación de usuarios',
  admin: 'Panel de administración',
  api: 'API REST',
  responsive: 'Diseño Responsivo',
  offline: 'Funcionalidad Offline',
  notifications: 'Notificaciones Push',
  camera: 'Acceso a Cámara',
  cart: 'Carrito de compras',
  payments: 'Pasarela de pagos',
  inventory: 'Gestión de inventario',
  reviews: 'Reseñas de productos'
}

export default {
  props: {
    projectData: {
      type: Object,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  methods: {
    formatProjectType(type) {
      return PROJECT_TYPES[type] || type
    },
    getFeatureName(featureId) {
      return FEATURES[featureId] || featureId
    }
  }
}
</script>