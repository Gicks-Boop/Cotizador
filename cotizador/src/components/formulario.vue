<template>
  <form @submit.prevent="submitForm">
    <div class="space-y-6">
      <!-- Información básica del proyecto -->
      <div>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Información del Proyecto</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="projectName" class="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
            <input 
              type="text" 
              id="projectName" 
              v-model="projectData.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
          </div>
          <div>
            <label for="projectType" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Proyecto</label>
            <select 
              id="projectType" 
              v-model="projectData.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="web">Aplicación Web</option>
              <option value="mobile">Aplicación Móvil</option>
              <option value="desktop">Software de Escritorio</option>
              <option value="ecommerce">Tienda en Línea</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Selector de características -->
      <Selector
      v-model:features="projectData.features"
      :projectType="projectData.type"/>

      <!-- Timeline -->
      <div>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tiempo de Desarrollo</h2>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="timeline" class="block text-sm font-medium text-gray-700 mb-1">Tiempo estimado (semanas)</label>
            <input 
              type="range" 
              id="timeline" 
              v-model="projectData.timeline"
              min="1" 
              max="24" 
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
          <span class="text-lg font-medium text-indigo-600">{{ projectData.timeline }} semanas</span>
        </div>
      </div>

      <!-- Botón de enviar -->
      <div class="pt-4">
        <button 
          type="submit" 
          class="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calcular Cotización
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import caculadoraPrecio from './caculadoraPrecio'
import Selector from './selector.vue'


export default {
  components: {
    Selector
  },
  data() {
    return {
      projectData: {
        name: '',
        type: '',
        features: [],
        timeline: 4
      }
    }
  },
  methods: {
    submitForm() {
      const totalPrice = caculadoraPrecio.calculate(this.projectData)
      this.$emit('calculate', {
        projectData: {...this.projectData},
        totalPrice
      })
    }
  }
}
</script>