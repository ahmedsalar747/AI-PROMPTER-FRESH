export const professionalRoles = {
  developer: {
    nameKey: 'roles.developer',
    icon: '💻',
    description: 'Software development, debugging, and system architecture',
    tasks: [
      { key: 'basicCoding', nameKey: 'tasks.basicCoding', fields: ['language', 'task'], difficulty: 'beginner' },
      { key: 'codeReview', nameKey: 'tasks.codeReview', fields: ['codeSnippet', 'language', 'concerns'], difficulty: 'intermediate' },
      { key: 'debugging', nameKey: 'tasks.debugging', fields: ['error', 'code', 'context'], difficulty: 'advanced' },
      { key: 'systemDesign', nameKey: 'tasks.systemDesign', fields: ['requirements', 'constraints'], difficulty: 'expert' },
      { key: 'apiDesign', nameKey: 'tasks.apiDesign', fields: ['functionality', 'requirements'], difficulty: 'advanced' },
      { key: 'optimization', nameKey: 'tasks.optimization', fields: ['code', 'performance'], difficulty: 'expert' }
    ]
  },
  dataAnalyst: {
    nameKey: 'roles.dataAnalyst',
    icon: '📊',
    description: 'Data analysis, visualization, and insights generation',
    tasks: [
      { key: 'dataAnalysis', nameKey: 'tasks.dataAnalysis', fields: ['dataset', 'goals'], difficulty: 'intermediate' },
      { key: 'reportCreation', nameKey: 'tasks.reportCreation', fields: ['data', 'audience'], difficulty: 'beginner' },
      { key: 'predictiveModeling', nameKey: 'tasks.predictiveModeling', fields: ['dataset', 'target'], difficulty: 'expert' },
      { key: 'dashboardDesign', nameKey: 'tasks.dashboardDesign', fields: ['metrics', 'audience'], difficulty: 'intermediate' }
    ]
  },
  marketingSpecialist: {
    nameKey: 'roles.marketingSpecialist',
    icon: '📢',
    description: 'Digital marketing, campaigns, and brand strategy',
    tasks: [
      { key: 'campaignStrategy', nameKey: 'tasks.campaignStrategy', fields: ['product', 'audience', 'budget'], difficulty: 'intermediate' },
      { key: 'contentCreation', nameKey: 'tasks.contentCreation', fields: ['topic', 'platform', 'tone'], difficulty: 'beginner' },
      { key: 'seoStrategy', nameKey: 'tasks.seoStrategy', fields: ['website', 'keywords'], difficulty: 'intermediate' },
      { key: 'socialMediaPlan', nameKey: 'tasks.socialMediaPlan', fields: ['brand', 'platforms'], difficulty: 'beginner' }
    ]
  },
  contentWriter: {
    nameKey: 'roles.contentWriter',
    icon: '✍️',
    description: 'Creative and technical writing, copywriting',
    tasks: [
      { key: 'articleWriting', nameKey: 'tasks.articleWriting', fields: ['topic', 'wordCount', 'audience'], difficulty: 'beginner' },
      { key: 'seoContent', nameKey: 'tasks.seoContent', fields: ['keywords', 'topic', 'length'], difficulty: 'intermediate' },
      { key: 'copywriting', nameKey: 'tasks.copywriting', fields: ['product', 'audience'], difficulty: 'intermediate' },
      { key: 'technicalWriting', nameKey: 'tasks.technicalWriting', fields: ['topic', 'audience'], difficulty: 'advanced' }
    ]
  },
  businessConsultant: {
    nameKey: 'roles.businessConsultant',
    icon: '💼',
    description: 'Business strategy, consulting, and analysis',
    tasks: [
      { key: 'businessBasics', nameKey: 'tasks.businessBasics', fields: ['topic', 'audience'], difficulty: 'beginner' },
      { key: 'strategicPlanning', nameKey: 'tasks.strategicPlanning', fields: ['business', 'goals', 'timeline'], difficulty: 'expert' },
      { key: 'marketAnalysis', nameKey: 'tasks.marketAnalysis', fields: ['market', 'competitors'], difficulty: 'advanced' },
      { key: 'businessModel', nameKey: 'tasks.businessModel', fields: ['idea', 'market'], difficulty: 'expert' },
      { key: 'processOptimization', nameKey: 'tasks.processOptimization', fields: ['process', 'issues'], difficulty: 'advanced' }
    ]
  },
  teacher: {
    nameKey: 'roles.teacher',
    icon: '🎓',
    description: 'Education, curriculum design, and assessment',
    tasks: [
      { key: 'lessonPlanning', nameKey: 'tasks.lessonPlanning', fields: ['subject', 'grade', 'objectives'], difficulty: 'beginner' },
      { key: 'assessmentDesign', nameKey: 'tasks.assessmentDesign', fields: ['subject', 'assessmentType'], difficulty: 'intermediate' },
      { key: 'curriculumDevelopment', nameKey: 'tasks.curriculumDevelopment', fields: ['subject', 'duration'], difficulty: 'advanced' },
      { key: 'studentEngagement', nameKey: 'tasks.studentEngagement', fields: ['subject', 'age'], difficulty: 'intermediate' }
    ]
  },
  designer: {
    nameKey: 'roles.designer',
    icon: '🎨',
    description: 'UI/UX design, branding, and visual communication',
    tasks: [
      { key: 'designBasics', nameKey: 'tasks.designBasics', fields: ['project', 'style'], difficulty: 'beginner' },
      { key: 'uiDesign', nameKey: 'tasks.uiDesign', fields: ['project', 'requirements', 'style'], difficulty: 'intermediate' },
      { key: 'brandDesign', nameKey: 'tasks.brandDesign', fields: ['company', 'values', 'audience'], difficulty: 'advanced' },
      { key: 'userResearch', nameKey: 'tasks.userResearch', fields: ['product', 'users'], difficulty: 'intermediate' },
      { key: 'prototyping', nameKey: 'tasks.prototyping', fields: ['concept', 'features'], difficulty: 'advanced' }
    ]
  },
  projectManager: {
    nameKey: 'roles.projectManager',
    icon: '📋',
    description: 'Project planning, team management, and delivery',
    tasks: [
      { key: 'basicPlanning', nameKey: 'tasks.basicPlanning', fields: ['project', 'goals'], difficulty: 'beginner' },
      { key: 'projectPlanning', nameKey: 'tasks.projectPlanning', fields: ['project', 'timeline', 'resources'], difficulty: 'intermediate' },
      { key: 'riskAssessment', nameKey: 'tasks.riskAssessment', fields: ['project', 'risks'], difficulty: 'advanced' },
      { key: 'teamManagement', nameKey: 'tasks.teamManagement', fields: ['team', 'goals'], difficulty: 'advanced' },
      { key: 'stakeholderComm', nameKey: 'tasks.stakeholderComm', fields: ['stakeholders', 'updates'], difficulty: 'intermediate' }
    ]
  }
}; 