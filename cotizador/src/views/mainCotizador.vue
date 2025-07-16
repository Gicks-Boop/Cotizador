<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Cotizador de Software Empresarial</h1>
            <p class="text-gray-600 mt-1">Sistema avanzado de cotización con control total</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="activeTab = 'configuracion'"
              class="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              :class="{ 'bg-indigo-100 text-indigo-700': activeTab === 'configuracion' }"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Configuración
            </button>
            <button
              v-if="savedProjects.length > 0"
              @click="showProjectHistory = true"
              class="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Historial ({{ savedProjects.length }})
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <!-- Navegación por tabs -->
      <div v-if="!showSummary" class="bg-white rounded-xl shadow-lg mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-2 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5 inline-block mr-2" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-8">
          <!-- Tab de Proyecto -->
          <div v-if="activeTab === 'proyecto'">
            <formulario
              @calculate="handleCalculation"
              @save-draft="handleSaveDraft"
              :configuration="configuration"
            />
          </div>

          <!-- Tab de Configuración -->
          <div v-if="activeTab === 'configuracion'">
            <configuracion
              v-model:configuration="configuration"
            />
          </div>
        </div>
      </div>

      <!-- Resumen de Cotización -->
      <div v-if="showSummary" class="space-y-8">
        <resumenCotizacion
          :projectData="projectData"
          :calculation="calculation"
          :configuration="configuration"
          @reset="handleReset"
          @edit="handleEdit"
          @export-pdf="handleExportPDF"
          @share="handleShare"
        />
      </div>
    </div>

    <!-- Modal de Historial de Proyectos -->
    <div v-if="showProjectHistory" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Historial de Proyectos</h3>
          <button
            @click="showProjectHistory = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto max-h-[60vh] p-6">
          <div class="space-y-4">
            <div
              v-for="project in savedProjects"
              :key="project.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="loadProject(project)"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ project.projectData.name || 'Proyecto Sin Nombre' }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ formatProjectType(project.projectData.type) }}</p>
                  <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{{ project.projectData.timeline }} semanas</span>
                    <span>{{ project.projectData.features?.length || 0 }} características</span>
                    <span>{{ formatDate(project.savedAt) }}</span>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <p class="text-lg font-bold text-indigo-600">
                    ${{ project.calculation?.total?.toLocaleString() || 'N/A' }}
                  </p>
                  <button
                    @click.stop="deleteProject(project.id)"
                    class="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="savedProjects.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-gray-500">No hay proyectos guardados</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de Notificaciones -->
    <div v-if="notification.show" class="fixed bottom-4 right-4 z-50">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg text-white transition-all duration-300',
        notification.type === 'success' ? 'bg-green-500' :
        notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      ]">
        <div class="flex items-center">
          <svg v-if="notification.type === 'success'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else-if="notification.type === 'error'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ notification.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formulario from '@/components/formulario.vue'
import resumenCotizacion from '@/components/resumenCotizacion.vue'
import configuracion from '@/components/configuracion.vue'
import caculadoraPrecio from '@/components/caculadoraPrecio'

// Iconos como componentes simples
const ProjectIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>`
}

const SettingsIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>`
}

const PROJECT_TYPES = {
  web: 'Aplicación Web',
  mobile: 'Aplicación Móvil',
  desktop: 'Software de Escritorio',
  ecommerce: 'Tienda en Línea',
  crm: 'Sistema CRM',
  erp: 'Sistema ERP',
  custom: 'Personalizado'
}

