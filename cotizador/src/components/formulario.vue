<template>
  <form @submit.prevent="submitForm" class="space-y-8">
    <!-- Información básica del proyecto -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Información del Proyecto
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label for="projectName" class="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del Proyecto *
          </label>
          <input
            type="text"
            id="projectName"
            v-model="projectData.name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Ej: Sistema de gestión empresarial ABC Corp"
            required
          >
        </div>

        <div>
          <label for="projectType" class="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Proyecto *
          </label>
          <select
            id="projectType"
            v-model="projectData.type"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            required
            @change="onProjectTypeChange"
          >
            <option value="">Seleccione un tipo</option>
            <option v-for="type in projectTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
          <p v-if="selectedProjectType" class="text-sm text-gray-600 mt-1">
            Horas base estimadas: {{ selectedProjectType.baseHours }} horas
          </p>
        </div>

        <div>
          <label for="priority" class="block text-sm font-semibold text-gray-700 mb-2">
            Prioridad del Proyecto
          </label>
          <select
            id="priority"
            v-model="projectData.priority"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option v-for="(multiplier, priority) in priorityOptions" :key="priority" :value="priority">
              {{ formatPriority(priority) }}
              <span v-if="multiplier !== 1">({{ getMultiplierText(multiplier) }})</span>
            </option>
          </select>
        </div>

        <div>
          <label for="client" class="block text-sm font-semibold text-gray-700 mb-2">
            Cliente
          </label>
          <input
            type="text"
            id="client"
            v-model="projectData.client"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Nombre del cliente o empresa"
          >
        </div>

        <div>
          <label for="budget" class="block text-sm font-semibold text-gray-700 mb-2">
            Presupuesto Máximo (Opcional)
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="budget"
              v-model.number="projectData.maxBudget"
              class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="0"
              min="0"
            >
          </div>
        </div>

        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
            Descripción del Proyecto
          </label>
          <textarea
            id="description"
            v-model="projectData.description"
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Describe los objetivos principales, funcionalidades requeridas y cualquier requisito especial del proyecto..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Selector de características mejorado -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
      <Selector
        v-model:features="projectData.features"
        :projectType="projectData.type"
        :configuration="configuration"
      />
    </div>

    <!-- Timeline y complejidad -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Tiempo y Complejidad
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="timeline" class="block text-sm font-semibold text-gray-700 mb-2">
            Duración Estimada: {{ projectData.timeline }} semanas
          </label>
          <input
            type="range"
            id="timeline"
            v-model.number="projectData.timeline"
            min="1"
            max="52"
            class="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider"
          >
          <div class="flex justify-between text-sm text-gray-600 mt-2">
            <span>1 semana</span>
            <span class="font-medium text-purple-600">{{ projectData.timeline }} semanas</span>
            <span>52 semanas</span>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            Fecha estimada de entrega: {{ estimatedDeliveryDate }}
          </p>
        </div>

        <div>
          <label for="complexity" class="block text-sm font-semibold text-gray-700 mb-2">
            Nivel de Complejidad
          </label>
          <select
            id="complexity"
            v-model="projectData.complexity"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="low">Baja - Proyecto simple con funcionalidades básicas</option>
            <option value="medium">Media - Proyecto estándar con funcionalidades moderadas</option>
            <option value="high">Alta - Proyecto complejo con múltiples integraciones</option>
            <option value="enterprise">Empresarial - Solución robusta y escalable</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Equipo requerido -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        Equipo Sugerido
      </h2>

      <div v-if="suggestedTeam.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="role in suggestedTeam" :key="role.id" class="bg-white rounded-lg border p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-800">{{ role.name }}</h4>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {{ formatLevel(role.level) }}
            </span>
          </div>
          <p class="text-sm text-gray-600 mb-2">{{ role.hours }} horas estimadas</p>
          <p class="text-sm font-semibold text-orange-600">
            ${{ (role.hours * (configuration?.hourlyRates?.[role.level] || 0)).toLocaleString() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Resumen rápido -->
    <div v-if="quickEstimate" class="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 border border-indigo-300">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        Estimación Rápida
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600">Horas Totales</p>
          <p class="text-2xl font-bold text-indigo-600">{{ quickEstimate.totalHours }}</p>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600">Costo Equipo</p>
          <p class="text-2xl font-bold text-green-600">${{ quickEstimate.teamCost.toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600">Recursos</p>
          <p class="text-2xl font-bold text-orange-600">${{ quickEstimate.resourceCost.toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600">Total Estimado</p>
          <p class="text-2xl font-bold text-purple-600">${{ quickEstimate.total.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
      <button
        type="button"
        @click="saveAsDraft"
        class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        Guardar Borrador
      </button>
      <button
        type="submit"
        :disabled="!isFormValid"
        class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <span class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Generar Cotización Detallada
        </span>
      </button>
    </div>
  </form>
</template>

<script>
import Selector from './selector.vue'
import caculadoraPrecio from './caculadoraPrecio'

export default {
  name: 'FormularioMejorado',
  components: {
    Selector
  },
  props: {
    configuration: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['calculate', 'save-draft'],
  data() {
    return {
      projectData: {
        name: '',
        type: '',
        features: [],
        timeline: 8,
        priority: 'normal',
        complexity: 'medium',
        client: '',
        description: '',
        maxBudget: null
      },
      projectTypes: [
        { value: 'web', label: 'Aplicación Web', baseHours: 400 },
        { value: 'mobile', label: 'Aplicación Móvil', baseHours: 600 },
        { value: 'desktop', label: 'Software de Escritorio', baseHours: 500 },
        { value: 'ecommerce', label: 'Tienda en Línea', baseHours: 800 },
        { value: 'crm', label: 'Sistema CRM', baseHours: 1000 },
        { value: 'erp', label: 'Sistema ERP', baseHours: 1500 },
        { value: 'custom', label: 'Personalizado', baseHours: 0 }
      ]
    }
  },
  computed: {
    selectedProjectType() {
      return this.projectTypes.find(type => type.value === this.projectData.type)
    },
    priorityOptions() {
      return this.configuration?.multipliers || {
        flexible: 0.8,
        normal: 1.0,
        urgent: 1.5,
        critical: 2.0
      }
    },
    suggestedTeam() {
      if (!this.projectData.type || !this.configuration?.teamRoles) return []

      // Filtrar roles sugeridos basados en el tipo de proyecto
      const rolesByType = {
        web: ['frontend', 'backend', 'ui', 'qa', 'pm'],
        mobile: ['frontend', 'backend', 'ui', 'qa', 'pm'],
        desktop: ['backend', 'ui', 'qa', 'pm'],
        ecommerce: ['frontend', 'backend', 'ui', 'qa', 'pm'],
        crm: ['frontend', 'backend', 'ui', 'qa', 'pm'],
        erp: ['frontend', 'backend', 'ui', 'qa', 'pm'],
        custom: ['frontend', 'backend', 'ui', 'qa', 'pm']
      }

      const suggestedRoleIds = rolesByType[this.projectData.type] || []
      return this.configuration.teamRoles.filter(role =>
        suggestedRoleIds.includes(role.id) || suggestedRoleIds.length === 0
      )
    },
    quickEstimate() {
      if (!this.projectData.type || !this.configuration) return null

      try {
        const estimate = caculadoraPrecio.calculateAdvanced(this.projectData, this.configuration)
        return estimate
      } catch (error) {
        console.error('Error calculating quick estimate:', error)
        return null
      }
    },
    estimatedDeliveryDate() {
      const today = new Date()
      const deliveryDate = new Date(today.getTime() + (this.projectData.timeline * 7 * 24 * 60 * 60 * 1000))
      return deliveryDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    isFormValid() {
      return this.projectData.name.trim() !== '' && this.projectData.type !== ''
    }
  },
  methods: {
    submitForm() {
      if (!this.isFormValid) return

      const calculation = caculadoraPrecio.calculateAdvanced(this.projectData, this.configuration)
      this.$emit('calculate', {
        projectData: { ...this.projectData },
        calculation
      })
    },
    saveAsDraft() {
      this.$emit('save-draft', { ...this.projectData })
    },
    onProjectTypeChange() {
      // Limpiar características cuando cambia el tipo de proyecto
      this.projectData.features = []
    },
    formatPriority(priority) {
      const priorities = {
        flexible: 'Flexible',
        normal: 'Normal',
        urgent: 'Urgente',
        critical: 'Crítico'
      }
      return priorities[priority] || priority
    },
    formatLevel(level) {
      const levels = {
        junior: 'Junior',
        semi: 'Semi-Senior',
        senior: 'Senior',
        lead: 'Lead',
        architect: 'Architect'
      }
      return levels[level] || level
    },
    getMultiplierText(multiplier) {
      if (multiplier < 1) return `${Math.round((1 - multiplier) * 100)}% descuento`
      if (multiplier > 1) return `+${Math.round((multiplier - 1) * 100)}%`
      return ''
    }
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
