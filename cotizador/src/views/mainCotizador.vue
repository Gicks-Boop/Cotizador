<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-center text-indigo-700 mb-8">Cotizador de Proyectos de Software</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <formulario @calculate="handleCalculation" />
        
        <div v-if="showSummary" class="mt-8">
          <resumenCotizacion 
            :projectData="projectData" 
            :totalPrice="totalPrice"
            @reset="handleReset"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formulario from '@/components/formulario.vue';
import resumenCotizacion from '@/components/resumenCotizacion.vue';

export default {
  components: {
    formulario,
    resumenCotizacion
  },
  data() {
    return {
      projectData: null,
      totalPrice: 0,
      showSummary: false
    }
  },
  methods: {
    handleCalculation(data) {
      this.projectData = data.projectData
      this.totalPrice = data.totalPrice
      this.showSummary = true
    },
    handleReset() {
      this.projectData = null
      this.totalPrice = 0
      this.showSummary = false
    }
  }
}
</script>