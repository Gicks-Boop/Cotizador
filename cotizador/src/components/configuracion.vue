<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center">
        <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        Configuración del Sistema
      </h2>
      <button
        @click="resetToDefaults"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Restaurar Valores por Defecto
      </button>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tarifas por Hora -->
    <div v-if="activeTab === 'rates'" class="space-y-6">
      <div class="bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
          Tarifas por Hora (USD)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(rate, level) in config.hourlyRates" :key="level" class="bg-white rounded-lg border p-4">
            <label :for="'rate-' + level" class="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {{ formatLevel(level) }}
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                :id="'rate-' + level"
                v-model.number="config.hourlyRates[level]"
                type="number"
                min="0"
                step="0.01"
                class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                @input="saveConfig"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Roles del Equipo -->
    <div v-if="activeTab === 'team'" class="space-y-6">
      <div class="bg-green-50 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Roles del Equipo
          </h3>
          <button
            @click="addTeamRole"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Rol
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(role, index) in config.teamRoles" :key="role.id" class="bg-white rounded-lg border p-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
                <input
                  v-model="role.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  @input="saveConfig"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                <select
                  v-model="role.level"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  @change="saveConfig"
                >
                  <option v-for="(rate, level) in config.hourlyRates" :key="level" :value="level">
                    {{ formatLevel(level) }} (${{ rate }}/hr)
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Horas Estimadas</label>
                <input
                  v-model.number="role.hours"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  @input="saveConfig"
                >
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-semibold text-indigo-600">
                  ${{ (role.hours * config.hourlyRates[role.level]).toLocaleString() }}
                </span>
                <button
                  @click="removeTeamRole(index)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recursos y Herramientas -->
    <div v-if="activeTab === 'resources'" class="space-y-6">
      <div class="bg-purple-50 rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
            Recursos y Herramientas
          </h3>
          <button
            @click="addResource"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Recurso
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(resource, index) in config.resources" :key="resource.id" class="bg-white rounded-lg border p-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Recurso</label>
                <input
                  v-model="resource.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  @input="saveConfig"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Costo</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    v-model.number="resource.cost"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    @input="saveConfig"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  v-model="resource.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  @change="saveConfig"
                >
                  <option value="one-time">Pago Único</option>
                  <option value="monthly">Mensual</option>
                  <option value="annual">Anual</option>
                </select>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-semibold text-purple-600">
                  ${{ resource.cost.toLocaleString() }}
                </span>
                <button
                  @click="removeResource(index)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Multiplicadores -->
    <div v-if="activeTab === 'multipliers'" class="space-y-6">
      <div class="bg-orange-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Multiplicadores de Prioridad
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(multiplier, priority) in config.multipliers" :key="priority" class="bg-white rounded-lg border p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {{ formatPriority(priority) }}
            </label>
            <div class="relative">
              <input
                v-model.number="config.multipliers[priority]"
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                @input="saveConfig"
              >
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ getMultiplierDescription(priority, multiplier) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración de Empresa -->
    <div v-if="activeTab === 'company'" class="space-y-6">
      <div class="bg-indigo-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-1a1 1 0 011-1h4a1 1 0 011 1v1m-6 0v-3"></path>
          </svg>
          Información de la Empresa
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
            <input
              v-model="config.company.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="saveConfig"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
            <input
              v-model="config.company.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="saveConfig"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              v-model="config.company.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="saveConfig"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
            <input
              v-model="config.company.website"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="saveConfig"
            >
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <textarea
              v-model="config.company.address"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              @input="saveConfig"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const DEFAULT_CONFIG = {
  hourlyRates: {
    junior: 25,
    semi: 40,
    senior: 60,
    lead: 80,
    architect: 100
  },
  teamRoles: [
    { id: 'frontend', name: 'Frontend Developer', level: 'semi', hours: 160 },
    { id: 'backend', name: 'Backend Developer', level: 'senior', hours: 200 },
    { id: 'ui', name: 'UI/UX Designer', level: 'semi', hours: 80 },
    { id: 'qa', name: 'QA Tester', level: 'junior', hours: 120 },
    { id: 'pm', name: 'Project Manager', level: 'lead', hours: 100 }
  ],
  resources: [
    { id: 'hosting', name: 'Hosting/Cloud Services', cost: 500, type: 'monthly' },
    { id: 'licenses', name: 'Software Licenses', cost: 1000, type: 'one-time' },
    { id: 'apis', name: 'Third-party APIs', cost: 300, type: 'monthly' },
    { id: 'ssl', name: 'SSL Certificate', cost: 100, type: 'annual' }
  ],
  multipliers: {
    flexible: 0.8,
    normal: 1.0,
    urgent: 1.5,
    critical: 2.0
  },
  company: {
    name: 'Tu Empresa de Software',
    email: 'contacto@tuempresa.com',
    phone: '+1 (555) 123-4567',
    website: 'https://tuempresa.com',
    address: 'Calle Principal 123, Ciudad, País'
  }
}

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Configuracion',
  props: {
    configuration: {
      type: Object,
      default: () => ({ ...DEFAULT_CONFIG })
    }
  },
  emits: ['update:configuration'],
  data() {
    return {
      activeTab: 'rates',
      config: { ...DEFAULT_CONFIG, ...this.configuration },
      tabs: [
        { id: 'rates', name: 'Tarifas' },
        { id: 'team', name: 'Equipo' },
        { id: 'resources', name: 'Recursos' },
        { id: 'multipliers', name: 'Prioridades' },
        { id: 'company', name: 'Empresa' }
      ]
    }
  },
  methods: {
    saveConfig() {
      this.$emit('update:configuration', { ...this.config })
    },
    addTeamRole() {
      this.config.teamRoles.push({
        id: `role-${Date.now()}`,
        name: 'Nuevo Rol',
        level: 'junior',
        hours: 40
      })
      this.saveConfig()
    },
    removeTeamRole(index) {
      this.config.teamRoles.splice(index, 1)
      this.saveConfig()
    },
    addResource() {
      this.config.resources.push({
        id: `resource-${Date.now()}`,
        name: 'Nuevo Recurso',
        cost: 0,
        type: 'one-time'
      })
      this.saveConfig()
    },
    removeResource(index) {
      this.config.resources.splice(index, 1)
      this.saveConfig()
    },
    resetToDefaults() {
      if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto? Se perderán todos los cambios.')) {
        this.config = { ...DEFAULT_CONFIG }
        this.saveConfig()
      }
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
    formatPriority(priority) {
      const priorities = {
        flexible: 'Flexible',
        normal: 'Normal',
        urgent: 'Urgente',
        critical: 'Crítico'
      }
      return priorities[priority] || priority
    },
    getMultiplierDescription(priority, multiplier) {
      if (multiplier < 1) return `${Math.round((1 - multiplier) * 100)}% de descuento`
      if (multiplier > 1) return `${Math.round((multiplier - 1) * 100)}% adicional`
      return 'Precio base'
    }
  },
  watch: {
    configuration: {
      handler(newConfig) {
        this.config = { ...DEFAULT_CONFIG, ...newConfig }
      },
      deep: true
    }
  }
}
</script>
