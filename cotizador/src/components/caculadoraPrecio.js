// Precios base por tipo de proyecto (en horas)
const BASE_HOURS = {
  web: 400,
  mobile: 600,
  desktop: 500,
  ecommerce: 800,
  crm: 1000,
  erp: 1500,
  custom: 0
}

// Multiplicadores por complejidad
const COMPLEXITY_MULTIPLIERS = {
  low: 0.8,
  medium: 1.0,
  high: 1.3,
  enterprise: 1.6
}

// Horas adicionales por característica según tipo de proyecto
const FEATURE_HOURS = {
  web: {
    auth: 40,
    admin: 80,
    api: 120,
    responsive: 60,
    seo: 40,
    analytics: 60,
    cache: 30,
    security: 50
  },
  mobile: {
    auth: 60,
    offline: 100,
    notifications: 80,
    camera: 60,
    gps: 40,
    biometric: 80,
    social: 50,
    payments: 100
  },
  desktop: {
    installer: 60,
    database: 80,
    autoUpdate: 100,
    encryption: 120,
    plugins: 90,
    backup: 70
  },
  ecommerce: {
    cart: 80,
    payments: 120,
    inventory: 100,
    reviews: 60,
    shipping: 80,
    analytics: 100,
    seo: 60,
    admin: 120
  },
  crm: {
    contacts: 120,
    pipeline: 160,
    reports: 140,
    automation: 200,
    integration: 180,
    mobile: 100,
    analytics: 120
  },
  erp: {
    accounting: 300,
    inventory: 200,
    hr: 250,
    production: 400,
    reporting: 180,
    integration: 300,
    mobile: 150
  },
  custom: {
    consulting: 40,
    support: 20,
    training: 30,
    documentation: 40,
    testing: 80,
    deployment: 30
  }
}

// Configuración por defecto
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
  }
}

