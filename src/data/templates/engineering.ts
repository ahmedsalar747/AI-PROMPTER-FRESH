import { Template, TemplateCategory } from './index';

const systemDesignTemplates: Template[] = [
  {
    id: 'eng-system-architecture-design',
    title: 'System Architecture Design',
    description: 'Comprehensive system architecture and engineering design framework',
    content: `You are a Systems Architect. Design system architecture for [System Type/Application].

System Architecture Framework:

1. **Requirements Analysis:**
   - Functional requirements definition
   - Non-functional requirements (performance, scalability, security)
   - System constraints and limitations
   - Stakeholder requirements gathering
   - Use case and user story development

2. **Architecture Design:**
   - High-level system architecture
   - Component and module breakdown
   - Interface design and specifications
   - Data flow and system interactions
   - Technology stack selection

3. **Design Patterns & Principles:**
   - Architectural patterns application
   - Design principle implementation
   - Scalability and maintainability considerations
   - Security architecture integration
   - Performance optimization strategies

4. **Implementation Planning:**
   - Development roadmap and phases
   - Resource allocation and team structure
   - Risk assessment and mitigation
   - Quality assurance planning
   - Deployment and operations strategy

System Details:
- Type: [Web Application/Mobile App/Enterprise System/IoT]
- Scale: [Small/Medium/Large/Enterprise]
- Users: [Expected User Load]
- Technology: [Platform/Framework Preferences]
- Timeline: [Development Timeline]`,
    category: 'engineering',
    subcategory: 'system-design',
    difficulty: 'expert',
    domain: 'engineering',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['system architecture', 'engineering design', 'technical architecture', 'system planning'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Design comprehensive system architectures for complex engineering projects',
    exampleInput: 'Type: E-commerce platform, Scale: Large, Users: 1M+, Technology: Cloud-native',
    exampleOutput: 'Complete system architecture with components, interfaces, and implementation plan'
  },
  {
    id: 'eng-database-design-optimization',
    title: 'Database Design & Optimization',
    description: 'Database schema design and performance optimization',
    content: `You are a Database Architect. Design database schema for [Application/System] with [Performance Requirements].

Database Design Framework:

1. **Requirements Analysis:**
   - Data requirements gathering
   - Transaction analysis
   - Performance requirements
   - Scalability considerations
   - Security requirements

2. **Schema Design:**
   - Entity relationship modeling
   - Normalization and denormalization
   - Index strategy design
   - Constraint definition
   - Data type optimization

3. **Performance Optimization:**
   - Query optimization strategies
   - Indexing best practices
   - Partitioning strategies
   - Caching mechanisms
   - Connection pooling

4. **Implementation Strategy:**
   - Migration planning
   - Testing procedures
   - Monitoring setup
   - Backup and recovery
   - Maintenance procedures

Database Requirements:
- Type: [Relational/NoSQL/Graph/Time-series]
- Scale: [Data volume and transaction rate]
- Performance: [Response time requirements]
- Availability: [Uptime requirements]
- Consistency: [ACID/BASE requirements]`,
    category: 'engineering',
    subcategory: 'system-design',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'expert',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['database design', 'schema optimization', 'performance tuning', 'data architecture'],
    estimatedOutputLength: 'Long (2000-2800 words)',
    useCase: 'Design efficient and scalable database solutions',
    exampleInput: 'Application: Analytics platform, Type: Time-series, Scale: 1TB/day, Performance: <100ms',
    exampleOutput: 'Optimized database design with schema, indexes, and performance strategies'
  },
  {
    id: 'api-design-specification',
    title: 'API Design & Specification',
    description: 'RESTful API design and documentation framework',
    content: `You are an API Architect. Design API specification for [Service/Application] following [API Standards].

API Design Framework:

1. **API Strategy:**
   - API goals and objectives
   - Consumer analysis
   - Use case definition
   - Service boundaries
   - Integration patterns

2. **Design Principles:**
   - RESTful design principles
   - Resource modeling
   - URI design patterns
   - HTTP method usage
   - Status code standards

3. **Specification Details:**
   - Endpoint definitions
   - Request/response schemas
   - Authentication mechanisms
   - Rate limiting strategies
   - Error handling patterns

4. **Documentation & Testing:**
   - OpenAPI specification
   - Example requests/responses
   - Testing strategies
   - Version management
   - Developer experience

API Requirements:
- Type: [REST/GraphQL/gRPC/WebSocket]
- Audience: [Internal/Partner/Public]
- Scale: [Expected usage volume]
- Security: [Authentication/Authorization needs]
- Integration: [System integration requirements]`,
    category: 'engineering',
    subcategory: 'system-design',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['API design', 'REST API', 'system integration', 'technical specification'],
    estimatedOutputLength: 'Long (1800-2500 words)',
    useCase: 'Design robust and scalable API solutions for system integration',
    exampleInput: 'Service: Payment processing, Type: REST, Audience: Partner integration, Security: OAuth2',
    exampleOutput: 'Complete API specification with endpoints, schemas, and integration guidelines'
  },
  {
    id: 'eng-microservices-architecture',
    title: 'Microservices Architecture Design',
    description: 'Design scalable microservices architecture patterns',
    content: `You are a Microservices Architect. Design microservices architecture for [Application/Platform] with [Scalability Requirements].

Microservices Framework:

1. **Service Decomposition:**
   - Domain-driven design principles
   - Service boundary identification
   - Data ownership patterns
   - Communication patterns
   - Service sizing guidelines

2. **Architecture Patterns:**
   - Service mesh implementation
   - API gateway design
   - Event-driven architecture
   - CQRS and event sourcing
   - Circuit breaker patterns

3. **Infrastructure Design:**
   - Container orchestration
   - Service discovery
   - Load balancing strategies
   - Monitoring and observability
   - Security implementation

4. **Deployment Strategy:**
   - CI/CD pipeline design
   - Blue-green deployment
   - Canary releases
   - Rollback strategies
   - Environment management

Architecture Requirements:
- Application Type: [E-commerce/SaaS/IoT/Enterprise]
- Scale: [Service count and traffic volume]
- Technology: [Programming languages/frameworks]
- Infrastructure: [Cloud provider/on-premise]
- Team Structure: [Development team organization]`,
    category: 'engineering',
    subcategory: 'system-design',
    difficulty: 'expert',
    domain: 'engineering',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['microservices', 'distributed systems', 'scalable architecture', 'cloud architecture'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Design scalable microservices architectures for complex applications',
    exampleInput: 'Application: E-commerce platform, Scale: 10M users, Technology: Node.js/Kubernetes, Infrastructure: AWS',
    exampleOutput: 'Complete microservices architecture with service design, infrastructure, and deployment strategy'
  },
  {
    id: 'security-architecture-design',
    title: 'Security Architecture Design',
    description: 'Comprehensive security architecture and threat modeling',
    content: `You are a Security Architect. Design security architecture for [System/Application] addressing [Security Requirements].

Security Architecture Framework:

1. **Threat Modeling:**
   - Asset identification
   - Threat analysis
   - Vulnerability assessment
   - Risk evaluation
   - Attack vector analysis

2. **Security Controls:**
   - Authentication mechanisms
   - Authorization frameworks
   - Encryption strategies
   - Network security
   - Data protection

3. **Architecture Integration:**
   - Security by design principles
   - Zero trust architecture
   - Defense in depth
   - Least privilege access
   - Secure communication

4. **Compliance & Governance:**
   - Regulatory compliance
   - Security policies
   - Audit requirements
   - Incident response
   - Security monitoring

Security Context:
- System Type: [Web app/Mobile/Enterprise/Cloud]
- Compliance: [GDPR/HIPAA/SOC2/PCI-DSS]
- Threat Level: [Low/Medium/High/Critical]
- Data Sensitivity: [Public/Internal/Confidential/Restricted]
- User Base: [Internal/External/Partner/Public]`,
    category: 'engineering',
    subcategory: 'system-design',
    difficulty: 'expert',
    domain: 'engineering',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['security architecture', 'threat modeling', 'cybersecurity', 'risk assessment'],
    estimatedOutputLength: 'Very Long (2400+ words)',
    useCase: 'Design comprehensive security architectures for critical systems',
    exampleInput: 'System: Healthcare platform, Compliance: HIPAA, Threat: High, Data: Patient records, Users: Healthcare workers',
    exampleOutput: 'Complete security architecture with threat model, controls, and compliance framework'
  }
];

const projectManagementTemplates: Template[] = [
  {
    id: 'engineering-project-plan',
    title: 'Engineering Project Management Plan',
    description: 'Comprehensive project management framework for engineering initiatives',
    content: `You are an Engineering Project Manager. Develop project plan for [Engineering Project].

Project Management Framework:

1. **Project Initiation:**
   - Project charter and scope definition
   - Stakeholder identification and analysis
   - Success criteria and objectives
   - Initial risk assessment
   - Resource requirements estimation

2. **Planning & Scheduling:**
   - Work breakdown structure (WBS)
   - Timeline and milestone planning
   - Resource allocation and team assignments
   - Dependencies and critical path analysis
   - Budget planning and cost estimation

3. **Risk Management:**
   - Risk identification and assessment
   - Risk mitigation strategies
   - Contingency planning
   - Risk monitoring procedures
   - Change management process

4. **Execution & Control:**
   - Progress tracking and reporting
   - Quality assurance procedures
   - Communication plan
   - Issue resolution processes
   - Performance monitoring

Project Parameters:
- Type: [Software Development/Infrastructure/R&D/Manufacturing]
- Duration: [Project Timeline]
- Team Size: [Number of Team Members]
- Budget: [Project Budget Range]
- Complexity: [Low/Medium/High/Critical]`,
    category: 'engineering',
    subcategory: 'project-management',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['project management', 'engineering planning', 'project execution', 'team coordination'],
    estimatedOutputLength: 'Long (2200+ words)',
    useCase: 'Manage complex engineering projects from initiation to completion',
    exampleInput: 'Type: Software development, Duration: 12 months, Team: 15 engineers, Budget: $2M',
    exampleOutput: 'Complete project plan with scheduling, risk management, and execution strategy'
  },
  {
    id: 'agile-development-framework',
    title: 'Agile Development Implementation',
    description: 'Implement agile methodologies for engineering teams',
    content: `You are an Agile Coach. Implement agile framework for [Engineering Team/Project] using [Methodology].

Agile Implementation Framework:

1. **Methodology Selection:**
   - Framework comparison (Scrum/Kanban/SAFe)
   - Team assessment and readiness
   - Organizational constraints
   - Success criteria definition
   - Implementation roadmap

2. **Team Setup:**
   - Role definition and assignments
   - Team formation and dynamics
   - Communication protocols
   - Tool selection and setup
   - Training and coaching plan

3. **Process Implementation:**
   - Sprint planning procedures
   - Daily standup structure
   - Review and retrospective format
   - Backlog management
   - Definition of Done

4. **Continuous Improvement:**
   - Metrics and measurement
   - Feedback collection
   - Process optimization
   - Team performance tracking
   - Scaling considerations

Implementation Context:
- Methodology: [Scrum/Kanban/XP/SAFe/Custom]
- Team Size: [Number of team members]
- Project Type: [Product development/Maintenance/Innovation]
- Organization: [Startup/Enterprise/Agency]
- Timeline: [Implementation duration]`,
    category: 'engineering',
    subcategory: 'project-management',
    difficulty: 'intermediate',
    domain: 'engineering',
    skillLevel: {
      technical: 'medium',
      complexity: 'moderate',
      timeRequired: 'long'
    },
    tags: ['agile methodology', 'scrum', 'team management', 'process improvement'],
    estimatedOutputLength: 'Long (1800-2500 words)',
    useCase: 'Implement effective agile processes for engineering teams',
    exampleInput: 'Methodology: Scrum, Team: 8 developers, Type: Product development, Organization: Startup, Timeline: 3 months',
    exampleOutput: 'Complete agile implementation plan with processes, roles, and improvement strategies'
  },
  {
    id: 'technical-roadmap-planning',
    title: 'Technical Roadmap & Strategy Planning',
    description: 'Create strategic technical roadmaps for engineering initiatives',
    content: `You are a Technical Program Manager. Develop technical roadmap for [Product/Platform] over [Timeline].

Technical Roadmap Framework:

1. **Strategic Assessment:**
   - Current state analysis
   - Technical debt evaluation
   - Market and technology trends
   - Competitive landscape
   - Business objectives alignment

2. **Vision & Goals:**
   - Technical vision definition
   - Strategic objectives
   - Success metrics
   - Milestone identification
   - Investment priorities

3. **Roadmap Development:**
   - Initiative prioritization
   - Timeline and sequencing
   - Resource requirements
   - Dependency mapping
   - Risk assessment

4. **Execution Planning:**
   - Team allocation
   - Budget planning
   - Communication strategy
   - Progress tracking
   - Adjustment mechanisms

Roadmap Context:
- Product/Platform: [Description]
- Timeline: [6 months/1 year/2-3 years/Long-term]
- Scope: [Feature development/Platform/Infrastructure]
- Team Size: [Engineering team size]
- Budget: [Investment level]`,
    category: 'engineering',
    subcategory: 'project-management',
    difficulty: 'expert',
    domain: 'engineering',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['technical roadmap', 'strategic planning', 'technology strategy', 'engineering leadership'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Develop strategic technical roadmaps for product and platform development',
    exampleInput: 'Product: SaaS platform, Timeline: 2 years, Scope: Platform modernization, Team: 50 engineers, Budget: $10M',
    exampleOutput: 'Comprehensive technical roadmap with strategic initiatives, timeline, and execution plan'
  },
  {
    id: 'release-management-strategy',
    title: 'Release Management & Deployment Strategy',
    description: 'Comprehensive release management and deployment planning',
    content: `You are a Release Manager. Develop release strategy for [Product/System] with [Deployment Requirements].

Release Management Framework:

1. **Release Planning:**
   - Release strategy definition
   - Version control and branching
   - Feature flagging approach
   - Testing strategy
   - Rollback procedures

2. **Deployment Pipeline:**
   - CI/CD pipeline design
   - Environment management
   - Automated testing integration
   - Security scanning
   - Performance monitoring

3. **Release Coordination:**
   - Stakeholder communication
   - Go/no-go criteria
   - Risk assessment
   - Change management
   - Documentation requirements

4. **Post-Release Activities:**
   - Monitoring and alerting
   - Performance analysis
   - Incident response
   - Feedback collection
   - Continuous improvement

Release Context:
- Product Type: [Web app/Mobile/Desktop/API/Infrastructure]
- Frequency: [Daily/Weekly/Monthly/Quarterly]
- Complexity: [Simple/Medium/Complex/Mission-critical]
- Team Size: [Development and operations team]
- Environment: [Cloud/On-premise/Hybrid]`,
    category: 'engineering',
    subcategory: 'project-management',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['release management', 'deployment strategy', 'CI/CD', 'DevOps'],
    estimatedOutputLength: 'Long (2000-2800 words)',
    useCase: 'Implement effective release management processes for software delivery',
    exampleInput: 'Product: Mobile application, Frequency: Bi-weekly, Complexity: Medium, Team: 12 people, Environment: Cloud',
    exampleOutput: 'Complete release management strategy with pipeline, processes, and monitoring'
  },
  {
    id: 'capacity-planning-framework',
    title: 'Engineering Capacity Planning',
    description: 'Team capacity planning and resource optimization',
    content: `You are a Engineering Manager. Develop capacity planning for [Engineering Team/Department] for [Planning Period].

Capacity Planning Framework:

1. **Current State Analysis:**
   - Team composition and skills
   - Current workload assessment
   - Productivity metrics
   - Bottleneck identification
   - Resource utilization

2. **Demand Forecasting:**
   - Project pipeline analysis
   - Feature backlog sizing
   - Maintenance requirements
   - Technical debt allocation
   - Innovation time planning

3. **Capacity Modeling:**
   - Team velocity calculation
   - Skills gap analysis
   - Training needs assessment
   - Hiring requirements
   - Contractor needs

4. **Optimization Strategy:**
   - Resource allocation optimization
   - Cross-training programs
   - Process improvement
   - Tool and automation
   - Performance improvement

Planning Parameters:
- Team Size: [Current team composition]
- Planning Period: [Quarter/Half-year/Annual]
- Growth Goals: [Team expansion plans]
- Project Load: [Expected project volume]
- Skills Focus: [Technology areas and expertise]`,
    category: 'engineering',
    subcategory: 'project-management',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['capacity planning', 'resource management', 'team optimization', 'engineering management'],
    estimatedOutputLength: 'Long (1800-2500 words)',
    useCase: 'Optimize engineering team capacity and resource allocation',
    exampleInput: 'Team: 25 engineers, Period: Annual, Growth: 40%, Load: High, Skills: Cloud and AI',
    exampleOutput: 'Comprehensive capacity plan with resource allocation, hiring strategy, and optimization recommendations'
  }
];

const technicalDocumentationTemplates: Template[] = [
  {
    id: 'technical-specification-document',
    title: 'Technical Specification Document',
    description: 'Comprehensive technical specification and design documentation',
    content: `You are a Technical Writer. Create technical specification for [System/Feature/Component].

Technical Specification Framework:

1. **Overview & Context:**
   - System/feature overview
   - Business requirements
   - Technical objectives
   - Scope and boundaries
   - Assumptions and constraints

2. **System Design:**
   - Architecture overview
   - Component specifications
   - Interface definitions
   - Data models and schemas
   - Technology stack details

3. **Implementation Details:**
   - Algorithm specifications
   - Configuration requirements
   - Performance considerations
   - Security implementations
   - Error handling strategies

4. **Testing & Validation:**
   - Testing strategies
   - Acceptance criteria
   - Performance benchmarks
   - Security validation
   - Integration testing

Specification Context:
- Subject: [System/Feature/API/Component]
- Audience: [Developers/Architects/QA/Stakeholders]
- Complexity: [Simple/Medium/Complex/Critical]
- Technology: [Programming languages/frameworks]
- Timeline: [Development timeline]`,
    category: 'engineering',
    subcategory: 'technical-documentation',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['technical specification', 'system documentation', 'design document', 'engineering documentation'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Create detailed technical specifications for development teams',
    exampleInput: 'Subject: Payment processing API, Audience: Backend developers, Complexity: Complex, Technology: Node.js/PostgreSQL',
    exampleOutput: 'Comprehensive technical specification with architecture, implementation details, and testing strategy'
  },
  {
    id: 'api-documentation-framework',
    title: 'API Documentation & Developer Guide',
    description: 'Complete API documentation and developer experience',
    content: `You are an API Documentation Specialist. Create comprehensive API documentation for [API/Service].

API Documentation Framework:

1. **Getting Started:**
   - API overview and purpose
   - Authentication setup
   - Quick start guide
   - SDK and library information
   - Environment setup

2. **API Reference:**
   - Endpoint documentation
   - Request/response examples
   - Parameter descriptions
   - Error code definitions
   - Rate limiting details

3. **Integration Guides:**
   - Common use cases
   - Code examples and snippets
   - Best practices
   - Troubleshooting guide
   - Testing procedures

4. **Developer Resources:**
   - Interactive API explorer
   - Postman collections
   - Sample applications
   - Change log and versioning
   - Support and community

Documentation Scope:
- API Type: [REST/GraphQL/gRPC/WebSocket]
- Complexity: [Simple/Medium/Complex/Enterprise]
- Audience: [Internal/Partner/Public developers]
- Technology: [Programming languages supported]
- Integration: [Use case complexity]`,
    category: 'engineering',
    subcategory: 'technical-documentation',
    difficulty: 'intermediate',
    domain: 'engineering',
    skillLevel: {
      technical: 'medium',
      complexity: 'moderate',
      timeRequired: 'long'
    },
    tags: ['API documentation', 'developer experience', 'technical writing', 'integration guide'],
    estimatedOutputLength: 'Long (2000-3000 words)',
    useCase: 'Create comprehensive API documentation for developer adoption',
    exampleInput: 'API: E-commerce REST API, Complexity: Medium, Audience: Partner developers, Technology: Multi-language',
    exampleOutput: 'Complete API documentation with reference, guides, and developer resources'
  },
  {
    id: 'system-operations-manual',
    title: 'System Operations & Maintenance Manual',
    description: 'Comprehensive operations and maintenance documentation',
    content: `You are a Technical Operations Writer. Create operations manual for [System/Platform/Infrastructure].

Operations Manual Framework:

1. **System Overview:**
   - System architecture summary
   - Component relationships
   - Operational responsibilities
   - Service level agreements
   - Escalation procedures

2. **Operational Procedures:**
   - Startup and shutdown procedures
   - Monitoring and alerting
   - Backup and recovery
   - Performance optimization
   - Security procedures

3. **Maintenance Activities:**
   - Routine maintenance tasks
   - Preventive maintenance
   - Update and patch procedures
   - Capacity management
   - Performance tuning

4. **Troubleshooting Guide:**
   - Common issues and solutions
   - Diagnostic procedures
   - Emergency response
   - Contact information
   - Knowledge base

Operations Context:
- System Type: [Application/Infrastructure/Platform/Service]
- Environment: [Production/Development/Staging]
- Team: [Operations team size and skills]
- Criticality: [Business impact level]
- Technology: [System technologies and tools]`,
    category: 'engineering',
    subcategory: 'technical-documentation',
    difficulty: 'intermediate',
    domain: 'engineering',
    skillLevel: {
      technical: 'medium',
      complexity: 'moderate',
      timeRequired: 'long'
    },
    tags: ['operations manual', 'system maintenance', 'troubleshooting', 'operations documentation'],
    estimatedOutputLength: 'Long (2200-3000 words)',
    useCase: 'Create operational documentation for system maintenance and support',
    exampleInput: 'System: E-commerce platform, Environment: Production, Team: 5 SREs, Criticality: High, Technology: Kubernetes/AWS',
    exampleOutput: 'Comprehensive operations manual with procedures, maintenance tasks, and troubleshooting guides'
  },
  {
    id: 'architecture-decision-records',
    title: 'Architecture Decision Records (ADR)',
    description: 'Document architectural decisions and their rationale',
    content: `You are a Solution Architect. Create Architecture Decision Record for [Decision/Technology Choice].

ADR Framework:

1. **Decision Context:**
   - Problem statement
   - Business requirements
   - Technical constraints
   - Stakeholder concerns
   - Timeline considerations

2. **Decision Analysis:**
   - Options considered
   - Evaluation criteria
   - Pros and cons analysis
   - Risk assessment
   - Cost-benefit analysis

3. **Decision Details:**
   - Chosen solution
   - Implementation approach
   - Architecture implications
   - Integration considerations
   - Migration strategy

4. **Decision Consequences:**
   - Expected benefits
   - Potential risks
   - Performance impact
   - Maintenance implications
   - Future considerations

Decision Context:
- Decision Type: [Technology/Architecture/Process/Tool]
- Impact Level: [Local/Team/Organization/Critical]
- Stakeholders: [Development/Operations/Business/All]
- Timeline: [Immediate/Short-term/Long-term]
- Resources: [Budget and time constraints]`,
    category: 'engineering',
    subcategory: 'technical-documentation',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'medium'
    },
    tags: ['architecture decision', 'ADR', 'technical decision', 'architectural documentation'],
    estimatedOutputLength: 'Medium (1200-1800 words)',
    useCase: 'Document important architectural and technical decisions for future reference',
    exampleInput: 'Decision: Database migration to NoSQL, Impact: Organization-wide, Stakeholders: All teams, Timeline: 6 months',
    exampleOutput: 'Detailed ADR documenting decision rationale, analysis, and implementation approach'
  },
  {
    id: 'code-review-guidelines',
    title: 'Code Review Guidelines & Standards',
    description: 'Comprehensive code review process and quality standards',
    content: `You are a Software Engineering Lead. Create code review guidelines for [Team/Organization] using [Technology Stack].

Code Review Guidelines Framework:

1. **Review Process:**
   - Review workflow and stages
   - Reviewer assignment
   - Review timeline and SLAs
   - Approval criteria
   - Escalation procedures

2. **Quality Standards:**
   - Code style and formatting
   - Architecture compliance
   - Performance considerations
   - Security requirements
   - Testing standards

3. **Review Checklist:**
   - Functionality verification
   - Code quality assessment
   - Documentation requirements
   - Test coverage validation
   - Security vulnerability check

4. **Best Practices:**
   - Effective feedback guidelines
   - Common issues and solutions
   - Learning and mentoring
   - Tool usage and automation
   - Continuous improvement

Review Context:
- Team Size: [Number of developers]
- Technology: [Programming languages/frameworks]
- Project Type: [Product/Platform/Service]
- Complexity: [Codebase complexity level]
- Quality Goals: [Quality and performance targets]`,
    category: 'engineering',
    subcategory: 'technical-documentation',
    difficulty: 'intermediate',
    domain: 'engineering',
    skillLevel: {
      technical: 'medium',
      complexity: 'moderate',
      timeRequired: 'medium'
    },
    tags: ['code review', 'quality standards', 'development process', 'team guidelines'],
    estimatedOutputLength: 'Long (1800-2500 words)',
    useCase: 'Establish effective code review processes and quality standards',
    exampleInput: 'Team: 15 developers, Technology: React/Node.js, Type: SaaS product, Complexity: High, Goals: High quality and security',
    exampleOutput: 'Comprehensive code review guidelines with process, standards, and best practices'
  }
];

const qualityAssuranceTemplates: Template[] = [
  {
    id: 'testing-strategy-framework',
    title: 'Comprehensive Testing Strategy',
    description: 'Complete testing strategy and quality assurance framework',
    content: `You are a QA Engineer. Develop testing strategy for [Application/System] with [Quality Requirements].

Testing Strategy Framework:

1. **Testing Approach:**
   - Testing philosophy and principles
   - Test level definitions
   - Testing types and techniques
   - Automation strategy
   - Risk-based testing approach

2. **Test Planning:**
   - Test scope and objectives
   - Entry and exit criteria
   - Resource allocation
   - Timeline and milestones
   - Environment requirements

3. **Test Design:**
   - Test case design techniques
   - Test data management
   - Test environment setup
   - Tool selection and setup
   - Defect management process

4. **Execution & Reporting:**
   - Test execution procedures
   - Progress tracking and metrics
   - Defect reporting and tracking
   - Test results analysis
   - Quality assessment

Testing Context:
- Application Type: [Web/Mobile/Desktop/API/System]
- Testing Scope: [Unit/Integration/System/E2E/Performance]
- Team Size: [QA team composition]
- Timeline: [Testing timeline and phases]
- Quality Goals: [Quality targets and metrics]`,
    category: 'engineering',
    subcategory: 'quality-assurance',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['testing strategy', 'quality assurance', 'test planning', 'QA framework'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Develop comprehensive testing strategies for software quality assurance',
    exampleInput: 'Application: E-commerce platform, Scope: Full system testing, Team: 8 QA engineers, Timeline: 3 months, Goals: 99.9% uptime',
    exampleOutput: 'Complete testing strategy with approach, planning, design, and execution framework'
  },
  {
    id: 'automated-testing-implementation',
    title: 'Test Automation Implementation',
    description: 'Design and implement automated testing solutions',
    content: `You are a Test Automation Engineer. Implement test automation for [Application/System] using [Technology/Tools].

Test Automation Framework:

1. **Automation Strategy:**
   - Automation goals and scope
   - Test selection criteria
   - Framework architecture
   - Tool evaluation and selection
   - ROI assessment

2. **Framework Design:**
   - Test framework structure
   - Page object model implementation
   - Data-driven testing approach
   - Reusable component library
   - Reporting mechanism

3. **Implementation Plan:**
   - Test script development
   - Environment setup
   - CI/CD integration
   - Parallel execution setup
   - Maintenance procedures

4. **Execution & Maintenance:**
   - Test execution strategy
   - Result analysis and reporting
   - Framework maintenance
   - Performance optimization
   - Continuous improvement

Automation Context:
- Application: [Web/Mobile/API/Desktop application]
- Technology: [Selenium/Cypress/Playwright/Mobile tools]
- Scope: [UI/API/Database/End-to-end testing]
- Team: [Automation team size and skills]
- Integration: [CI/CD pipeline requirements]`,
    category: 'engineering',
    subcategory: 'quality-assurance',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['test automation', 'automated testing', 'QA automation', 'testing framework'],
    estimatedOutputLength: 'Long (2000-2800 words)',
    useCase: 'Implement effective test automation solutions for improved testing efficiency',
    exampleInput: 'Application: React web app, Technology: Cypress, Scope: E2E testing, Team: 4 automation engineers, Integration: Jenkins CI/CD',
    exampleOutput: 'Complete test automation implementation with framework design, scripts, and CI/CD integration'
  },
  {
    id: 'performance-testing-strategy',
    title: 'Performance Testing & Optimization',
    description: 'Comprehensive performance testing and system optimization',
    content: `You are a Performance Testing Engineer. Design performance testing strategy for [Application/System] with [Performance Requirements].

Performance Testing Framework:

1. **Performance Requirements:**
   - Performance goals definition
   - User load characteristics
   - Response time targets
   - Throughput requirements
   - Resource utilization limits

2. **Testing Strategy:**
   - Performance test types
   - Test environment setup
   - Tool selection and configuration
   - Test data preparation
   - Monitoring strategy

3. **Test Design & Execution:**
   - Load model development
   - Test scenario creation
   - Execution procedures
   - Monitoring and measurement
   - Results analysis

4. **Optimization & Tuning:**
   - Bottleneck identification
   - Performance optimization
   - Capacity planning
   - Scalability assessment
   - Continuous monitoring

Performance Context:
- Application Type: [Web/Mobile/API/Database/System]
- Expected Load: [Concurrent users/transactions per second]
- Performance Goals: [Response time/throughput targets]
- Infrastructure: [Cloud/On-premise/Hybrid]
- Tools: [JMeter/LoadRunner/Gatling/K6]`,
    category: 'engineering',
    subcategory: 'quality-assurance',
    difficulty: 'expert',
    domain: 'engineering',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['performance testing', 'load testing', 'performance optimization', 'scalability testing'],
    estimatedOutputLength: 'Very Long (2300+ words)',
    useCase: 'Design and execute performance testing to ensure system scalability and reliability',
    exampleInput: 'Application: E-commerce API, Load: 10,000 concurrent users, Goals: <200ms response time, Infrastructure: AWS, Tools: JMeter',
    exampleOutput: 'Comprehensive performance testing strategy with load models, execution plan, and optimization recommendations'
  },
  {
    id: 'security-testing-framework',
    title: 'Security Testing & Vulnerability Assessment',
    description: 'Comprehensive security testing and vulnerability assessment',
    content: `You are a Security Testing Engineer. Design security testing framework for [Application/System] addressing [Security Requirements].

Security Testing Framework:

1. **Security Assessment:**
   - Threat modeling
   - Risk assessment
   - Compliance requirements
   - Security standards adherence
   - Vulnerability categories

2. **Testing Strategy:**
   - Security testing types
   - Testing methodologies
   - Tool selection and setup
   - Test environment preparation
   - Reporting procedures

3. **Test Execution:**
   - Vulnerability scanning
   - Penetration testing
   - Code security analysis
   - Configuration review
   - Access control testing

4. **Remediation & Monitoring:**
   - Vulnerability prioritization
   - Remediation planning
   - Security monitoring setup
   - Continuous security testing
   - Security metrics tracking

Security Context:
- Application: [Web/Mobile/API/Enterprise system]
- Security Level: [Basic/Standard/High/Critical]
- Compliance: [OWASP/NIST/SOC2/Industry specific]
- Environment: [Production/Staging/Development]
- Tools: [SAST/DAST/IAST/Manual testing]`,
    category: 'engineering',
    subcategory: 'quality-assurance',
    difficulty: 'expert',
    domain: 'engineering',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['security testing', 'vulnerability assessment', 'penetration testing', 'security QA'],
    estimatedOutputLength: 'Very Long (2400+ words)',
    useCase: 'Implement comprehensive security testing to identify and mitigate security vulnerabilities',
    exampleInput: 'Application: Banking web platform, Security: Critical, Compliance: SOC2 + PCI-DSS, Environment: Production, Tools: OWASP ZAP + Manual',
    exampleOutput: 'Complete security testing framework with assessment, testing procedures, and remediation strategy'
  },
  {
    id: 'quality-metrics-dashboard',
    title: 'Quality Metrics & Reporting Dashboard',
    description: 'Quality metrics framework and reporting dashboard design',
    content: `You are a QA Manager. Design quality metrics and reporting framework for [Project/Product] with [Quality Objectives].

Quality Metrics Framework:

1. **Metrics Strategy:**
   - Quality objectives alignment
   - Key performance indicators
   - Metric categories and hierarchy
   - Data collection methods
   - Reporting frequency

2. **Dashboard Design:**
   - Stakeholder requirements
   - Visual design and layout
   - Real-time vs. historical data
   - Drill-down capabilities
   - Alert and notification system

3. **Data Integration:**
   - Data source identification
   - Integration architecture
   - Data pipeline design
   - Quality assurance of data
   - Automation implementation

4. **Analysis & Insights:**
   - Trend analysis capabilities
   - Predictive analytics
   - Root cause analysis
   - Actionable insights
   - Continuous improvement

Metrics Context:
- Project/Product: [Software product/platform]
- Quality Goals: [Specific quality objectives]
- Stakeholders: [Development/QA/Management/Business]
- Data Sources: [Testing tools/CI/CD/Production systems]
- Technology: [Dashboard and analytics tools]`,
    category: 'engineering',
    subcategory: 'quality-assurance',
    difficulty: 'advanced',
    domain: 'engineering',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['quality metrics', 'QA reporting', 'quality dashboard', 'metrics framework'],
    estimatedOutputLength: 'Long (2000-2700 words)',
    useCase: 'Design comprehensive quality metrics and reporting systems for informed decision-making',
    exampleInput: 'Product: SaaS platform, Goals: Reduce defects by 50%, Stakeholders: Engineering + Management, Sources: Jira + Jenkins + Datadog, Technology: Grafana',
    exampleOutput: 'Complete quality metrics framework with dashboard design, data integration, and analysis capabilities'
  }
];

export const engineeringTemplates: TemplateCategory = {
  id: 'engineering',
  name: 'Engineering & Technical',
  icon: '⚙️',
  description: 'System design, project management, technical documentation, and quality assurance',
  color: '#9333EA',
  domain: 'engineering',
  subcategories: [
    {
      id: 'system-design',
      name: 'System Design',
      description: 'Architecture design, technical specifications, and system planning',
      templates: systemDesignTemplates
    },
    {
      id: 'project-management',
      name: 'Project Management',
      description: 'Engineering project planning, agile methodology, and team coordination',
      templates: projectManagementTemplates
    },
    {
      id: 'technical-documentation',
      name: 'Technical Documentation',
      description: 'Technical specifications, API docs, and engineering documentation',
      templates: technicalDocumentationTemplates
    },
    {
      id: 'quality-assurance',
      name: 'Quality Assurance',
      description: 'Testing strategies, automation, and quality management',
      templates: qualityAssuranceTemplates
    }
  ]
};
