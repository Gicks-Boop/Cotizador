<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold mb-2">Cotización Detallada</h2>
          <p class="text-indigo-100">{{ projectData.name || 'Proyecto Sin Nombre' }}</p>
        </div>
        <div class="text-right">
          <p class="text-4xl font-bold">${{ calculation.total.toLocaleString() }}</p>
          <p class="text-indigo-200">Total del Proyecto</p>
        </div>
      </div>
    </div>

    <div class="p-8 space-y-8">
      <!-- Información del Proyecto -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div class="flex items-center">
            <div class="p-3 bg-blue-500 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Tipo de Proyecto</p>
              <p class="text-lg font-semibold text-gray-900">{{ formatProjectType(projectData.type) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-6 border border-green-200">
          <div class="flex items-center">
            <div class="p-3 bg-green-500 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Duración</p>
              <p class="text-lg font-semibold text-gray-900">{{ projectData.timeline }} semanas</p>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <div class="flex items-center">
            <div class="p-3 bg-purple-500 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Prioridad</p>
              <p class="text-lg font-semibold text-gray-900 capitalize">{{ formatPriority(projectData.priority) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div class="flex items-center">
            <div class="p-3 bg-orange-500 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Horas Totales</p>
              <p class="text-lg font-semibold text-gray-900">{{ calculation.totalHours }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Descripción del Proyecto -->
      <div v-if="projectData.description" class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Descripción del Proyecto</h3>
        <p class="text-gray-700 leading-relaxed">{{ projectData.description }}</p>
      </div>

      <!-- Cliente -->
      <div v-if="projectData.client" class="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
        <h3 class="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Información del Cliente
        </h3>
        <p class="text-indigo-700 font-medium">{{ projectData.client }}</p>
        <div v-if="projectData.maxBudget" class="mt-2">
          <p class="text-sm text-indigo-600">
            Presupuesto máximo: ${{ projectData.maxBudget.toLocaleString() }}
          </p>
          <div class="mt-1 bg-white rounded-full h-2 overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="budgetStatus.class"
              :style="{ width: budgetStatus.percentage + '%' }"
            ></div>
          </div>
          <p class="text-xs mt-1" :class="budgetStatus.textClass">
            {{ budgetStatus.message }}
          </p>
        </div>
      </div>

      <!-- Características Incluidas -->
      <div v-if="selectedFeaturesList.length > 0" class="space-y-4">
        <h3 class="text-xl font-bold text-gray-800 flex items-center">
          <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Características Incluidas ({{ selectedFeaturesList.length }})
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="feature in selectedFeaturesList" :key="feature.id" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900">{{ feature.name }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ feature.description }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="inline-flex items-center text-sm text-indigo-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ feature.hours }} hrs
                  </span>
                  <span class="inline-flex items-center text-sm text-green-600 font-medium">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    ${{ calculateFeatureCost(feature).toLocaleString() }}
                  </span>
                </div>
              </div>
              <div v-if="feature.complexity" class="ml-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getComplexityClass(feature.complexity)"
                >
                  {{ formatComplexity(feature.complexity) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desglose de Costos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Costos del Equipo -->
        <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 class="text-lg font-bold text-blue-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Equipo de Desarrollo
          </h3>
          <div class="space-y-3">
            <div v-for="role in calculation.breakdown.team" :key="role.id" class="flex justify-between items-center bg-white p-3 rounded border">
              <div>
                <p class="font-medium text-gray-900">{{ role.name }}</p>
                <p class="text-sm text-gray-600">
                  {{ role.adjustedHours || role.hours }} hrs × ${{ role.hourlyRate || getHourlyRate(role.level) }}/hr
                </p>
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {{ formatLevel(role.level) }}
                </span>
              </div>
              <p class="font-bold text-blue-600">${{ role.totalCost.toLocaleString() }}</p>
            </div>
            <div class="border-t pt-3 mt-3">
              <div class="flex justify-between items-center font-bold text-lg">
                <span class="text-blue-800">Total Equipo</span>
                <span class="text-blue-600">${{ calculation.teamCost.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recursos y Herramientas -->
        <div class="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 class="text-lg font-bold text-green-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
            Recursos y Herramientas
          </h3>
          <div class="space-y-3">
            <div v-for="resource in calculation.breakdown.resources" :key="resource.id" class="flex justify-between items-center bg-white p-3 rounded border">
              <div>
                <p class="font-medium text-gray-900">{{ resource.name }}</p>
                <p class="text-sm text-gray-600">
                  <span v-if="resource.type === 'one-time'">Pago único</span>
                  <span v-else-if="resource.type === 'monthly'">{{ resource.units }} meses × ${{ resource.unitCost }}/mes</span>
                  <span v-else-if="resource.type === 'annual'">{{ resource.units }} años × ${{ resource.unitCost }}/año</span>
                </p>
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full capitalize">
                  {{ formatResourceType(resource.type) }}
                </span>
              </div>
              <p class="font-bold text-green-600">${{ resource.totalCost.toLocaleString() }}</p>
            </div>
            <div class="border-t pt-3 mt-3">
              <div class="flex justify-between items-center font-bold text-lg">
                <span class="text-green-800">Total Recursos</span>
                <span class="text-green-600">${{ calculation.resourceCost.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Multiplicadores y Ajustes -->
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
          </svg>
          Ajustes y Multiplicadores
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 border">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Complejidad</p>
                <p class="font-semibold text-gray-900 capitalize">{{ formatComplexity(projectData.complexity) }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold" :class="getMultiplierColor(calculation.complexityMultiplier)">
                  {{ calculation.complexityMultiplier }}x
                </p>
                <p class="text-xs text-gray-500">
                  {{ getMultiplierText(calculation.complexityMultiplier) }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Timeline</p>
                <p class="font-semibold text-gray-900">{{ projectData.timeline }} semanas</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold" :class="getMultiplierColor(calculation.timelineMultiplier)">
                  {{ calculation.timelineMultiplier }}x
                </p>
                <p class="text-xs text-gray-500">
                  {{ getMultiplierText(calculation.timelineMultiplier) }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Prioridad</p>
                <p class="font-semibold text-gray-900 capitalize">{{ formatPriority(projectData.priority) }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold" :class="getMultiplierColor(calculation.priorityMultiplier)">
                  {{ calculation.priorityMultiplier }}x
                </p>
                <p class="text-xs text-gray-500">
                  {{ getMultiplierText(calculation.priorityMultiplier) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen Final de Costos -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Resumen Financiero
        </h3>

        <div class="space-y-4">
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-700">Costo del Equipo</span>
            <span class="font-semibold text-gray-900">${{ calculation.teamCost.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-700">Recursos y Herramientas</span>
            <span class="font-semibold text-gray-900">${{ calculation.resourceCost.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-t border-gray-300">
            <span class="text-gray-700 font-medium">Subtotal</span>
            <span class="font-semibold text-gray-900">${{ calculation.subtotal.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-gray-700">Ajustes por Prioridad ({{ calculation.priorityMultiplier }}x)</span>
            <span class="font-semibold" :class="getMultiplierColor(calculation.priorityMultiplier)">
              {{ calculation.priorityMultiplier !== 1 ?
                (calculation.priorityMultiplier > 1 ? '+' : '') +
                '$' + ((calculation.total - calculation.subtotal)).toLocaleString() :
                '$0'
              }}
            </span>
          </div>
          <div class="flex justify-between items-center py-3 border-t-2 border-indigo-300 bg-white rounded-lg px-4">
            <span class="text-xl font-bold text-indigo-800">Total Final</span>
            <span class="text-2xl font-bold text-indigo-600">${{ calculation.total.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Fechas del Proyecto -->
        <div class="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h4 class="font-semibold text-yellow-800 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Cronograma del Proyecto
          </h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Fecha de inicio estimada:</span>
              <span class="font-medium">{{ estimatedStartDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Fecha de entrega estimada:</span>
              <span class="font-medium">{{ estimatedDeliveryDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Duración total:</span>
              <span class="font-medium">{{ projectData.timeline }} semanas</span>
            </div>
          </div>
        </div>

        <!-- Estadísticas del Proyecto -->
        <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">
          <h4 class="font-semibold text-teal-800 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
            </svg>
            Estadísticas
          </h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Costo por semana:</span>
              <span class="font-medium">${{ Math.round(calculation.total / projectData.timeline).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Costo por hora:</span>
              <span class="font-medium">${{ Math.round(calculation.total / calculation.totalHours).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ratio recursos/equipo:</span>
              <span class="font-medium">{{ Math.round((calculation.resourceCost / calculation.teamCost) * 100) }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Promedio tarifa/hora:</span>
              <span class="font-medium">${{ getAverageHourlyRate().toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Validez de la cotización -->
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-amber-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-sm">
            <p class="font-medium text-amber-800">Validez de la Cotización</p>
            <p class="text-amber-700 mt-1">
              Esta cotización es válida por 30 días desde la fecha de emisión ({{ currentDate }}).
              Los precios pueden variar según cambios en los requerimientos del proyecto.
              Esta es una estimación basada en la información proporcionada y puede ajustarse durante el análisis detallado.
            </p>
          </div>
        </div>
      </div>

      <!-- Información de la empresa -->
      <div v-if="configuration.company" class="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h4 class="font-semibold text-slate-800 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-1a1 1 0 011-1h4a1 1 0 011 1v1m-6 0v-3"></path>
          </svg>
          Información de Contacto
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="font-medium text-slate-900">{{ configuration.company.name }}</p>
            <p class="text-slate-600">{{ configuration.company.email }}</p>
            <p class="text-slate-600">{{ configuration.company.phone }}</p>
          </div>
          <div>
            <p class="text-slate-600">{{ configuration.company.website }}</p>
            <p class="text-slate-600">{{ configuration.company.address }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones -->
    <div class="bg-gray-50 px-8 py-6 border-t border-gray-200">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="flex space-x-3">
          <button
            @click="$emit('reset')"
            class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Nueva Cotización
          </button>
          <button
            @click="$emit('edit')"
            class="px-6 py-3 border border-indigo-300 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Editar Proyecto
          </button>
          <button
            @click="duplicateProject"
            class="px-6 py-3 border border-purple-300 text-purple-700 font-medium rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Duplicar
          </button>
        </div>

        <div class="flex space-x-3">
          <button
            @click="exportToPDF"
            class="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Exportar PDF
          </button>
          <button
            @click="shareQuotation"
            class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
            Compartir
          </button>
          <button
            @click="printQuotation"
            class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Imprimir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PROJECT_TYPES = {
  web: 'Aplicación Web',
  mobile: 'Aplicación Móvil',
  desktop: 'Software de Escritorio',
  ecommerce: 'Tienda en Línea',
  crm: 'Sistema CRM',
  erp: 'Sistema ERP',
  custom: 'Personalizado'
}

const FEATURE_DEFINITIONS = {
  auth: { name: 'Autenticación de usuarios', description: 'Sistema de registro, login y recuperación', hours: 40 },
  admin: { name: 'Panel de administración', description: 'Dashboard para gestión de contenidos', hours: 80 },
  api: { name: 'API REST', description: 'Interfaz para integración con sistemas externos', hours: 120 },
  responsive: { name: 'Diseño Responsivo', description: 'Adaptación para móviles y tablets', hours: 60 },
  seo: { name: 'Optimización SEO', description: 'Optimización para motores de búsqueda', hours: 40 },
  analytics: { name: 'Analytics & Reporting', description: 'Sistema de análisis y reportes', hours: 60 },
  offline: { name: 'Funcionalidad Offline', description: 'Capacidad de trabajar sin conexión', hours: 100 },
  notifications: { name: 'Notificaciones Push', description: 'Sistema de notificaciones', hours: 80 },
  camera: { name: 'Acceso a Cámara', description: 'Captura de imágenes y videos', hours: 60 },
  gps: { name: 'Geolocalización', description: 'Servicios de ubicación', hours: 40 },
  biometric: { name: 'Autenticación Biométrica', description: 'Login con huella o facial', hours: 80 },
  cart: { name: 'Carrito de compras', description: 'Sistema de carrito completo', hours: 80 },
  payments: { name: 'Pasarela de pagos', description: 'Integración con métodos de pago', hours: 120 },
  inventory: { name: 'Gestión de inventario', description: 'Control de stock y productos', hours: 100 },
  reviews: { name: 'Reseñas de productos', description: 'Sistema de calificaciones', hours: 60 },
  shipping: { name: 'Cálculo de envíos', description: 'Integración con empresas de envío', hours: 80 },
  contacts: { name: 'Gestión de contactos', description: 'Base de datos de clientes', hours: 120 },
  pipeline: { name: 'Pipeline de ventas', description: 'Seguimiento del proceso de ventas', hours: 160 },
  reports: { name: 'Reportes avanzados', description: 'Generación de reportes personalizables', hours: 140 },
  automation: { name: 'Automatización', description: 'Flujos de trabajo automatizados', hours: 200 },
  accounting: { name: 'Contabilidad', description: 'Módulo de contabilidad y finanzas', hours: 300 },
  hr: { name: 'Recursos Humanos', description: 'Gestión de empleados y nómina', hours: 250 },
  production: { name: 'Producción', description: 'Control de procesos productivos', hours: 400 },
  installer: { name: 'Instalador personalizado', description: 'Asistente de instalación', hours: 60 },
  database: { name: 'Base de datos local', description: 'Integración con bases de datos', hours: 80 },
  autoUpdate: { name: 'Actualizaciones automáticas', description: 'Sistema de actualización', hours: 100 },
  encryption: { name: 'Cifrado de datos', description: 'Protección de información sensible', hours: 120 },
  consulting: { name: 'Consultoría previa', description: 'Análisis y levantamiento de requerimientos', hours: 40 },
  support: { name: 'Soporte extendido', description: 'Soporte técnico post-desarrollo', hours: 20 },
  training: { name: 'Capacitación', description: 'Entrenamiento del equipo', hours: 30 },
  documentation: { name: 'Documentación técnica', description: 'Documentación completa del sistema', hours: 40 }
}

export default {
  name: 'ResumenCotizacionCompleto',
  props: {
    projectData: {
      type: Object,
      required: true
    },
    calculation: {
      type: Object,
      required: true
    },
    configuration: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['reset', 'edit', 'export-pdf', 'share', 'duplicate', 'print'],
  computed: {
    selectedFeaturesList() {
      if (!this.projectData.features || this.projectData.features.length === 0) return []

      return this.projectData.features.map(featureId => {
        // Buscar en las definiciones locales primero
        if (FEATURE_DEFINITIONS[featureId]) {
          return { id: featureId, ...FEATURE_DEFINITIONS[featureId] }
        }

        // Fallback para características no definidas
        return {
          id: featureId,
          name: this.formatFeatureName(featureId),
          description: 'Característica personalizada',
          hours: 40,
          complexity: 'medium'
        }
      })
    },
    estimatedStartDate() {
      const today = new Date()
      return today.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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
    currentDate() {
      const today = new Date()
      return today.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    budgetStatus() {
      if (!this.projectData.maxBudget) return null

      const total = this.calculation.total
      const budget = this.projectData.maxBudget
      const percentage = Math.min((total / budget) * 100, 100)

      if (percentage <= 80) {
        return {
          percentage,
          class: 'bg-green-500',
          textClass: 'text-green-600',
          message: `Dentro del presupuesto (${percentage.toFixed(1)}%)`
        }
      } else if (percentage <= 100) {
        return {
          percentage,
          class: 'bg-yellow-500',
          textClass: 'text-yellow-600',
          message: `Cerca del límite (${percentage.toFixed(1)}%)`
        }
      } else {
        return {
          percentage: 100,
          class: 'bg-red-500',
          textClass: 'text-red-600',
          message: `Excede el presupuesto (+${(percentage - 100).toFixed(1)}%)`
        }
      }
    }
  },
  methods: {
    formatProjectType(type) {
      return PROJECT_TYPES[type] || type
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
    formatComplexity(complexity) {
      const complexities = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        enterprise: 'Empresarial'
      }
      return complexities[complexity] || complexity
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
    formatResourceType(type) {
      const types = {
        'one-time': 'Único',
        'monthly': 'Mensual',
        'annual': 'Anual'
      }
      return types[type] || type
    },
    formatFeatureName(featureId) {
      // Convertir IDs como 'camelCase' a 'Camel Case'
      return featureId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
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
    getMultiplierColor(multiplier) {
      if (multiplier > 1) return 'text-red-600'
      if (multiplier < 1) return 'text-green-600'
      return 'text-gray-600'
    },
    getMultiplierText(multiplier) {
      if (multiplier > 1) return `+${Math.round((multiplier - 1) * 100)}%`
      if (multiplier < 1) return `${Math.round((1 - multiplier) * 100)}% desc.`
      return 'Base'
    },
    calculateFeatureCost(feature) {
      const averageRate = this.getAverageHourlyRate()
      return feature.hours * averageRate
    },
    getAverageHourlyRate() {
      const rates = this.configuration?.hourlyRates || { semi: 40, senior: 60 }
      const rateValues = Object.values(rates)
      return rateValues.reduce((sum, rate) => sum + rate, 0) / rateValues.length
    },
    getHourlyRate(level) {
      return this.configuration?.hourlyRates?.[level] || 50
    },
    exportToPDF() {
      this.$emit('export-pdf', {
        projectData: this.projectData,
        calculation: this.calculation
      })
    },
    shareQuotation() {
      this.$emit('share', {
        projectData: this.projectData,
        calculation: this.calculation
      })
    },
    duplicateProject() {
      this.$emit('duplicate', {
        projectData: { ...this.projectData, name: `${this.projectData.name} (Copia)` },
        calculation: this.calculation
      })
    },
    printQuotation() {
      this.$emit('print', {
        projectData: this.projectData,
        calculation: this.calculation
      })

      // También ejecutar print nativo del navegador
      setTimeout(() => {
        window.print()
      }, 100)
    }
  }
}
</script>

<style scoped>
@media print {
  .bg-gradient-to-r {
    background: #4f46e5 !important;
    -webkit-print-color-adjust: exact;
  }

  .shadow-lg,
  .shadow-md {
    box-shadow: none !important;
  }

  button {
    display: none !important;
  }

  .border-t:last-child {
    display: none !important;
  }
}
</style>