export default {
  /**
   * Cálculo básico (versión anterior compatible)
   */
  calculate(projectData) {
    const basePrice = this.getBasePrice(projectData.type)
    let total = basePrice

    // Sumar características
    if (projectData.features && projectData.features.length > 0) {
      projectData.features.forEach(featureId => {
        total += this.getFeaturePrice(featureId)
      })
    }

    // Ajustar por tiempo
    const weeks = parseInt(projectData.timeline) || 4
    if (weeks < 4) {
      const multiplier = 1 + (4 - weeks) * 0.2
      total *= multiplier
    }

    return Math.round(total)
  },

  /**
   * Cálculo avanzado con configuración personalizable
   */
  calculateAdvanced(projectData, configuration = DEFAULT_CONFIG) {
    try {
      // Validar datos de entrada
      if (!projectData || !projectData.type) {
        throw new Error('Datos del proyecto inválidos')
      }

      const config = { ...DEFAULT_CONFIG, ...configuration }

      // 1. Calcular horas base del proyecto
      let totalHours = BASE_HOURS[projectData.type] || 0

      // 2. Agregar horas por características
      if (projectData.features && projectData.features.length > 0) {
        const featureHours = FEATURE_HOURS[projectData.type] || {}
        projectData.features.forEach(featureId => {
          totalHours += featureHours[featureId] || 0
        })
      }

      // 3. Aplicar multiplicador de complejidad
      const complexityMultiplier = COMPLEXITY_MULTIPLIERS[projectData.complexity] || 1
      totalHours *= complexityMultiplier

      // 4. Ajustar por timeline
      const timelineMultiplier = this.calculateTimelineMultiplier(projectData.timeline, totalHours)
      totalHours *= timelineMultiplier

      // 5. Calcular costos del equipo
      const teamCost = this.calculateTeamCost(config.teamRoles, config.hourlyRates, totalHours)

      // 6. Calcular costos de recursos
      const resourceCost = this.calculateResourceCost(config.resources, projectData.timeline)

      // 7. Calcular subtotal
      const subtotal = teamCost + resourceCost

      // 8. Aplicar multiplicador de prioridad
      const priorityMultiplier = config.multipliers[projectData.priority] || 1
      const total = subtotal * priorityMultiplier

      // 9. Crear breakdown detallado
      const breakdown = this.createBreakdown(
        config.teamRoles,
        config.hourlyRates,
        config.resources,
        projectData.timeline,
        totalHours
      )

      return {
        totalHours: Math.round(totalHours),
        teamCost: Math.round(teamCost),
        resourceCost: Math.round(resourceCost),
        subtotal: Math.round(subtotal),
        priorityMultiplier,
        complexityMultiplier,
        timelineMultiplier,
        total: Math.round(total),
        breakdown,
        projectData: { ...projectData },
        configuration: config
      }
    } catch (error) {
      console.error('Error en cálculo avanzado:', error)
      // Fallback al cálculo básico
      return {
        total: this.calculate(projectData),
        error: error.message
      }
    }
  },

  /**
   * Calcular multiplicador basado en timeline vs horas estimadas
   */
  calculateTimelineMultiplier(timelineWeeks, estimatedHours) {
    const normalWeeksForProject = Math.ceil(estimatedHours / 40) // 40 horas por semana
    const ratio = timelineWeeks / normalWeeksForProject

    if (ratio < 0.5) return 2.0  // Muy urgente
    if (ratio < 0.7) return 1.5  // Urgente
    if (ratio < 1.0) return 1.2  // Algo urgente
    if (ratio > 2.0) return 0.8  // Timeline muy relajado
    return 1.0 // Timeline normal
  },

  /**
   * Calcular costo total del equipo
   */
  calculateTeamCost(teamRoles, hourlyRates, totalProjectHours) {
    let totalCost = 0

    teamRoles.forEach(role => {
      const hourlyRate = hourlyRates[role.level] || 0
      // Ajustar horas del rol basado en el total del proyecto
      const adjustedHours = Math.round(role.hours * (totalProjectHours / 800)) // 800 horas como base
      totalCost += adjustedHours * hourlyRate
    })

    return totalCost
  },

  /**
   * Calcular costo total de recursos
   */
  calculateResourceCost(resources, timelineWeeks) {
    let totalCost = 0

    resources.forEach(resource => {
      switch (resource.type) {
        case 'one-time': {
          totalCost += resource.cost
          break
        }
        case 'monthly': {
          const months = Math.ceil(timelineWeeks / 4.33) // Semanas a meses
          totalCost += resource.cost * months
          break
        }
        case 'annual': {
          const years = Math.ceil(timelineWeeks / 52)
          totalCost += resource.cost * years
          break
        }
        default: {
          totalCost += resource.cost
          break
        }
      }
    })

    return totalCost
  },

  /**
   * Crear breakdown detallado de costos
   */
  createBreakdown(teamRoles, hourlyRates, resources, timelineWeeks, totalProjectHours) {
    // Breakdown del equipo
    const teamBreakdown = teamRoles.map(role => {
      const hourlyRate = hourlyRates[role.level] || 0
      const adjustedHours = Math.round(role.hours * (totalProjectHours / 800))
      return {
        ...role,
        adjustedHours,
        hourlyRate,
        totalCost: adjustedHours * hourlyRate
      }
    })

    // Breakdown de recursos
    const resourceBreakdown = resources.map(resource => {
      let totalCost = resource.cost
      let units = 1

      switch (resource.type) {
        case 'monthly': {
          units = Math.ceil(timelineWeeks / 4.33)
          totalCost = resource.cost * units
          break
        }
        case 'annual': {
          units = Math.ceil(timelineWeeks / 52)
          totalCost = resource.cost * units
          break
        }
        default: {
          // one-time o cualquier otro tipo
          totalCost = resource.cost
          units = 1
          break
        }
      }

      return {
        ...resource,
        units,
        unitCost: resource.cost,
        totalCost
      }
    })

    return {
      team: teamBreakdown,
      resources: resourceBreakdown
    }
  },

  /**
   * Obtener precio base por tipo de proyecto (método legacy)
   */
  getBasePrice(projectType) {
    const basePrices = {
      web: 5000,
      mobile: 7000,
      desktop: 6000,
      ecommerce: 10000,
      crm: 15000,
      erp: 25000,
      custom: 8000
    }
    return basePrices[projectType] || 0
  },

  /**
   * Obtener precio de característica (método legacy)
   */
  getFeaturePrice(featureId) {
    const featurePrices = {
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
      reviews: 1800,
      seo: 1200,
      analytics: 2000,
      installer: 2500,
      database: 1800,
      autoUpdate: 3200,
      consulting: 1500,
      support: 2000
    }
    return featurePrices[featureId] || 0
  },

  /**
   * Generar reporte PDF (preparación de datos)
   */
  generateReportData(calculation) {
    const reportData = {
      project: calculation.projectData,
      summary: {
        totalHours: calculation.totalHours,
        totalCost: calculation.total,
        timeline: calculation.projectData.timeline,
        priority: calculation.projectData.priority,
        complexity: calculation.projectData.complexity
      },
      teamCosts: calculation.breakdown.team,
      resourceCosts: calculation.breakdown.resources,
      multipliers: {
        complexity: calculation.complexityMultiplier,
        timeline: calculation.timelineMultiplier,
        priority: calculation.priorityMultiplier
      },
      totals: {
        teamCost: calculation.teamCost,
        resourceCost: calculation.resourceCost,
        subtotal: calculation.subtotal,
        finalTotal: calculation.total
      },
      generatedAt: new Date().toISOString(),
      company: calculation.configuration.company || {}
    }

    return reportData
  },

  /**
   * Validar configuración
   */
  validateConfiguration(config) {
    const errors = []

    if (!config.hourlyRates || Object.keys(config.hourlyRates).length === 0) {
      errors.push('Las tarifas por hora son requeridas')
    }

    if (!config.teamRoles || config.teamRoles.length === 0) {
      errors.push('Al menos un rol del equipo es requerido')
    }

    if (!config.multipliers || Object.keys(config.multipliers).length === 0) {
      errors.push('Los multiplicadores de prioridad son requeridos')
    }

    // Validar que las tarifas sean números positivos
    if (config.hourlyRates) {
      Object.entries(config.hourlyRates).forEach(([level, rate]) => {
        if (typeof rate !== 'number' || rate <= 0) {
          errors.push(`Tarifa inválida para nivel ${level}: ${rate}`)
        }
      })
    }

    // Validar roles del equipo
    if (config.teamRoles) {
      config.teamRoles.forEach((role, index) => {
        if (!role.name || !role.level || typeof role.hours !== 'number') {
          errors.push(`Rol inválido en posición ${index + 1}`)
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  /**
   * Comparar cotizaciones
   */
  compareQuotations(quotation1, quotation2) {
    return {
      costDifference: quotation2.total - quotation1.total,
      costDifferencePercent: ((quotation2.total - quotation1.total) / quotation1.total) * 100,
      hoursDifference: quotation2.totalHours - quotation1.totalHours,
      timelineDifference: quotation2.projectData.timeline - quotation1.projectData.timeline,
      recommendations: this.generateRecommendations(quotation1, quotation2)
    }
  },

  /**
   * Generar recomendaciones basadas en comparación
   */
  generateRecommendations(quotation1, quotation2) {
    const recommendations = []

    if (quotation2.total > quotation1.total * 1.2) {
      recommendations.push('Considere reducir el alcance del proyecto para ajustarse al presupuesto')
    }

    if (quotation2.totalHours > quotation1.totalHours * 1.5) {
      recommendations.push('El proyecto podría beneficiarse de una planificación más detallada')
    }

    if (quotation2.projectData.timeline < quotation1.projectData.timeline) {
      recommendations.push('Timeline acelerado puede requerir recursos adicionales')
    }

    return recommendations
  },

  /**
   * Obtener estadísticas del proyecto
   */
  getProjectStatistics(calculation) {
    const stats = {
      averageHourlyRate: calculation.teamCost / calculation.totalHours,
      costPerWeek: calculation.total / calculation.projectData.timeline,
      teamUtilization: this.calculateTeamUtilization(calculation.breakdown.team),
      resourceToTeamRatio: calculation.resourceCost / calculation.teamCost,
      complexityImpact: (calculation.complexityMultiplier - 1) * 100,
      priorityImpact: (calculation.priorityMultiplier - 1) * 100,
      timelineImpact: (calculation.timelineMultiplier - 1) * 100
    }

    return stats
  },

  /**
   * Calcular utilización del equipo
   */
  calculateTeamUtilization(teamBreakdown) {
    const totalTeamHours = teamBreakdown.reduce((sum, role) => sum + role.adjustedHours, 0)
    const teamMembers = teamBreakdown.length
    const averageHoursPerMember = totalTeamHours / teamMembers

    return {
      totalHours: totalTeamHours,
      averageHoursPerMember: Math.round(averageHoursPerMember),
      utilizationPercent: Math.round((averageHoursPerMember / 160) * 100) // Asumiendo 160 horas por mes por persona
    }
  },

  /**
   * Exportar configuración
   */
  exportConfiguration(config) {
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      configuration: config
    }
  },

  /**
   * Importar configuración
   */
  importConfiguration(exportedData) {
    try {
      if (!exportedData.configuration) {
        throw new Error('Formato de configuración inválido')
      }

      const validation = this.validateConfiguration(exportedData.configuration)
      if (!validation.isValid) {
        throw new Error(`Configuración inválida: ${validation.errors.join(', ')}`)
      }

      return {
        success: true,
        configuration: exportedData.configuration
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}