export default {
  name: 'MainCotizadorMejorado',
  components: {
    formulario,
    resumenCotizacion,
    configuracion,
    ProjectIcon,
    SettingsIcon
  },
  data() {
    return {
      activeTab: 'proyecto',
      projectData: null,
      calculation: null,
      showSummary: false,
      showProjectHistory: false,
      savedProjects: [],
      configuration: {
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
      },
      notification: {
        show: false,
        type: 'info',
        message: ''
      },
      tabs: [
        { id: 'proyecto', name: 'Nuevo Proyecto', icon: 'ProjectIcon' },
        { id: 'configuracion', name: 'Configuración', icon: 'SettingsIcon' }
      ]
    }
  },
  mounted() {
    this.loadConfiguration()
    this.loadSavedProjects()
  },
  methods: {
    handleCalculation(data) {
      try {
        const calculation = caculadoraPrecio.calculateAdvanced(data.projectData, this.configuration)

        this.projectData = data.projectData
        this.calculation = calculation
        this.showSummary = true
        this.activeTab = 'proyecto'

        this.showNotification('Cotización generada exitosamente', 'success')
      } catch (error) {
        console.error('Error al calcular cotización:', error)
        this.showNotification('Error al generar la cotización', 'error')
      }
    },
    handleSaveDraft(projectData) {
      const draft = {
        id: `draft-${Date.now()}`,
        projectData,
        calculation: null,
        savedAt: new Date().toISOString(),
        isDraft: true
      }

      this.savedProjects.unshift(draft)
      this.saveSavedProjects()
      this.showNotification('Borrador guardado', 'success')
    },
    handleReset() {
      this.projectData = null
      this.calculation = null
      this.showSummary = false
      this.activeTab = 'proyecto'
    },
    handleEdit() {
      this.showSummary = false
      this.activeTab = 'proyecto'
    },
    handleExportPDF() {
      // Implementar exportación a PDF
      this.showNotification('Funcionalidad de exportación PDF próximamente', 'info')
    },
    handleShare(data) {
      // Implementar funcionalidad de compartir
      if (navigator.share) {
        navigator.share({
          title: `Cotización: ${data.projectData.name}`,
          text: `Cotización de proyecto por ${data.calculation.total.toLocaleString()}`,
          url: window.location.href
        })
      } else {
        // Fallback: copiar al portapapeles
        const shareText = `Cotización: ${data.projectData.name}\nTotal: ${data.calculation.total.toLocaleString()}\nDuración: ${data.projectData.timeline} semanas`
        navigator.clipboard.writeText(shareText)
        this.showNotification('Información copiada al portapapeles', 'success')
      }
    },
    loadProject(project) {
      this.projectData = project.projectData
      this.calculation = project.calculation
      this.showSummary = !!project.calculation
      this.showProjectHistory = false
      this.activeTab = 'proyecto'

      this.showNotification('Proyecto cargado', 'success')
    },
    deleteProject(projectId) {
      if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        this.savedProjects = this.savedProjects.filter(p => p.id !== projectId)
        this.saveSavedProjects()
        this.showNotification('Proyecto eliminado', 'success')
      }
    },
    saveProject() {
      if (!this.projectData || !this.calculation) return

      const project = {
        id: `project-${Date.now()}`,
        projectData: { ...this.projectData },
        calculation: { ...this.calculation },
        savedAt: new Date().toISOString(),
        isDraft: false
      }

      // Remover duplicados basados en el nombre del proyecto
      this.savedProjects = this.savedProjects.filter(p =>
        p.projectData.name !== project.projectData.name
      )

      this.savedProjects.unshift(project)
      this.saveSavedProjects()
      this.showNotification('Proyecto guardado', 'success')
    },
    loadConfiguration() {
      try {
        const saved = localStorage.getItem('cotizador-configuration')
        if (saved) {
          const savedConfig = JSON.parse(saved)
          this.configuration = { ...this.configuration, ...savedConfig }
        }
      } catch (error) {
        console.error('Error loading configuration:', error)
      }
    },
    saveConfiguration() {
      try {
        localStorage.setItem('cotizador-configuration', JSON.stringify(this.configuration))
      } catch (error) {
        console.error('Error saving configuration:', error)
      }
    },
    loadSavedProjects() {
      try {
        const saved = localStorage.getItem('cotizador-projects')
        if (saved) {
          this.savedProjects = JSON.parse(saved)
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      }
    },
    saveSavedProjects() {
      try {
        // Mantener solo los últimos 50 proyectos
        const projectsToSave = this.savedProjects.slice(0, 50)
        localStorage.setItem('cotizador-projects', JSON.stringify(projectsToSave))
      } catch (error) {
        console.error('Error saving projects:', error)
      }
    },
    showNotification(message, type = 'info') {
      this.notification = {
        show: true,
        message,
        type
      }

      setTimeout(() => {
        this.notification.show = false
      }, 4000)
    },
    formatProjectType(type) {
      return PROJECT_TYPES[type] || type
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  watch: {
    configuration: {
      handler() {
        this.saveConfiguration()
      },
      deep: true
    },
    calculation: {
      handler(newCalculation) {
        if (newCalculation && this.projectData) {
          this.saveProject()
        }
      }
    }
  }
}
</script>
