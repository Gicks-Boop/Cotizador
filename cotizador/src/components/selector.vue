<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <svg class="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Características del Proyecto
    </h2>

    <div v-if="availableFeatures.length === 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700 font-medium">
            Seleccione primero el tipo de proyecto para ver las características disponibles.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Características por categorías -->
      <div v-for="category in categorizedFeatures" :key="category.name" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center">
            <component :is="category.icon" class="w-5 h-5 mr-2" :class="category.color" />
            {{ category.name }}
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">
              {{ getSelectedInCategory(category.features).length }}/{{ category.features.length }} seleccionadas
            </span>
            <button
              @click="toggleCategorySelection(category.features)"
              class="text-sm px-3 py-1 rounded-full border transition-colors"
              :class="isAnyCategorySelected(category.features)
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'"
            >
              {{ isAnyCategorySelected(category.features) ? 'Deseleccionar todo' : 'Seleccionar todo' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="feature in category.features"
            :key="feature.id"
            class="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
            :class="{ 'border-indigo-500 bg-indigo-50': selectedFeatures.includes(feature.id) }"
            @click="toggleFeature(feature.id)"
          >
            <div class="flex items-start space-x-3">
              <div class="flex items-center pt-1">
                <input
                  :id="`feature-${feature.id}`"
                  :checked="selectedFeatures.includes(feature.id)"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors"
                  @click.stop
                  @change="toggleFeature(feature.id)"
                >
              </div>
              <div class="flex-1 min-w-0">
                <label :for="`feature-${feature.id}`" class="block font-semibold text-gray-900 cursor-pointer">
                  {{ feature.name }}
                </label>
                <p class="text-sm text-gray-600 mt-1">{{ feature.description }}</p>
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center space-x-4">
                    <span class="inline-flex items-center text-sm text-indigo-600 font-medium">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      +{{ feature.hours }} hrs
                    </span>
                    <span class="inline-flex items-center text-sm text-green-600 font-bold">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      ${{ calculateFeatureCost(feature).toLocaleString() }}
                    </span>
                  </div>
                  <div v-if="feature.complexity" class="flex items-center">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getComplexityClass(feature.complexity)"
                    >
                      {{ formatComplexity(feature.complexity) }}
                    </span>
                  </div>
                </div>

                <!-- Dependencias -->
                <div v-if="feature.dependencies && feature.dependencies.length > 0" class="mt-2">
                  <p class="text-xs text-amber-600 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    Requiere: {{ getDependencyNames(feature.dependencies).join(', ') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Indicador de selección -->
            <div
              v-if="selectedFeatures.includes(feature.id)"
              class="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Características personalizadas -->
      <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Características Personalizadas
          </h3>
          <button
            @click="showCustomFeatureForm = !showCustomFeatureForm"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            {{ showCustomFeatureForm ? 'Cancelar' : 'Agregar Personalizada' }}
          </button>
        </div>

        <!-- Formulario para características personalizadas -->
        <div v-if="showCustomFeatureForm" class="bg-white rounded-lg p-4 border border-purple-200 mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                v-model="customFeature.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ej: Integración con API externa"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Horas estimadas</label>
              <input
                v-model.number="customFeature.hours"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="40"
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                v-model="customFeature.description"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe la funcionalidad personalizada..."
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <button
              @click="resetCustomFeature"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
            <button
              @click="addCustomFeature"
              :disabled="!canAddCustomFeature"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar Característica
            </button>
          </div>
        </div>

        <!-- Lista de características personalizadas -->
        <div v-if="customFeatures.length > 0" class="space-y-2">
          <div
            v-for="feature in customFeatures"
            :key="feature.id"
            class="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200"
          >
            <div class="flex items-center space-x-3">
              <input
                :checked="selectedFeatures.includes(feature.id)"
                type="checkbox"
                class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                @change="toggleFeature(feature.id)"
              >
              <div>
                <p class="font-medium text-gray-900">{{ feature.name }}</p>
                <p class="text-sm text-gray-600">{{ feature.description }}</p>
                <p class="text-sm text-purple-600 font-medium">+{{ feature.hours }} hrs - ${{ calculateFeatureCost(feature).toLocaleString() }}</p>
              </div>
            </div>
            <button
              @click="removeCustomFeature(feature.id)"
              class="text-red-600 hover:text-red-800 p-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen de selección -->
      <div v-if="selectedFeatures.length > 0" class="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
        <h3 class="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
          </svg>
          Resumen de Características Seleccionadas
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600">Total de Características</p>
            <p class="text-2xl font-bold text-indigo-600">{{ selectedFeatures.length }}</p>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600">Horas Adicionales</p>
            <p class="text-2xl font-bold text-green-600">{{ totalSelectedHours }}</p>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <p class="text-sm text-gray-600">Costo Estimado</p>
            <p class="text-2xl font-bold text-purple-600">${{ totalSelectedCost.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Iconos para las categorías
/* const ShieldIcon = 'svg'
const CogIcon = 'svg'
const DeviceIcon = 'svg'
const ChartIcon = 'svg'
const GlobeIcon = 'svg'
const DatabaseIcon = 'svg' */

const FEATURES_BY_TYPE = {
  web: [
    {
      id: 'auth',
      name: 'Autenticación de usuarios',
      description: 'Sistema completo de registro, login y recuperación de contraseña',
      hours: 40,
      complexity: 'medium',
      category: 'security',
      dependencies: []
    },
    {
      id: 'admin',
      name: 'Panel de administración',
      description: 'Dashboard completo para gestión de contenidos y usuarios',
      hours: 80,
      complexity: 'high',
      category: 'interface',
      dependencies: ['auth']
    },
    {
      id: 'api',
      name: 'API REST',
      description: 'Interfaz de programación para integración con sistemas externos',
      hours: 120,
      complexity: 'high',
      category: 'integration',
      dependencies: []
    },
    {
      id: 'responsive',
      name: 'Diseño Responsivo',
      description: 'Adaptación completa para móviles, tablets y desktop',
      hours: 60,
      complexity: 'medium',
      category: 'interface',
      dependencies: []
    },
    {
      id: 'seo',
      name: 'Optimización SEO',
      description: 'Optimización para motores de búsqueda y rendimiento',
      hours: 40,
      complexity: 'medium',
      category: 'optimization',
      dependencies: []
    },
    {
      id: 'analytics',
      name: 'Analytics & Reporting',
      description: 'Sistema de análisis y generación de reportes',
      hours: 60,
      complexity: 'medium',
      category: 'analytics',
      dependencies: []
    }
  ],
  mobile: [
    {
      id: 'auth',
      name: 'Autenticación de usuarios',
      description: 'Sistema de login con autenticación biométrica opcional',
      hours: 60,
      complexity: 'medium',
      category: 'security',
      dependencies: []
    },
    {
      id: 'offline',
      name: 'Funcionalidad Offline',
      description: 'Capacidad de trabajar sin conexión con sincronización',
      hours: 100,
      complexity: 'high',
      category: 'performance',
      dependencies: []
    },
    {
      id: 'notifications',
      name: 'Notificaciones Push',
      description: 'Sistema de notificaciones push personalizables',
      hours: 80,
      complexity: 'medium',
      category: 'integration',
      dependencies: []
    },
    {
      id: 'camera',
      name: 'Acceso a Cámara',
      description: 'Captura y procesamiento de imágenes y videos',
      hours: 60,
      complexity: 'medium',
      category: 'device',
      dependencies: []
    },
    {
      id: 'gps',
      name: 'Geolocalización',
      description: 'Servicios de ubicación y mapas integrados',
      hours: 40,
      complexity: 'low',
      category: 'device',
      dependencies: []
    },
    {
      id: 'biometric',
      name: 'Autenticación Biométrica',
      description: 'Login con huella dactilar o reconocimiento facial',
      hours: 80,
      complexity: 'high',
      category: 'security',
      dependencies: ['auth']
    }
  ],
  ecommerce: [
    {
      id: 'cart',
      name: 'Carrito de compras',
      description: 'Sistema completo de carrito con persistencia',
      hours: 80,
      complexity: 'medium',
      category: 'core',
      dependencies: []
    },
    {
      id: 'payments',
      name: 'Pasarela de pagos',
      description: 'Integración con múltiples métodos de pago',
      hours: 120,
      complexity: 'high',
      category: 'integration',
      dependencies: ['cart']
    },
    {
      id: 'inventory',
      name: 'Gestión de inventario',
      description: 'Control de stock, alertas y gestión de productos',
      hours: 100,
      complexity: 'high',
      category: 'management',
      dependencies: []
    },
    {
      id: 'reviews',
      name: 'Reseñas de productos',
      description: 'Sistema de calificaciones y comentarios de usuarios',
      hours: 60,
      complexity: 'medium',
      category: 'social',
      dependencies: ['auth']
    },
    {
      id: 'shipping',
      name: 'Cálculo de envíos',
      description: 'Integración con empresas de envío y cálculo de costos',
      hours: 80,
      complexity: 'high',
      category: 'integration',
      dependencies: ['cart']
    }
  ],
  crm: [
    {
      id: 'contacts',
      name: 'Gestión de contactos',
      description: 'Base de datos completa de clientes y prospectos',
      hours: 120,
      complexity: 'medium',
      category: 'management',
      dependencies: []
    },
    {
      id: 'pipeline',
      name: 'Pipeline de ventas',
      description: 'Seguimiento visual del proceso de ventas',
      hours: 160,
      complexity: 'high',
      category: 'analytics',
      dependencies: ['contacts']
    },
    {
      id: 'reports',
      name: 'Reportes avanzados',
      description: 'Generación de reportes personalizables y dashboards',
      hours: 140,
      complexity: 'high',
      category: 'analytics',
      dependencies: ['contacts']
    },
    {
      id: 'automation',
      name: 'Automatización',
      description: 'Flujos de trabajo automatizados y triggers',
      hours: 200,
      complexity: 'enterprise',
      category: 'automation',
      dependencies: ['contacts', 'pipeline']
    }
  ],
  erp: [
    {
      id: 'accounting',
      name: 'Contabilidad',
      description: 'Módulo completo de contabilidad y finanzas',
      hours: 300,
      complexity: 'enterprise',
      category: 'finance',
      dependencies: []
    },
    {
      id: 'inventory',
      name: 'Gestión de inventario',
      description: 'Control avanzado de inventarios y almacenes',
      hours: 200,
      complexity: 'high',
      category: 'management',
      dependencies: []
    },
    {
      id: 'hr',
      name: 'Recursos Humanos',
      description: 'Gestión de empleados, nómina y beneficios',
      hours: 250,
      complexity: 'high',
      category: 'management',
      dependencies: []
    },
    {
      id: 'production',
      name: 'Producción',
      description: 'Control de procesos productivos y manufactura',
      hours: 400,
      complexity: 'enterprise',
      category: 'operations',
      dependencies: ['inventory']
    }
  ],
  desktop: [
    {
      id: 'installer',
      name: 'Instalador personalizado',
      description: 'Asistente de instalación para múltiples plataformas',
      hours: 60,
      complexity: 'medium',
      category: 'deployment',
      dependencies: []
    },
    {
      id: 'database',
      name: 'Base de datos local',
      description: 'Integración con bases de datos locales (SQLite, etc.)',
      hours: 80,
      complexity: 'medium',
      category: 'data',
      dependencies: []
    },
    {
      id: 'autoUpdate',
      name: 'Actualizaciones automáticas',
      description: 'Sistema de actualización automática del software',
      hours: 100,
      complexity: 'high',
      category: 'deployment',
      dependencies: []
    },
    {
      id: 'encryption',
      name: 'Cifrado de datos',
      description: 'Protección y cifrado de información sensible',
      hours: 120,
      complexity: 'high',
      category: 'security',
      dependencies: []
    }
  ],
  custom: [
    {
      id: 'consulting',
      name: 'Consultoría previa',
      description: 'Análisis detallado y levantamiento de requerimientos',
      hours: 40,
      complexity: 'low',
      category: 'planning',
      dependencies: []
    },
    {
      id: 'support',
      name: 'Soporte extendido',
      description: 'Soporte técnico post-desarrollo por 6 meses',
      hours: 20,
      complexity: 'low',
      category: 'support',
      dependencies: []
    },
    {
      id: 'training',
      name: 'Capacitación',
      description: 'Entrenamiento del equipo en el uso del sistema',
      hours: 30,
      complexity: 'low',
      category: 'support',
      dependencies: []
    },
    {
      id: 'documentation',
      name: 'Documentación técnica',
      description: 'Documentación completa del sistema y APIs',
      hours: 40,
      complexity: 'medium',
      category: 'documentation',
      dependencies: []
    }
  ]
}

const CATEGORY_CONFIG = {
  security: {
    name: 'Seguridad',
    icon: 'ShieldIcon',
    color: 'text-red-600'
  },
  interface: {
    name: 'Interfaz de Usuario',
    icon: 'DeviceIcon',
    color: 'text-blue-600'
  },
  integration: {
    name: 'Integraciones',
    icon: 'GlobeIcon',
    color: 'text-green-600'
  },
  analytics: {
    name: 'Análisis y Reportes',
    icon: 'ChartIcon',
    color: 'text-purple-600'
  },
  management: {
    name: 'Gestión',
    icon: 'CogIcon',
    color: 'text-yellow-600'
  },
  data: {
    name: 'Datos',
    icon: 'DatabaseIcon',
    color: 'text-indigo-600'
  },
  performance: {
    name: 'Rendimiento',
    icon: 'CogIcon',
    color: 'text-orange-600'
  },
  device: {
    name: 'Dispositivo',
    icon: 'DeviceIcon',
    color: 'text-pink-600'
  },
  core: {
    name: 'Funcionalidad Principal',
    icon: 'CogIcon',
    color: 'text-gray-600'
  },
  social: {
    name: 'Social',
    icon: 'GlobeIcon',
    color: 'text-blue-500'
  },
  automation: {
    name: 'Automatización',
    icon: 'CogIcon',
    color: 'text-teal-600'
  },
  finance: {
    name: 'Finanzas',
    icon: 'ChartIcon',
    color: 'text-emerald-600'
  },
  operations: {
    name: 'Operaciones',
    icon: 'CogIcon',
    color: 'text-slate-600'
  },
  deployment: {
    name: 'Despliegue',
    icon: 'DeviceIcon',
    color: 'text-cyan-600'
  },
  planning: {
    name: 'Planificación',
    icon: 'ChartIcon',
    color: 'text-amber-600'
  },
  support: {
    name: 'Soporte',
    icon: 'ShieldIcon',
    color: 'text-lime-600'
  },
  documentation: {
    name: 'Documentación',
    icon: 'DatabaseIcon',
    color: 'text-stone-600'
  },
  optimization: {
    name: 'Optimización',
    icon: 'ChartIcon',
    color: 'text-violet-600'
  }
}

export default {
  name: "SelectorMejorado",
  props: {
    projectType: {
      type: String,
      default: ''
    },
    features: {
      type: Array,
      default: () => []
    },
    configuration: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:features'],
  data() {
    return {
      showCustomFeatureForm: false,
      customFeatures: [],
      customFeature: {
        name: '',
        description: '',
        hours: 0
      }
    }
  },
  computed: {
    availableFeatures() {
      const standardFeatures = FEATURES_BY_TYPE[this.projectType] || []
      return [...standardFeatures, ...this.customFeatures]
    },
    categorizedFeatures() {
      const categories = {}

      this.availableFeatures.forEach(feature => {
        const categoryKey = feature.category || 'other'
        if (!categories[categoryKey]) {
          categories[categoryKey] = {
            ...CATEGORY_CONFIG[categoryKey],
            name: CATEGORY_CONFIG[categoryKey]?.name || 'Otros',
            icon: CATEGORY_CONFIG[categoryKey]?.icon || 'CogIcon',
            color: CATEGORY_CONFIG[categoryKey]?.color || 'text-gray-600',
            features: []
          }
        }
        categories[categoryKey].features.push(feature)
      })

      return Object.values(categories)
    },
    selectedFeatures: {
      get() {
        return this.features
      },
      set(value) {
        this.$emit('update:features', value)
      }
    },
    totalSelectedHours() {
      return this.selectedFeatures.reduce((total, featureId) => {
        const feature = this.availableFeatures.find(f => f.id === featureId)
        return total + (feature?.hours || 0)
      }, 0)
    },
    totalSelectedCost() {
      return this.selectedFeatures.reduce((total, featureId) => {
        const feature = this.availableFeatures.find(f => f.id === featureId)
        return total + this.calculateFeatureCost(feature)
      }, 0)
    },
    canAddCustomFeature() {
      return this.customFeature.name.trim() !== '' &&
             this.customFeature.hours > 0 &&
             this.customFeature.description.trim() !== ''
    }
  },
  methods: {
    toggleFeature(featureId) {
      const feature = this.availableFeatures.find(f => f.id === featureId)

      if (this.selectedFeatures.includes(featureId)) {
        // Remover característica y sus dependientes
        this.removeFeatureAndDependents(featureId)
      } else {
        // Agregar característica y sus dependencias
        this.addFeatureWithDependencies(feature)
      }
    },
    addFeatureWithDependencies(feature) {
      const newFeatures = [...this.selectedFeatures]

      // Agregar dependencias primero
      if (feature.dependencies) {
        feature.dependencies.forEach(depId => {
          if (!newFeatures.includes(depId)) {
            newFeatures.push(depId)
          }
        })
      }

      // Agregar la característica principal
      if (!newFeatures.includes(feature.id)) {
        newFeatures.push(feature.id)
      }

      this.selectedFeatures = newFeatures
    },
    removeFeatureAndDependents(featureId) {
      let newFeatures = [...this.selectedFeatures]

      // Encontrar características que dependen de esta
      const dependents = this.availableFeatures.filter(f =>
        f.dependencies && f.dependencies.includes(featureId)
      )

      // Remover dependientes primero
      dependents.forEach(dependent => {
        newFeatures = newFeatures.filter(id => id !== dependent.id)
      })

      // Remover la característica principal
      newFeatures = newFeatures.filter(id => id !== featureId)

      this.selectedFeatures = newFeatures
    },
    toggleCategorySelection(categoryFeatures) {
      const categoryIds = categoryFeatures.map(f => f.id)
      const hasAnySelected = categoryIds.some(id => this.selectedFeatures.includes(id))

      if (hasAnySelected) {
        // Deseleccionar toda la categoría
        categoryIds.forEach(id => {
          if (this.selectedFeatures.includes(id)) {
            this.removeFeatureAndDependents(id)
          }
        })
      } else {
        // Seleccionar toda la categoría
        categoryFeatures.forEach(feature => {
          this.addFeatureWithDependencies(feature)
        })
      }
    },
    isAnyCategorySelected(categoryFeatures) {
      return categoryFeatures.some(f => this.selectedFeatures.includes(f.id))
    },
    getSelectedInCategory(categoryFeatures) {
      return categoryFeatures.filter(f => this.selectedFeatures.includes(f.id))
    },
    calculateFeatureCost(feature) {
      if (!feature) return 0

      const averageRate = this.getAverageHourlyRate()
      return feature.hours * averageRate
    },
    getAverageHourlyRate() {
      const rates = this.configuration?.hourlyRates || { semi: 40, senior: 60 }
      const rateValues = Object.values(rates)
      return rateValues.reduce((sum, rate) => sum + rate, 0) / rateValues.length
    },
    addCustomFeature() {
      if (!this.canAddCustomFeature) return

      const newFeature = {
        id: `custom-${Date.now()}`,
        name: this.customFeature.name,
        description: this.customFeature.description,
        hours: this.customFeature.hours,
        complexity: 'medium',
        category: 'custom',
        isCustom: true
      }

      this.customFeatures.push(newFeature)
      this.resetCustomFeature()
      this.showCustomFeatureForm = false
    },
    removeCustomFeature(featureId) {
      // Remover de características personalizadas
      this.customFeatures = this.customFeatures.filter(f => f.id !== featureId)
      // Remover de seleccionadas si estaba seleccionada
      this.selectedFeatures = this.selectedFeatures.filter(id => id !== featureId)
    },
    resetCustomFeature() {
      this.customFeature = {
        name: '',
        description: '',
        hours: 0
      }
    },
    getDependencyNames(dependencies) {
      return dependencies.map(depId => {
        const feature = this.availableFeatures.find(f => f.id === depId)
        return feature?.name || depId
      })
    },
    getComplexityClass(complexity) {
      const classes = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        enterprise: 'bg-red-100 text-red-800'
      }
      return classes[complexity] || classes.medium
    },
    formatComplexity(complexity) {
      const labels = {
        low: 'Básica',
        medium: 'Media',
        high: 'Alta',
        enterprise: 'Empresarial'
      }
      return labels[complexity] || complexity
    }
  },
  watch: {
    projectType: {
      handler() {
        // Limpiar características personalizadas cuando cambia el tipo de proyecto
        this.customFeatures = []
        this.selectedFeatures = []
      }
    }
  }
}
</script>
