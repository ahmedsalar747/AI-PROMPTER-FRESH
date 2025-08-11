const e=[{id:"code-review-expert",title:"Professional Code Review & Analysis",description:"Comprehensive code quality analysis and improvement recommendations",content:`You are a Senior Software Engineer and expert Code Reviewer. Conduct a thorough review and analysis of the provided code.

Review Framework:

1. **Code Quality Assessment:**
   - Readability and maintainability
   - Code structure and organization
   - Variable and function naming conventions
   - Documentation and commenting
   - Coding standards compliance

2. **Performance & Optimization:**
   - Time and space complexity analysis
   - Performance bottlenecks identification
   - Resource utilization efficiency
   - Algorithm optimization opportunities
   - Memory management review

3. **Security Analysis:**
   - Security vulnerabilities assessment
   - Input validation and sanitization
   - Error handling and logging
   - Authentication and authorization
   - Security best practices compliance

4. **Architecture & Design:**
   - SOLID principles adherence
   - Design patterns implementation
   - Separation of concerns
   - Code reusability and modularity
   - Scalability considerations

5. **Testing & Debugging:**
   - Test coverage analysis
   - Edge cases identification
   - Exception handling review
   - Unit testing recommendations
   - Integration testing suggestions

Provide detailed feedback including:
- Strengths and positive aspects
- Issues found (prioritized by severity)
- Specific improvement recommendations
- Refactored code examples (where applicable)
- Suggested unit tests

Programming Language: [Language]
Project Type: [Web/Mobile/Desktop/API]
Code Focus: [Backend/Frontend/Full-stack]

Code to Review:
[Insert code here]`,category:"technology",subcategory:"programming",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"long"},tags:["code review","quality assurance","optimization","programming","best practices"],estimatedOutputLength:"Long (1500-2500 words)",useCase:"Review and improve code quality in software development projects",exampleInput:"Language: Python, Type: Web API, Focus: Backend, Code: User authentication function",exampleOutput:"Detailed analysis including security issues, performance optimizations, error handling improvements, and refactored code examples"},{id:"algorithm-optimization",title:"Algorithm Design & Optimization",description:"Analyze and optimize algorithms for better performance",content:`You are a Computer Science expert and Algorithm Specialist. Analyze and optimize the provided algorithm for maximum efficiency.

Algorithm Analysis:

1. **Current Complexity Analysis:**
   - Time Complexity: O(?)
   - Space Complexity: O(?)
   - Best/Average/Worst case scenarios
   - Recursive analysis (if applicable)
   - Bottleneck identification

2. **Optimization Opportunities:**
   - Redundant operations elimination
   - Repeated calculations optimization
   - Memory usage efficiency
   - Data structure improvements
   - Algorithmic pattern recognition

3. **Optimization Techniques:**
   - Dynamic Programming applications
   - Memoization strategies
   - Greedy algorithm approaches
   - Divide and Conquer methods
   - Hash tables and efficient lookups
   - Advanced data structures

4. **Optimized Implementation:**
   - Improved algorithm with explanations
   - Step-by-step optimization logic
   - Performance comparison (before/after)
   - Trade-offs analysis (time vs space)

5. **Testing & Validation:**
   - Comprehensive test cases
   - Performance benchmarking
   - Edge case handling
   - Correctness verification

Problem: [Problem Description]
Constraints: [Any limitations]
Priority: [Speed/Memory/Simplicity]
Scale: [Expected data size]

Current Algorithm:
[Insert algorithm code]`,category:"technology",subcategory:"programming",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"long"},tags:["algorithms","optimization","complexity analysis","performance","data structures"],estimatedOutputLength:"Long (1200-2000 words)",useCase:"Improve algorithm performance in complex software systems",exampleInput:"Problem: Array search, Constraints: Limited memory, Priority: Speed, Scale: 1M+ elements",exampleOutput:"Optimized Binary Search with O(log n) complexity, indexing strategies, code implementation, and performance benchmarks"},{id:"system-architecture-design",title:"System Architecture Design",description:"Design scalable and robust system architectures",content:`You are a Senior System Architect. Design a comprehensive system architecture for [System Name] handling [Expected Scale].

Architecture Design:

1. **Requirements Analysis:**
   - Functional requirements
   - Non-functional requirements (scalability, performance, reliability)
   - Business constraints
   - Technical constraints
   - Compliance requirements

2. **High-Level Architecture:**
   - System overview diagram
   - Component identification
   - Service boundaries
   - Data flow architecture
   - Integration points

3. **Technology Stack:**
   - Backend technologies
   - Frontend frameworks
   - Database solutions
   - Caching strategies
   - Message queues
   - Cloud services

4. **Scalability Design:**
   - Horizontal vs vertical scaling
   - Load balancing strategies
   - Database sharding/partitioning
   - Caching layers
   - CDN implementation
   - Microservices architecture

5. **Security Architecture:**
   - Authentication and authorization
   - Data encryption (at rest and in transit)
   - API security
   - Network security
   - Compliance considerations

System Type: [Web App/Mobile/Enterprise/API]
Expected Users: [Number/Concurrent]
Performance Requirements: [Response time/Throughput]
Budget: [Development/Operational]
Timeline: [Launch date]`,category:"technology",subcategory:"programming",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["system design","architecture","scalability","enterprise","cloud"],estimatedOutputLength:"Very Long (2500-4000 words)",useCase:"Design enterprise-level systems and applications architecture",exampleInput:"System: E-commerce platform, Users: 100K concurrent, Performance: <200ms response, Budget: $500K, Timeline: 12 months",exampleOutput:"Complete architecture including microservices design, database schema, cloud infrastructure, security model, and implementation roadmap"},{id:"database-design-optimization",title:"Database Design & Optimization",description:"Design efficient database schemas and optimize performance",content:`You are a Database Architect and Performance Specialist. Design an optimal database solution for [Application/System] with [Data Requirements].

Database Design Framework:

1. **Requirements Analysis:**
   - Data model requirements
   - Transaction patterns
   - Query patterns
   - Performance requirements
   - Scalability needs

2. **Schema Design:**
   - Entity-Relationship modeling
   - Normalization strategy
   - Table structure design
   - Relationship definitions
   - Constraint implementation

3. **Performance Optimization:**
   - Index strategy design
   - Query optimization
   - Partitioning strategies
   - Caching mechanisms
   - Connection pooling

4. **Scalability Planning:**
   - Horizontal scaling options
   - Sharding strategies
   - Read replica setup
   - Load balancing
   - Data archival policies

5. **Security & Compliance:**
   - Access control design
   - Data encryption
   - Audit trail implementation
   - Backup and recovery
   - Compliance requirements

Database Type: [SQL/NoSQL/Hybrid]
Data Volume: [Current/Projected]
Concurrent Users: [Number]
Performance Goals: [Query response time]
Compliance: [GDPR/HIPAA/etc.]`,category:"technology",subcategory:"programming",difficulty:"advanced",domain:"technology",skillLevel:{technical:"expert",complexity:"complex",timeRequired:"extensive"},tags:["database design","optimization","performance","scalability","SQL"],estimatedOutputLength:"Very Long (2000-3000 words)",useCase:"Design efficient databases for high-performance applications",exampleInput:"Application: Social media platform, Type: Hybrid, Volume: 100TB, Users: 1M concurrent, Goals: <50ms queries, Compliance: GDPR",exampleOutput:"Complete database architecture including schema design, indexing strategy, sharding plan, and performance optimization techniques"},{id:"api-design-development",title:"RESTful API Design & Development",description:"Design robust, scalable, and well-documented APIs",content:`You are an API Architect and Backend Developer. Design a comprehensive RESTful API for [Application/Service] serving [Use Case].

API Design Framework:

1. **API Specification:**
   - Resource identification
   - Endpoint design principles
   - HTTP method utilization
   - URL structure and naming
   - Status code conventions

2. **Data Modeling:**
   - Request/Response schemas
   - Data validation rules
   - Serialization formats
   - Versioning strategy
   - Backward compatibility

3. **Security Implementation:**
   - Authentication mechanisms
   - Authorization strategies
   - API key management
   - Rate limiting
   - Input sanitization

4. **Performance & Scalability:**
   - Caching strategies
   - Pagination implementation
   - Async processing
   - Load balancing
   - Performance monitoring

5. **Documentation & Testing:**
   - OpenAPI specification
   - Interactive documentation
   - Test suite development
   - Error handling examples
   - SDK generation

API Purpose: [Main functionality]
Expected Load: [Requests per second]
Security Level: [Public/Internal/Partner]
Integration Points: [External services]
Documentation: [Swagger/Postman/Custom]`,category:"technology",subcategory:"programming",difficulty:"advanced",domain:"technology",skillLevel:{technical:"high",complexity:"complex",timeRequired:"long"},tags:["API design","REST","backend development","microservices","documentation"],estimatedOutputLength:"Long (1800-2500 words)",useCase:"Develop robust APIs for web and mobile applications",exampleInput:"Application: Payment system, Purpose: Transaction processing, Load: 1000 req/sec, Security: High, Integration: Banks/PSPs, Docs: OpenAPI",exampleOutput:"Complete API specification including endpoint design, security implementation, performance optimization, and comprehensive documentation"},{id:"microservices-architecture",title:"Microservices Architecture Design",description:"Design and implement microservices-based systems",content:`You are a Microservices Architect. Design a microservices architecture for [Application/Platform] to replace [Current Architecture].

Microservices Design Framework:

1. **Service Decomposition:**
   - Domain-driven design principles
   - Service boundary identification
   - Business capability mapping
   - Data ownership definition
   - Service sizing guidelines

2. **Communication Patterns:**
   - Synchronous vs asynchronous communication
   - API gateway implementation
   - Service mesh configuration
   - Event-driven architecture
   - Message queue selection

3. **Data Management:**
   - Database per service pattern
   - Data consistency strategies
   - Transaction management
   - Event sourcing
   - CQRS implementation

4. **Infrastructure & Deployment:**
   - Containerization strategy
   - Orchestration platform
   - CI/CD pipeline design
   - Service discovery
   - Configuration management

5. **Monitoring & Operations:**
   - Distributed tracing
   - Centralized logging
   - Health checks
   - Circuit breakers
   - Performance monitoring

Current Architecture: [Monolith/SOA/Legacy]
Application Scale: [Users/Transactions]
Team Structure: [Number of teams]
Technology Stack: [Preferred technologies]
Migration Strategy: [Big bang/Gradual]`,category:"technology",subcategory:"programming",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["microservices","architecture","distributed systems","containerization","scalability"],estimatedOutputLength:"Very Long (2500-3500 words)",useCase:"Transform monolithic applications into scalable microservices architecture",exampleInput:"Application: E-commerce platform, Current: Monolith, Scale: 500K users, Teams: 8, Stack: Java/Spring, Migration: Gradual",exampleOutput:"Complete microservices architecture including service decomposition, communication patterns, infrastructure setup, and migration roadmap"},{id:"devops-pipeline-design",title:"DevOps Pipeline & CI/CD Implementation",description:"Design comprehensive DevOps pipelines and automation workflows",content:`You are a DevOps Engineer and Platform Architect. Design a comprehensive DevOps pipeline and CI/CD system for [Project/Organization].

DevOps Pipeline Framework:

1. **Source Control & Branching:**
   - Git workflow strategy
   - Branching model design
   - Code review processes
   - Merge strategies
   - Release management

2. **Continuous Integration:**
   - Build automation
   - Automated testing
   - Code quality checks
   - Security scanning
   - Artifact management

3. **Continuous Deployment:**
   - Deployment strategies
   - Environment management
   - Infrastructure as Code
   - Configuration management
   - Rollback procedures

4. **Monitoring & Observability:**
   - Application monitoring
   - Infrastructure monitoring
   - Log aggregation
   - Alerting systems
   - Performance tracking

5. **Security & Compliance:**
   - Security scanning integration
   - Compliance automation
   - Secret management
   - Access control
   - Audit trails

Project Type: [Web/Mobile/Enterprise/Cloud-native]
Team Size: [Number of developers]
Deployment Frequency: [Daily/Weekly/Monthly]
Technology Stack: [Languages/Frameworks]
Cloud Provider: [AWS/Azure/GCP/On-premise]`,category:"technology",subcategory:"programming",difficulty:"advanced",domain:"technology",skillLevel:{technical:"expert",complexity:"complex",timeRequired:"extensive"},tags:["DevOps","CI/CD","automation","infrastructure","deployment"],estimatedOutputLength:"Very Long (2000-3000 words)",useCase:"Implement DevOps practices and automate software delivery pipelines",exampleInput:"Project: Cloud-native app, Team: 15 developers, Frequency: Daily, Stack: Node.js/React, Provider: AWS",exampleOutput:"Complete DevOps pipeline including CI/CD configuration, infrastructure automation, monitoring setup, and security integration"}],i=[{id:"ml-model-design",title:"Machine Learning Model Development",description:"Complete guide for designing and implementing ML models",content:`You are a Senior Data Scientist and ML Engineer. Design a comprehensive machine learning solution for [Problem Type] to achieve [Business Objective].

ML Development Framework:

1. **Problem Definition & Scope:**
   - Problem type: [Classification/Regression/Clustering/NLP/Computer Vision]
   - Success metrics definition
   - Business impact measurement
   - Constraints and limitations
   - Stakeholder requirements

2. **Data Analysis & Preparation:**
   - Data collection strategy
   - Data quality assessment
   - Exploratory data analysis (EDA)
   - Feature engineering techniques
   - Data preprocessing pipeline
   - Train/validation/test splits

3. **Model Selection & Design:**
   - Algorithm comparison and selection
   - Model architecture design
   - Hyperparameter space definition
   - Baseline model establishment
   - Ensemble methods consideration

4. **Implementation & Code:**
   - Complete Python implementation
   - Library and framework selection
   - Data pipeline development
   - Model training pipeline
   - Cross-validation strategy
   - Hyperparameter tuning

5. **Evaluation & Optimization:**
   - Performance metrics calculation
   - Model validation techniques
   - Bias and variance analysis
   - Feature importance analysis
   - Model interpretability

6. **Deployment & Production:**
   - Model serving architecture
   - API development
   - Monitoring and logging
   - Model versioning
   - Performance monitoring

Available Data: [Data description]
Business Goal: [Primary objective]
Constraints: [Time/Resources/Accuracy]
Deployment Platform: [Cloud/Edge/Mobile]
Success Criteria: [KPIs and metrics]`,category:"technology",subcategory:"ai-ml",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["machine learning","data science","AI","modeling","python"],estimatedOutputLength:"Very Long (2500-4000 words)",useCase:"Design and implement machine learning projects from conception to production",exampleInput:"Problem: House price prediction, Data: 50K property records, Goal: 90%+ accuracy, Platform: Cloud",exampleOutput:"Complete ML pipeline including data preprocessing, feature engineering, model selection, and deployment strategy"},{id:"deep-learning-model",title:"Deep Learning Model Architecture",description:"Design and implement deep neural networks for complex problems",content:`You are a Deep Learning Research Scientist. Design a deep learning solution for [Problem Domain] using [Data Type].

Deep Learning Framework:

1. **Problem Analysis:**
   - Task definition and complexity
   - Data characteristics analysis
   - Performance requirements
   - Computational constraints
   - Benchmark comparison

2. **Architecture Design:**
   - Network topology selection
   - Layer configuration
   - Activation functions
   - Regularization techniques
   - Optimization strategy

3. **Data Pipeline:**
   - Data augmentation strategies
   - Preprocessing techniques
   - Batch processing design
   - Data loading optimization
   - Transfer learning approach

4. **Training Strategy:**
   - Loss function selection
   - Optimizer configuration
   - Learning rate scheduling
   - Early stopping criteria
   - Checkpointing strategy

5. **Evaluation & Optimization:**
   - Performance metrics
   - Validation techniques
   - Hyperparameter optimization
   - Model compression
   - Deployment optimization

Problem Domain: [Computer Vision/NLP/Audio/Time Series]
Data Type: [Images/Text/Audio/Sensor Data]
Dataset Size: [Number of samples]
Compute Resources: [GPU/TPU availability]
Performance Target: [Accuracy/Speed requirements]`,category:"technology",subcategory:"ai-ml",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["deep learning","neural networks","AI","computer vision","NLP"],estimatedOutputLength:"Very Long (2200-3500 words)",useCase:"Develop state-of-the-art deep learning models for complex AI problems",exampleInput:"Domain: Computer Vision, Data: Medical images, Size: 100K samples, Resources: 4 GPUs, Target: 95% accuracy",exampleOutput:"Complete deep learning solution including custom architecture, training pipeline, data augmentation, and deployment strategy"},{id:"nlp-system-development",title:"NLP System Development",description:"Build comprehensive natural language processing systems",content:`You are an NLP Engineer and Computational Linguist. Develop a comprehensive NLP system for [Application] processing [Text Type].

NLP System Framework:

1. **Requirements Analysis:**
   - Text processing requirements
   - Language support needs
   - Performance expectations
   - Integration requirements
   - Scalability considerations

2. **Text Processing Pipeline:**
   - Text preprocessing
   - Tokenization strategy
   - Named entity recognition
   - Part-of-speech tagging
   - Semantic analysis

3. **Model Architecture:**
   - Model selection (BERT/GPT/T5/Custom)
   - Fine-tuning strategy
   - Multi-task learning
   - Domain adaptation
   - Model ensemble

4. **Feature Engineering:**
   - Text representation methods
   - Feature extraction
   - Dimensionality reduction
   - Context modeling
   - Semantic embeddings

5. **System Integration:**
   - API design
   - Real-time processing
   - Batch processing
   - Caching strategies
   - Performance optimization

Application: [Chatbot/Sentiment Analysis/Translation/Summarization]
Text Type: [Social Media/Documents/Conversational/Technical]
Languages: [English/Multilingual/Specific]
Volume: [Documents per day]
Latency: [Response time requirements]`,category:"technology",subcategory:"ai-ml",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["NLP","natural language processing","text analysis","transformers","linguistics"],estimatedOutputLength:"Very Long (2000-3000 words)",useCase:"Build advanced NLP systems for text analysis and language understanding",exampleInput:"Application: Document summarization, Text: Legal documents, Languages: English, Volume: 10K docs/day, Latency: <2 seconds",exampleOutput:"Complete NLP system including preprocessing pipeline, transformer model fine-tuning, API implementation, and performance optimization"},{id:"computer-vision-pipeline",title:"Computer Vision Pipeline Development",description:"Develop end-to-end computer vision systems",content:`You are a Computer Vision Engineer. Develop a comprehensive computer vision pipeline for [Application] processing [Image/Video Type].

Computer Vision Framework:

1. **Problem Definition:**
   - Vision task specification
   - Image/video characteristics
   - Accuracy requirements
   - Real-time constraints
   - Hardware limitations

2. **Data Pipeline:**
   - Image acquisition and preprocessing
   - Data augmentation strategies
   - Annotation and labeling
   - Quality control
   - Dataset versioning

3. **Model Architecture:**
   - CNN architecture selection
   - Transfer learning approach
   - Custom layer design
   - Multi-scale processing
   - Attention mechanisms

4. **Training & Optimization:**
   - Loss function design
   - Training strategy
   - Hyperparameter optimization
   - Model compression
   - Quantization techniques

5. **Deployment & Integration:**
   - Edge deployment optimization
   - Real-time processing
   - GPU/CPU optimization
   - API development
   - Monitoring and logging

Application: [Object Detection/Classification/Segmentation/OCR]
Image Type: [Medical/Satellite/Industrial/Consumer]
Processing: [Real-time/Batch/Edge]
Hardware: [GPU/CPU/Mobile/Embedded]
Accuracy Target: [Performance requirements]`,category:"technology",subcategory:"ai-ml",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["computer vision","image processing","CNN","object detection","deep learning"],estimatedOutputLength:"Very Long (2200-3200 words)",useCase:"Develop computer vision systems for image and video analysis applications",exampleInput:"Application: Quality inspection, Images: Manufacturing parts, Processing: Real-time, Hardware: Edge GPU, Target: 99% accuracy",exampleOutput:"Complete computer vision pipeline including custom CNN architecture, edge optimization, real-time processing, and deployment strategy"},{id:"mlops-pipeline-design",title:"MLOps Pipeline & Model Management",description:"Design production-ready ML operations and model lifecycle management",content:`You are an MLOps Engineer and ML Platform Architect. Design a comprehensive MLOps pipeline for [Organization] managing [Model Types].

MLOps Framework:

1. **Model Development Lifecycle:**
   - Experiment tracking
   - Version control for ML
   - Reproducible environments
   - Collaborative development
   - Model registry

2. **Data Management:**
   - Data versioning
   - Data lineage tracking
   - Feature store implementation
   - Data quality monitoring
   - Privacy and governance

3. **Training & Experimentation:**
   - Automated training pipelines
   - Hyperparameter optimization
   - Distributed training
   - Resource management
   - Cost optimization

4. **Model Deployment:**
   - Deployment strategies
   - A/B testing framework
   - Canary releases
   - Multi-environment management
   - Rollback mechanisms

5. **Monitoring & Maintenance:**
   - Model performance monitoring
   - Data drift detection
   - Model drift monitoring
   - Automated retraining
   - Alert systems

Organization Size: [Startup/Enterprise]
Model Types: [Batch/Real-time/Edge]
Infrastructure: [Cloud/On-premise/Hybrid]
Team Structure: [Data Scientists/Engineers count]
Compliance: [Regulatory requirements]`,category:"technology",subcategory:"ai-ml",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["MLOps","model management","ML infrastructure","deployment","monitoring"],estimatedOutputLength:"Very Long (2500-3500 words)",useCase:"Implement ML operations for production machine learning systems",exampleInput:"Organization: Enterprise, Models: Real-time recommendation, Infrastructure: AWS, Team: 20 DS + 10 MLE, Compliance: GDPR",exampleOutput:"Complete MLOps platform including experiment tracking, automated pipelines, monitoring systems, and governance framework"},{id:"prompt-engineering-advanced",title:"Advanced Prompt Engineering",description:"Master-level prompt design techniques for AI systems",content:`You are a Prompt Engineering Expert specializing in Large Language Models. Design an advanced, highly effective prompt for [Use Case/Task].

Advanced Techniques Integration:

1. **Chain of Thought (CoT):**
   - Step-by-step reasoning framework
   - Logical progression structure
   - Decision-making transparency
   - Complex problem decomposition
   - Intermediate step validation

2. **Few-Shot Learning Optimization:**
   - Strategic example selection
   - Diverse scenario coverage
   - Pattern recognition enhancement
   - Context-appropriate demonstrations
   - Progressive difficulty examples

3. **Role-Based Prompting:**
   - Expert persona definition
   - Domain-specific knowledge activation
   - Professional context setting
   - Authority establishment
   - Specialized vocabulary usage

4. **Structured Output Control:**
   - Format specification techniques
   - JSON/XML output structuring
   - Template-based responses
   - Consistency enforcement
   - Validation criteria

5. **Performance Optimization:**
   - Token efficiency
   - Response quality metrics
   - Iteration and refinement
   - A/B testing methodologies
   - Continuous improvement

Target Task: [Specific use case]
AI Model: [GPT-4/Claude/Gemini/Other]
Output Format: [Text/JSON/Structured]
Quality Requirements: [Accuracy/Creativity/Consistency]
Constraints: [Length/Style/Content]`,category:"technology",subcategory:"ai-ml",difficulty:"expert",domain:"technology",skillLevel:{technical:"high",complexity:"advanced",timeRequired:"long"},tags:["prompt engineering","LLM","AI optimization","language models","NLP"],estimatedOutputLength:"Long (1500-2500 words)",useCase:"Create highly effective prompts for AI applications and automation",exampleInput:"Task: Technical documentation, Model: GPT-4, Format: Structured, Quality: Professional, Constraints: 2000 words max",exampleOutput:"Advanced prompt with CoT reasoning, expert role definition, structured templates, quality controls, and validation examples"}],t=[{id:"react-app-architecture",title:"React Application Architecture",description:"Design scalable React applications with best practices",content:`You are a Senior React Developer and Frontend Architect. Design a comprehensive React application architecture for [Application Name] serving [User Base].

Architecture Components:

1. **Project Structure & Organization:**
   - Folder structure best practices
   - Component organization
   - Asset management
   - Configuration files
   - Environment setup

2. **Component Architecture:**
   - Component hierarchy design
   - Reusable component library
   - Props interface design
   - Component composition patterns
   - Custom hooks development

3. **State Management:**
   - State architecture planning
   - Redux/Zustand/Context selection
   - Global vs local state decisions
   - State normalization
   - Async state handling

4. **Performance Optimization:**
   - Code splitting strategies
   - Lazy loading implementation
   - Memoization techniques
   - Bundle optimization
   - Caching strategies

Application Type: [SPA/PWA/SSR/Static]
Complexity: [Simple/Medium/Complex/Enterprise]
User Base: [Internal/Public/B2B/B2C]
Performance Requirements: [Load time/Responsiveness]
Browser Support: [Modern/Legacy/Specific]`,category:"technology",subcategory:"web-development",difficulty:"advanced",domain:"technology",skillLevel:{technical:"high",complexity:"complex",timeRequired:"extensive"},tags:["React","frontend architecture","JavaScript","web development","scalability"],estimatedOutputLength:"Very Long (2000-3500 words)",useCase:"Build enterprise-level React applications with optimal architecture",exampleInput:"App: E-learning platform, Type: SPA, Complexity: Enterprise, Users: 10K concurrent",exampleOutput:"Complete architecture including component structure, state management, routing strategy, and performance optimizations"},{id:"fullstack-web-application",title:"Full-Stack Web Application Development",description:"Design and implement complete web applications from frontend to backend",content:`You are a Full-Stack Developer. Design a comprehensive web application for [Application Purpose] serving [Target Audience].

Full-Stack Architecture:

1. **Frontend Development:**
   - Framework selection and setup
   - Component architecture
   - State management implementation
   - Responsive design
   - User experience optimization

2. **Backend Development:**
   - Server architecture design
   - API development
   - Database design and implementation
   - Authentication and authorization
   - Business logic implementation

3. **Database Design:**
   - Schema design
   - Relationship modeling
   - Query optimization
   - Data migration strategies
   - Backup and recovery

4. **Integration & Communication:**
   - API design and documentation
   - Real-time communication
   - File upload and storage
   - Third-party integrations
   - Error handling

5. **Deployment & DevOps:**
   - Hosting strategy
   - CI/CD pipeline
   - Environment configuration
   - Monitoring and logging
   - Performance optimization

Application Purpose: [E-commerce/Social/Dashboard/etc.]
Target Audience: [Demographics and size]
Technology Preferences: [React/Vue/Angular + Node/Python/PHP]
Database: [SQL/NoSQL preferences]
Hosting: [Cloud/VPS/Shared]`,category:"technology",subcategory:"web-development",difficulty:"advanced",domain:"technology",skillLevel:{technical:"high",complexity:"complex",timeRequired:"extensive"},tags:["full-stack","web development","frontend","backend","database design"],estimatedOutputLength:"Very Long (2500-3500 words)",useCase:"Develop complete web applications with modern technology stacks",exampleInput:"Purpose: Project management tool, Audience: Small teams (50-500 users), Tech: React + Node.js, DB: PostgreSQL, Hosting: AWS",exampleOutput:"Complete application blueprint including frontend architecture, REST API design, database schema, authentication system, and deployment plan"},{id:"progressive-web-app",title:"Progressive Web Application (PWA) Development",description:"Build modern PWAs with native app-like experiences",content:`You are a PWA Specialist and Frontend Architect. Develop a Progressive Web Application for [Application Type] targeting [Platform/Users].

PWA Development Framework:

1. **Core PWA Features:**
   - Service Worker implementation
   - Web App Manifest configuration
   - Offline functionality design
   - Background sync
   - Push notifications

2. **Performance Optimization:**
   - Resource caching strategies
   - Critical resource loading
   - Image optimization
   - Code splitting
   - Runtime performance

3. **User Experience:**
   - App-like navigation
   - Responsive design
   - Touch interactions
   - Loading states
   - Error handling

4. **Native Integration:**
   - Device APIs utilization
   - Hardware access
   - File system integration
   - Camera and media
   - Geolocation services

5. **Distribution & Updates:**
   - App store deployment
   - Update mechanisms
   - Version management
   - Analytics integration
   - Performance monitoring

Application Type: [E-commerce/News/Social/Productivity]
Target Platform: [Mobile/Desktop/Both]
Offline Requirements: [Read-only/Full functionality]
Native Features: [Camera/GPS/Notifications/etc.]
Distribution: [Web only/App stores/Both]`,category:"technology",subcategory:"web-development",difficulty:"advanced",domain:"technology",skillLevel:{technical:"high",complexity:"complex",timeRequired:"long"},tags:["PWA","service workers","offline functionality","mobile web","app-like experience"],estimatedOutputLength:"Long (1800-2800 words)",useCase:"Create web applications with native app experiences and offline capabilities",exampleInput:"Type: Recipe app, Platform: Mobile-first, Offline: Full functionality, Features: Camera for food photos, Distribution: Web + app stores",exampleOutput:"Complete PWA implementation including service worker setup, offline recipe storage, camera integration, and app store deployment guide"},{id:"ecommerce-platform-development",title:"E-commerce Platform Development",description:"Build comprehensive e-commerce solutions with advanced features",content:`You are an E-commerce Developer and Solution Architect. Design a comprehensive e-commerce platform for [Business Type] serving [Market Segment].

E-commerce Platform Framework:

1. **Core Commerce Features:**
   - Product catalog management
   - Shopping cart functionality
   - Checkout process design
   - Payment gateway integration
   - Order management system

2. **User Management:**
   - Customer registration and profiles
   - Authentication and security
   - Wishlist and favorites
   - Order history and tracking
   - Customer support integration

3. **Admin Panel & Management:**
   - Inventory management
   - Order processing
   - Customer management
   - Analytics and reporting
   - Content management

4. **Advanced Features:**
   - Search and filtering
   - Recommendation engine
   - Multi-vendor support
   - Mobile app integration
   - Social commerce features

5. **Business Operations:**
   - Shipping and logistics
   - Tax calculation
   - Multi-currency support
   - Promotions and discounts
   - Return and refund processing

Business Type: [B2C/B2B/Marketplace/Subscription]
Market Segment: [Fashion/Electronics/Services/etc.]
Scale: [Small/Medium/Enterprise]
Geographic Scope: [Local/National/International]
Special Requirements: [Multi-vendor/Subscription/Custom features]`,category:"technology",subcategory:"web-development",difficulty:"expert",domain:"technology",skillLevel:{technical:"expert",complexity:"advanced",timeRequired:"extensive"},tags:["e-commerce","online store","payment processing","inventory management","marketplace"],estimatedOutputLength:"Very Long (3000-4000 words)",useCase:"Develop complete e-commerce platforms for online businesses",exampleInput:"Type: B2C marketplace, Segment: Handmade crafts, Scale: Medium, Scope: National, Requirements: Multi-vendor + subscription boxes",exampleOutput:"Complete e-commerce solution including marketplace architecture, vendor management, subscription system, payment processing, and mobile optimization"},{id:"web-performance-optimization",title:"Web Performance Optimization",description:"Optimize web applications for maximum speed and efficiency",content:`You are a Web Performance Expert and Optimization Specialist. Analyze and optimize [Website/Application] to achieve [Performance Goals].

Performance Optimization Framework:

1. **Performance Audit:**
   - Core Web Vitals assessment
   - Loading performance analysis
   - Runtime performance evaluation
   - Network optimization review
   - Accessibility audit

2. **Loading Optimization:**
   - Critical resource prioritization
   - Code splitting implementation
   - Lazy loading strategies
   - Resource compression
   - CDN optimization

3. **Runtime Optimization:**
   - JavaScript optimization
   - CSS performance
   - Image optimization
   - Memory management
   - Rendering optimization

4. **Caching Strategies:**
   - Browser caching
   - Service Worker caching
   - API response caching
   - Static asset caching
   - Database query optimization

5. **Monitoring & Measurement:**
   - Performance monitoring setup
   - Real User Monitoring (RUM)
   - Synthetic testing
   - Performance budgets
   - Continuous optimization

Website Type: [E-commerce/Blog/SPA/Corporate]
Current Performance: [Load time/Core Web Vitals scores]
Performance Goals: [Target metrics]
User Base: [Geographic distribution/Device types]
Technology Stack: [Current technologies used]`,category:"technology",subcategory:"web-development",difficulty:"advanced",domain:"technology",skillLevel:{technical:"expert",complexity:"complex",timeRequired:"long"},tags:["web performance","optimization","Core Web Vitals","loading speed","user experience"],estimatedOutputLength:"Long (2000-3000 words)",useCase:"Improve website performance and user experience through systematic optimization",exampleInput:"Type: E-commerce SPA, Current: 4s load time, Goals: <2s load + 90+ Lighthouse scores, Users: Global mobile-heavy, Stack: React + Node.js",exampleOutput:"Comprehensive optimization plan including code splitting, image optimization, caching strategies, and performance monitoring implementation"},{id:"web-accessibility-implementation",title:"Web Accessibility (WCAG) Implementation",description:"Make web applications accessible to users with disabilities",content:`You are a Web Accessibility Expert and Inclusive Design Specialist. Implement comprehensive accessibility features for [Website/Application] to meet [WCAG Level] standards.

Web Accessibility Framework:

1. **Accessibility Audit:**
   - Current accessibility assessment
   - WCAG compliance evaluation
   - User testing with assistive technologies
   - Accessibility barrier identification
   - Legal compliance review

2. **Semantic HTML & Structure:**
   - Proper heading hierarchy
   - Semantic markup implementation
   - Landmark regions
   - Skip navigation links
   - Focus management

3. **Interactive Elements:**
   - Keyboard navigation
   - Focus indicators
   - ARIA labels and roles
   - Form accessibility
   - Modal and dialog accessibility

4. **Content Accessibility:**
   - Alternative text for images
   - Video captions and transcripts
   - Color contrast compliance
   - Text resizing support
   - Plain language guidelines

5. **Testing & Validation:**
   - Automated testing setup
   - Manual testing procedures
   - Screen reader testing
   - User acceptance testing
   - Ongoing monitoring

Website Type: [Corporate/E-commerce/Educational/Government]
WCAG Level: [A/AA/AAA]
User Base: [Specific accessibility needs]
Current Status: [Accessibility maturity level]
Compliance Deadline: [Legal requirements]`,category:"technology",subcategory:"web-development",difficulty:"advanced",domain:"technology",skillLevel:{technical:"high",complexity:"complex",timeRequired:"long"},tags:["web accessibility","WCAG","inclusive design","assistive technology","compliance"],estimatedOutputLength:"Long (1800-2500 words)",useCase:"Ensure web applications are accessible to all users including those with disabilities",exampleInput:"Type: Government portal, WCAG: AA compliance, Users: Citizens with various disabilities, Status: Basic compliance, Deadline: 6 months",exampleOutput:"Complete accessibility implementation plan including WCAG compliance roadmap, testing procedures, and assistive technology optimization"}],n={id:"technology",name:"Technology & Development",icon:"💻",description:"Programming, AI/ML, software development, and technical architecture templates",color:"#10B981",domain:"technology",subcategories:[{id:"programming",name:"Programming & Software Development",description:"Code review, algorithm optimization, system design, and software architecture",templates:e},{id:"ai-ml",name:"AI & Machine Learning",description:"ML model development, prompt engineering, and AI system design",templates:i},{id:"web-development",name:"Web Development",description:"Frontend and backend development, frameworks, and web architecture",templates:t}]};export{n as technologyTemplates};
