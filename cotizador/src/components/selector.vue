<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Características del Proyecto</h2>
    
    <div v-if="availableFeatures.length === 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Seleccione primero el tipo de proyecto para ver las características disponibles.
          </p>
        </div>
      </div>
    </div>
    
    <div v-else class="space-y-3">
      <div v-for="feature in availableFeatures" :key="feature.id" class="flex items-start">
        <div class="flex items-center h-5">
          <input 
            :id="`feature-${feature.id}`" 
            v-model="selectedFeatures" 
            :value="feature.id"
            type="checkbox" 
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          >
        </div>
        <div class="ml-3 text-sm">
          <label :for="`feature-${feature.id}`" class="font-medium text-gray-700">{{ feature.name }}</label>
          <p class="text-gray-500">{{ feature.description }}</p>
          <p class="text-indigo-600 font-medium mt-1">+${{ feature.price.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const FEATURES_BY_TYPE = {
  web: [
    { id: 'auth', name: 'Autenticación de usuarios', description: 'Registro, login y recuperación de contraseña', price: 1500 },
    { id: 'admin', name: 'Panel de administración', description: 'Dashboard para gestión de contenidos', price: 2500 },
    { id: 'api', name: 'API REST', description: 'Interfaz para integración con otros sistemas', price: 3000 },
    { id: 'responsive', name: 'Diseño Responsivo', description: 'Adaptable a móviles y tablets', price: 1800 },
  ],
  mobile: [
    { id: 'auth', name: 'Autenticación de usuarios', description: 'Registro, login y recuperación de contraseña', price: 2000 },
    { id: 'offline', name: 'Funcionalidad Offline', description: 'Sincronización cuando hay conexión', price: 3500 },
    { id: 'notifications', name: 'Notificaciones Push', description: 'Envío de notificaciones a dispositivos', price: 2500 },
    { id: 'camera', name: 'Acceso a Cámara', description: 'Captura y procesamiento de imágenes', price: 2800 },
  ],
  ecommerce: [
    { id: 'cart', name: 'Carrito de compras', description: 'Gestión de productos y checkout', price: 3500 },
    { id: 'payments', name: 'Pasarela de pagos', description: 'Integración con PayPal, Stripe, etc.', price: 4000 },
    { id: 'inventory', name: 'Gestión de inventario', description: 'Control de stock y alertas', price: 3000 },
    { id: 'reviews', name: 'Reseñas de productos', description: 'Sistema de calificaciones y comentarios', price: 1800 },
  ],
   desktop: [
    { id: 'installer', name: 'Instalador personalizado', description: 'Asistente de instalación para Windows/Mac/Linux', price: 2500 },
    { id: 'database', name: 'Base de datos local', description: 'Integración con SQLite o similares', price: 1800 },
    { id: 'autoUpdate', name: 'Actualizaciones automáticas', description: 'Sistema para actualización de software', price: 3200 },
  ],
  custom: [
    { id: 'consulting', name: 'Consultoría previa', description: 'Análisis y levantamiento de requerimientos', price: 1500 },
    { id: 'support', name: 'Soporte extendido', description: 'Soporte técnico post-desarrollo', price: 2000 },
  ]
}

export default {
  name: "Selector",
  props: {
    projectType: {
      type: String,
      default: ''
    },
    features: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:features'],
  computed: {
    availableFeatures() {
      return FEATURES_BY_TYPE[this.projectType] || []
    },
    selectedFeatures: {
      get() {
        return this.features
      },
      set(value) {
        this.$emit('update:features', value)
      }
    }
  }
}
</script>