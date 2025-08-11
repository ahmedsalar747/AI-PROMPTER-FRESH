import { Template, TemplateCategory } from './index';

const curriculumTemplates: Template[] = [
  {
    id: 'curriculum-design-framework',
    title: 'Comprehensive Curriculum Design',
    description: 'Complete curriculum development framework for educational programs',
    content: `You are a Curriculum Designer. Develop comprehensive curriculum for [Subject/Program] targeting [Student Level].

Curriculum Design Framework:

1. **Needs Assessment & Analysis:**
   - Learner characteristics and needs analysis
   - Stakeholder requirements gathering
   - Industry and market demands assessment
   - Gap analysis of existing programs
   - Resource and constraint evaluation

2. **Learning Objectives & Outcomes:**
   - Program-level learning outcomes
   - Course-level objectives alignment
   - Bloom's taxonomy integration
   - Skills and competency mapping
   - Assessment criteria development

3. **Content Structure & Sequencing:**
   - Knowledge domain organization
   - Logical progression and prerequisites
   - Module and unit breakdown
   - Interdisciplinary connections
   - Scope and sequence planning

4. **Implementation Strategy:**
   - Delivery methods and modalities
   - Resource requirements and allocation
   - Technology integration plan
   - Timeline and milestone planning
   - Quality assurance procedures

Program Details:
- Subject Area: [Mathematics/Science/Language Arts/Professional]
- Student Level: [Elementary/Secondary/Higher Education/Professional]
- Duration: [Semester/Year/Multi-year Program]
- Delivery Mode: [In-person/Online/Blended]
- Accreditation: [Standards/Requirements]`,
    category: 'education',
    subcategory: 'curriculum',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['curriculum design', 'educational planning', 'learning outcomes', 'program development'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Design comprehensive educational curricula and programs',
    exampleInput: 'Subject: Data Science, Level: University undergraduate, Duration: 4-year degree',
    exampleOutput: 'Complete curriculum with learning outcomes, content structure, and implementation plan'
  },
  {
    id: 'course-development',
    title: 'Course Development & Design',
    description: 'Individual course creation with learning objectives and content mapping',
    content: `You are an Instructional Designer. Develop course for [Course Title] in [Subject Area].

Course Development Framework:

1. **Course Foundation:**
   - Course description and rationale
   - Learning objectives and outcomes
   - Prerequisite knowledge and skills
   - Target audience analysis
   - Course duration and credit hours

2. **Content Organization:**
   - Unit and lesson structure
   - Topic sequencing and flow
   - Content depth and breadth
   - Key concepts and themes
   - Supplementary materials

3. **Learning Activities & Assessments:**
   - Active learning strategies
   - Formative assessment design
   - Summative evaluation methods
   - Project and assignment planning
   - Participation and engagement

4. **Resource Development:**
   - Reading assignments and materials
   - Multimedia content creation
   - Technology tool integration
   - Guest speaker coordination
   - Field experience planning

Course Specifications:
- Title: [Course Name]
- Subject: [Academic Discipline]
- Level: [Introductory/Intermediate/Advanced]
- Credits: [Credit Hours/Units]
- Format: [Lecture/Lab/Seminar/Online]`,
    category: 'education',
    subcategory: 'curriculum',
    difficulty: 'advanced',
    domain: 'education',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['course design', 'instructional design', 'lesson planning', 'educational content'],
    estimatedOutputLength: 'Long (2000+ words)',
    useCase: 'Develop individual courses with detailed content and assessment plans',
    exampleInput: 'Title: Introduction to Psychology, Subject: Psychology, Level: Introductory, Credits: 3',
    exampleOutput: 'Complete course design with objectives, content outline, and assessment strategy'
  },
  {
    id: 'learning-pathway-design',
    title: 'Learning Pathway & Progression Design',
    description: 'Design structured learning pathways with skill progression and competency development',
    content: `You are a Learning Pathway Designer. Create learning pathway for [Skill/Competency Area] targeting [Learner Profile].

Learning Pathway Framework:

1. **Pathway Structure:**
   - Entry point assessment and prerequisites
   - Learning milestone identification
   - Progressive skill development stages
   - Competency level definitions
   - Exit criteria and outcomes

2. **Content Mapping:**
   - Knowledge and skill taxonomy
   - Learning resource allocation
   - Activity and experience design
   - Assessment checkpoint integration
   - Remediation and acceleration options

3. **Personalization Features:**
   - Individual learning style accommodation
   - Adaptive content delivery
   - Flexible pacing options
   - Choice and autonomy integration
   - Interest-based customization

4. **Support Systems:**
   - Mentoring and coaching integration
   - Peer collaboration opportunities
   - Progress tracking and feedback
   - Resource library and tools
   - Community and networking

Pathway Context:
- Skill Area: [Technical/Professional/Academic/Personal]
- Learner Profile: [Age/Background/Experience level]
- Duration: [Weeks/Months/Years/Ongoing]
- Delivery: [Self-paced/Cohort/Blended]
- Certification: [Badge/Certificate/Degree/Portfolio]`,
    category: 'education',
    subcategory: 'curriculum',
    difficulty: 'advanced',
    domain: 'education',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['learning pathways', 'competency development', 'skill progression', 'personalized learning'],
    estimatedOutputLength: 'Long (2200+ words)',
    useCase: 'Design structured learning pathways for skill and competency development',
    exampleInput: 'Skill: Digital marketing, Profile: Working professionals, Duration: 6 months, Delivery: Self-paced',
    exampleOutput: 'Complete learning pathway with progression stages, content mapping, and support systems'
  },
  {
    id: 'interdisciplinary-curriculum',
    title: 'Interdisciplinary Curriculum Integration',
    description: 'Design integrated curricula that connect multiple disciplines and real-world applications',
    content: `You are an Interdisciplinary Education Specialist. Design integrated curriculum connecting [Primary Discipline] with [Secondary Disciplines].

Interdisciplinary Framework:

1. **Integration Strategy:**
   - Disciplinary connection mapping
   - Common themes and concepts identification
   - Cross-curricular learning outcomes
   - Real-world problem integration
   - 21st-century skills emphasis

2. **Curriculum Architecture:**
   - Thematic unit organization
   - Project-based learning design
   - Collaborative assessment planning
   - Resource sharing strategies
   - Timeline coordination

3. **Teaching Collaboration:**
   - Team teaching models
   - Professional development planning
   - Communication and planning protocols
   - Role and responsibility definition
   - Conflict resolution strategies

4. **Assessment Integration:**
   - Authentic assessment design
   - Portfolio development
   - Performance task creation
   - Peer and self-assessment
   - Reflection and metacognition

Integration Details:
- Primary Discipline: [Subject/Field]
- Secondary Disciplines: [Related fields/subjects]
- Grade Level: [K-12/Higher education/Adult]
- Integration Scope: [Unit/Course/Program]
- Real-world Application: [Community/Industry/Global issues]`,
    category: 'education',
    subcategory: 'curriculum',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['interdisciplinary education', 'integrated curriculum', 'cross-curricular', 'project-based learning'],
    estimatedOutputLength: 'Very Long (2400+ words)',
    useCase: 'Create integrated curricula that connect multiple disciplines for deeper learning',
    exampleInput: 'Primary: Environmental science, Secondary: Chemistry + Policy + Economics, Level: High school',
    exampleOutput: 'Complete interdisciplinary curriculum with integration strategy, collaboration framework, and assessment plan'
  },
  {
    id: 'competency-based-curriculum',
    title: 'Competency-Based Education Design',
    description: 'Design competency-based curricula focused on mastery and skill demonstration',
    content: `You are a Competency-Based Education Designer. Create competency framework for [Program/Subject] with [Target Competencies].

Competency-Based Framework:

1. **Competency Definition:**
   - Core competency identification
   - Performance standard development
   - Evidence requirement specification
   - Mastery criteria establishment
   - Progression level definition

2. **Learning Experience Design:**
   - Authentic task development
   - Multiple pathway creation
   - Flexible pacing implementation
   - Real-world application integration
   - Continuous feedback mechanisms

3. **Assessment Strategy:**
   - Performance-based assessment design
   - Portfolio evidence collection
   - Competency demonstration methods
   - Mastery verification procedures
   - Remediation and advancement planning

4. **System Implementation:**
   - Learning management integration
   - Progress tracking systems
   - Credential and badge design
   - Student support services
   - Faculty training and development

Competency Context:
- Program: [Academic/Professional/Technical/Skills-based]
- Target Competencies: [Knowledge/Skills/Abilities]
- Learner Population: [Age/Background/Goals]
- Assessment Type: [Formative/Summative/Authentic]
- Credentialing: [Certificate/Badge/Degree/Portfolio]`,
    category: 'education',
    subcategory: 'curriculum',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['competency-based education', 'mastery learning', 'performance assessment', 'skills development'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Design competency-based educational programs focused on mastery and skill demonstration',
    exampleInput: 'Program: Nursing education, Competencies: Clinical skills + critical thinking, Population: Adult learners',
    exampleOutput: 'Complete competency-based curriculum with framework, assessment strategy, and implementation plan'
  }
];

const instructionalTemplates: Template[] = [
  {
    id: 'instructional-strategy-design',
    title: 'Instructional Strategy & Method Design',
    description: 'Evidence-based instructional methods and teaching strategies',
    content: `You are an Educational Methodologist. Design instructional strategy for [Learning Objective/Topic].

Instructional Strategy Framework:

1. **Learning Theory Foundation:**
   - Pedagogical approach selection
   - Learning theory integration
   - Cognitive load consideration
   - Motivation and engagement principles
   - Individual difference accommodation

2. **Teaching Method Selection:**
   - Direct instruction strategies
   - Collaborative learning approaches
   - Problem-based learning design
   - Inquiry-based methods
   - Technology-enhanced instruction

3. **Activity Design & Sequencing:**
   - Opening and engagement activities
   - Content delivery strategies
   - Practice and application exercises
   - Closure and reflection activities
   - Transfer and generalization

4. **Differentiation & Adaptation:**
   - Learning style accommodations
   - Multiple intelligence integration
   - Special needs considerations
   - Cultural responsiveness
   - Remediation and enrichment

Instructional Context:
- Learning Objective: [Specific Goal/Skill]
- Subject Area: [Academic Discipline]
- Student Population: [Age/Grade/Demographics]
- Setting: [Classroom/Online/Field]
- Time Allocation: [Lesson/Unit Duration]`,
    category: 'education',
    subcategory: 'instruction',
    difficulty: 'advanced',
    domain: 'education',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['instructional methods', 'teaching strategies', 'pedagogical approaches', 'learning design'],
    estimatedOutputLength: 'Long (1800+ words)',
    useCase: 'Design effective instructional strategies and teaching methods',
    exampleInput: 'Objective: Critical thinking skills, Subject: History, Population: High school students',
    exampleOutput: 'Complete instructional strategy with methods, activities, and differentiation'
  },
  {
    id: 'online-learning-design',
    title: 'Online Learning Experience Design',
    description: 'Digital learning environment and e-learning course design',
    content: `You are an E-Learning Designer. Create online learning experience for [Course/Program].

Online Learning Design Framework:

1. **Digital Learning Environment:**
   - Platform selection and setup
   - User interface and navigation design
   - Accessibility and usability standards
   - Mobile responsiveness
   - Technical requirements

2. **Content Development:**
   - Multimedia content creation
   - Interactive element design
   - Video and audio production
   - Text-based materials
   - Resource library organization

3. **Engagement & Interaction:**
   - Synchronous session planning
   - Asynchronous discussion design
   - Peer collaboration activities
   - Virtual reality/simulation integration
   - Gamification elements

4. **Support & Community:**
   - Student support systems
   - Instructor presence strategies
   - Online community building
   - Technical support resources
   - Communication protocols

Course Parameters:
- Subject: [Academic/Professional Content]
- Duration: [Weeks/Months]
- Audience: [Students/Professionals/General Public]
- Platform: [LMS/Custom/MOOC]
- Interaction Level: [Self-paced/Facilitated/Cohort]`,
    category: 'education',
    subcategory: 'instruction',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['online learning', 'e-learning design', 'digital education', 'educational technology'],
    estimatedOutputLength: 'Very Long (2200+ words)',
    useCase: 'Design comprehensive online learning experiences and courses',
    exampleInput: 'Subject: Project management, Duration: 8 weeks, Audience: Working professionals',
    exampleOutput: 'Complete online course design with platform setup and engagement strategies'
  },
  {
    id: 'active-learning-strategies',
    title: 'Active Learning & Student Engagement',
    description: 'Design active learning strategies to maximize student engagement and participation',
    content: `You are an Active Learning Specialist. Design engagement strategies for [Subject/Course] with [Student Population].

Active Learning Framework:

1. **Engagement Strategy Design:**
   - Active participation techniques
   - Collaborative learning structures
   - Problem-solving activities
   - Discussion and debate formats
   - Hands-on learning experiences

2. **Interactive Learning Activities:**
   - Think-pair-share protocols
   - Jigsaw and cooperative learning
   - Case study analysis
   - Role-playing and simulations
   - Peer teaching opportunities

3. **Technology Integration:**
   - Interactive polling and quizzes
   - Digital collaboration tools
   - Virtual laboratories and simulations
   - Augmented and virtual reality
   - Mobile learning applications

4. **Assessment of Engagement:**
   - Participation measurement tools
   - Engagement analytics
   - Student feedback collection
   - Behavioral observation protocols
   - Motivation and satisfaction surveys

Learning Context:
- Subject: [STEM/Humanities/Social Sciences/Professional]
- Student Level: [K-12/Undergraduate/Graduate/Adult]
- Class Size: [Small/Medium/Large/Online]
- Setting: [Traditional/Flipped/Hybrid/Remote]
- Duration: [Single lesson/Unit/Course/Program]`,
    category: 'education',
    subcategory: 'instruction',
    difficulty: 'advanced',
    domain: 'education',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['active learning', 'student engagement', 'participatory learning', 'interactive instruction'],
    estimatedOutputLength: 'Long (2000+ words)',
    useCase: 'Design active learning strategies to increase student engagement and participation',
    exampleInput: 'Subject: Biology, Level: Undergraduate, Size: Large lecture, Setting: Hybrid, Duration: Semester course',
    exampleOutput: 'Complete active learning strategy with engagement techniques, activities, and assessment methods'
  },
  {
    id: 'differentiated-instruction',
    title: 'Differentiated Instruction Design',
    description: 'Create differentiated instruction to meet diverse learning needs and abilities',
    content: `You are a Differentiated Instruction Specialist. Design differentiation strategy for [Subject/Topic] accommodating [Learner Diversity].

Differentiation Framework:

1. **Learner Profile Analysis:**
   - Learning style identification
   - Multiple intelligence assessment
   - Readiness level evaluation
   - Interest and motivation mapping
   - Cultural and linguistic considerations

2. **Content Differentiation:**
   - Multiple representation formats
   - Varied complexity levels
   - Choice in learning materials
   - Adaptive content delivery
   - Scaffolding and support structures

3. **Process Differentiation:**
   - Flexible grouping strategies
   - Varied instructional methods
   - Choice in learning activities
   - Multiple pathways to learning
   - Pace and timing adjustments

4. **Product Differentiation:**
   - Multiple assessment options
   - Choice in demonstration methods
   - Varied output formats
   - Personalized learning goals
   - Alternative evaluation criteria

Differentiation Context:
- Subject Area: [Core academic/Elective/Special area]
- Student Diversity: [Learning differences/Language/Culture/Ability]
- Grade Level: [Elementary/Middle/High school/Adult]
- Class Composition: [Inclusive/Special needs/Gifted/Mixed]
- Resources: [Technology/Materials/Support staff]`,
    category: 'education',
    subcategory: 'instruction',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['differentiated instruction', 'inclusive education', 'personalized learning', 'diverse learners'],
    estimatedOutputLength: 'Very Long (2300+ words)',
    useCase: 'Design differentiated instruction to meet diverse learning needs and maximize student success',
    exampleInput: 'Subject: Mathematics, Diversity: Mixed ability + ELL students, Level: Middle school, Composition: Inclusive classroom',
    exampleOutput: 'Complete differentiation strategy with content, process, and product modifications for diverse learners'
  },
  {
    id: 'experiential-learning-design',
    title: 'Experiential Learning & Field Education',
    description: 'Design experiential learning programs that connect classroom theory with real-world practice',
    content: `You are an Experiential Learning Coordinator. Design experiential program for [Academic Program] connecting [Theory] with [Practice].

Experiential Learning Framework:

1. **Experience Design:**
   - Learning experience identification
   - Real-world connection establishment
   - Community partnership development
   - Site selection and preparation
   - Safety and risk management

2. **Learning Integration:**
   - Theory-practice connection
   - Reflection and processing activities
   - Learning objective alignment
   - Skill transfer facilitation
   - Critical thinking promotion

3. **Support Structure:**
   - Mentor and supervisor training
   - Student preparation and orientation
   - Ongoing support and check-ins
   - Problem-solving protocols
   - Emergency and contingency planning

4. **Assessment & Evaluation:**
   - Performance evaluation criteria
   - Reflection and portfolio requirements
   - Competency demonstration methods
   - Feedback collection systems
   - Program improvement processes

Experience Context:
- Program Type: [Internship/Service learning/Clinical/Field work]
- Academic Field: [Professional/Liberal arts/Technical/Applied]
- Student Level: [Undergraduate/Graduate/Professional]
- Duration: [Short-term/Semester/Year-long]
- Setting: [Community/Industry/Healthcare/Education]`,
    category: 'education',
    subcategory: 'instruction',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['experiential learning', 'field education', 'service learning', 'practical application'],
    estimatedOutputLength: 'Very Long (2400+ words)',
    useCase: 'Design experiential learning programs that bridge academic theory and real-world practice',
    exampleInput: 'Program: Social work field placement, Theory: Community organizing, Practice: Nonprofit organizations, Level: Graduate',
    exampleOutput: 'Complete experiential learning program with experience design, integration activities, and assessment framework'
  }
];

const assessmentTemplates: Template[] = [
  {
    id: 'assessment-strategy-design',
    title: 'Comprehensive Assessment Strategy',
    description: 'Holistic assessment and evaluation framework for learning measurement',
    content: `You are an Assessment Specialist. Design assessment strategy for [Course/Program/Learning Objectives].

Assessment Strategy Framework:

1. **Assessment Philosophy & Alignment:**
   - Assessment purpose and goals
   - Learning outcome alignment
   - Formative vs summative balance
   - Authentic assessment integration
   - Equity and fairness considerations

2. **Assessment Method Design:**
   - Traditional assessment tools
   - Performance-based assessments
   - Portfolio and reflection methods
   - Peer and self-assessment strategies
   - Technology-enhanced assessment

3. **Feedback & Evaluation:**
   - Timely and specific feedback protocols
   - Rubric and criteria development
   - Grading and scoring systems
   - Progress monitoring procedures
   - Improvement and remediation planning

4. **Quality Assurance:**
   - Validity and reliability measures
   - Bias detection and mitigation
   - Accessibility accommodations
   - Inter-rater reliability protocols
   - Assessment review and revision

Assessment Context:
- Learning Level: [Course/Program/Institutional]
- Subject Area: [Academic discipline or field]
- Student Population: [Age/Grade/Demographics]
- Assessment Purpose: [Diagnostic/Formative/Summative/Evaluation]
- Stakes: [Low/Moderate/High stakes assessment]`,
    category: 'education',
    subcategory: 'assessment',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['assessment design', 'evaluation methods', 'learning measurement', 'educational testing'],
    estimatedOutputLength: 'Very Long (2400+ words)',
    useCase: 'Design comprehensive assessment strategies for effective learning measurement',
    exampleInput: 'Context: University chemistry course, Purpose: Formative + summative, Population: Science majors',
    exampleOutput: 'Complete assessment strategy with methods, feedback systems, and quality assurance'
  },
  {
    id: 'authentic-assessment-design',
    title: 'Authentic Assessment & Performance Tasks',
    description: 'Design authentic assessments that mirror real-world applications and demonstrate meaningful learning',
    content: `You are an Authentic Assessment Designer. Create authentic assessment for [Learning Domain] that demonstrates [Real-world Application].

Authentic Assessment Framework:

1. **Real-world Context:**
   - Professional scenario identification
   - Authentic problem definition
   - Industry standard integration
   - Community connection establishment
   - Stakeholder involvement planning

2. **Performance Task Design:**
   - Complex problem-solving tasks
   - Multiple solution pathways
   - Collaborative elements
   - Technology integration
   - Time and resource management

3. **Assessment Criteria:**
   - Performance rubric development
   - Quality standard definition
   - Professional competency alignment
   - Process and product evaluation
   - Self and peer assessment integration

4. **Implementation & Support:**
   - Student preparation and scaffolding
   - Resource and tool provision
   - Mentoring and coaching support
   - Progress monitoring systems
   - Reflection and metacognition

Assessment Details:
- Domain: [Academic/Professional/Technical/Creative]
- Application: [Workplace/Community/Industry/Research]
- Complexity: [Moderate/High/Expert level]
- Duration: [Single task/Extended project/Portfolio]
- Collaboration: [Individual/Team/Community-based]`,
    category: 'education',
    subcategory: 'assessment',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['authentic assessment', 'performance tasks', 'real-world application', 'meaningful assessment'],
    estimatedOutputLength: 'Very Long (2300+ words)',
    useCase: 'Design authentic assessments that demonstrate real-world application of learning',
    exampleInput: 'Domain: Engineering design, Application: Sustainable technology solutions, Complexity: High, Duration: Semester project',
    exampleOutput: 'Complete authentic assessment with real-world context, performance tasks, and evaluation criteria'
  },
  {
    id: 'formative-assessment-system',
    title: 'Formative Assessment & Feedback System',
    description: 'Create comprehensive formative assessment systems for ongoing learning improvement',
    content: `You are a Formative Assessment Expert. Design formative assessment system for [Course/Unit] focusing on [Learning Improvement].

Formative Assessment Framework:

1. **Assessment for Learning:**
   - Learning progression mapping
   - Success criteria clarification
   - Student self-assessment training
   - Goal setting and monitoring
   - Learning gap identification

2. **Feedback Strategy:**
   - Timely feedback delivery
   - Specific and actionable guidance
   - Feed-forward strategies
   - Peer feedback integration
   - Technology-enhanced feedback

3. **Data Collection & Analysis:**
   - Multiple evidence sources
   - Quick assessment techniques
   - Digital tool integration
   - Data visualization and interpretation
   - Pattern recognition and response

4. **Adjustment & Improvement:**
   - Instructional adjustment protocols
   - Personalized learning pathways
   - Remediation and enrichment planning
   - Continuous improvement cycles
   - Student agency development

System Context:
- Educational Level: [K-12/Higher education/Professional]
- Subject Focus: [Core academic/Skills-based/Competency]
- Technology Integration: [Digital tools/Traditional/Blended]
- Frequency: [Daily/Weekly/Unit-based/Ongoing]
- Purpose: [Learning improvement/Motivation/Self-regulation]`,
    category: 'education',
    subcategory: 'assessment',
    difficulty: 'advanced',
    domain: 'education',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['formative assessment', 'feedback systems', 'learning improvement', 'assessment for learning'],
    estimatedOutputLength: 'Long (2100+ words)',
    useCase: 'Create formative assessment systems that enhance learning through ongoing feedback and adjustment',
    exampleInput: 'Course: High school algebra, Focus: Mathematical reasoning, Technology: Digital platform, Frequency: Daily check-ins',
    exampleOutput: 'Complete formative assessment system with feedback strategies, data collection, and improvement protocols'
  },
  {
    id: 'portfolio-assessment-framework',
    title: 'Portfolio Assessment & Reflection',
    description: 'Design portfolio-based assessment systems that showcase learning growth and reflection',
    content: `You are a Portfolio Assessment Specialist. Design portfolio system for [Learning Context] showcasing [Growth Areas].

Portfolio Assessment Framework:

1. **Portfolio Structure:**
   - Purpose and audience definition
   - Content selection criteria
   - Organization and navigation design
   - Technology platform selection
   - Privacy and sharing protocols

2. **Evidence Collection:**
   - Artifact type identification
   - Quality standard establishment
   - Documentation requirements
   - Multimedia integration
   - Progressive evidence gathering

3. **Reflection & Metacognition:**
   - Reflection prompt development
   - Metacognitive strategy training
   - Growth documentation procedures
   - Self-assessment integration
   - Goal setting and revision

4. **Evaluation & Feedback:**
   - Holistic evaluation criteria
   - Growth-focused rubrics
   - Peer review protocols
   - Mentor feedback systems
   - Celebration and recognition

Portfolio Context:
- Purpose: [Learning/Assessment/Showcase/Professional]
- Audience: [Self/Instructor/Peers/Employers/Public]
- Content Type: [Academic work/Projects/Reflections/Media]
- Duration: [Course/Program/Career-long]
- Platform: [Digital/Physical/Hybrid portfolio]`,
    category: 'education',
    subcategory: 'assessment',
    difficulty: 'advanced',
    domain: 'education',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['portfolio assessment', 'reflection', 'learning documentation', 'growth measurement'],
    estimatedOutputLength: 'Long (2000+ words)',
    useCase: 'Design portfolio assessment systems that document and showcase learning growth over time',
    exampleInput: 'Context: Teacher education program, Growth: Professional development, Purpose: Learning + showcase, Platform: Digital',
    exampleOutput: 'Complete portfolio assessment framework with structure, reflection protocols, and evaluation criteria'
  },
  {
    id: 'competency-assessment-framework',
    title: 'Competency-Based Assessment & Credentialing',
    description: 'Design competency assessment systems for skill validation and professional credentialing',
    content: `You are a Competency Assessment Expert. Design competency assessment for [Professional/Academic Competency] with [Validation Requirements].

Competency Assessment Framework:

1. **Competency Definition & Standards:**
   - Competency framework development
   - Performance indicator specification
   - Skill level progression
   - Behavioral indicator development
   - Knowledge, skills, abilities (KSA) analysis
   - Professional standard alignment

2. **Assessment Method Design:**
   - Direct observation protocols
   - Simulation and scenario-based assessment
   - Work sample evaluation
   - Peer and supervisor feedback
   - Self-reflection and analysis

3. **Evidence Collection & Documentation:**
   - Portfolio development guidelines
   - Evidence quality standards
   - Documentation requirements
   - Digital badge integration
   - Competency tracking systems

4. **Validation & Credentialing:**
   - Assessment validity and reliability
   - Inter-rater reliability protocols
   - Credential pathways
   - Continuing education requirements
   - Professional recognition systems

Competency Details:
- Competency Area: [Professional/Academic/Technical]
- Industry Context: [Workplace/Educational/Certification]
- Proficiency Levels: [Novice/Competent/Proficient/Expert]
- Assessment Stakes: [Certification/Graduation/Employment]
- Validation Requirements: [External/Internal/Peer Review]`,
    category: 'education',
    subcategory: 'assessment',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['competency assessment', 'skills evaluation', 'professional certification', 'performance measurement'],
    estimatedOutputLength: 'Very Long (2400+ words)',
    useCase: 'Design competency-based assessment systems for professional and academic contexts',
    exampleInput: 'Area: Digital literacy, Context: Higher education, Levels: Basic to advanced',
    exampleOutput: 'Complete competency assessment framework with evidence collection and validation'
  }
];

const researchTemplates: Template[] = [
  {
    id: 'educational-research-design',
    title: 'Educational Research Study Design',
    description: 'Comprehensive educational research methodology and study design',
    content: `You are an Educational Researcher. Design research study for [Educational Research Question/Problem].

Educational Research Framework:

1. **Research Problem & Questions:**
   - Problem identification and significance
   - Research question formulation
   - Hypothesis development
   - Literature review synthesis
   - Theoretical framework selection

2. **Research Design & Methodology:**
   - Quantitative, qualitative, or mixed methods
   - Experimental vs non-experimental design
   - Participant selection and sampling
   - Data collection methods
   - Instrumentation and measurement

3. **Data Analysis & Interpretation:**
   - Statistical analysis planning
   - Qualitative data analysis approach
   - Validity and reliability considerations
   - Bias minimization strategies
   - Result interpretation framework

4. **Implementation & Dissemination:**
   - Ethical considerations and IRB approval
   - Timeline and resource planning
   - Data management protocols
   - Publication and presentation strategy
   - Practical application implications

Research Parameters:
- Research Type: [Experimental/Quasi-experimental/Descriptive/Exploratory]
- Educational Level: [K-12/Higher Education/Adult Learning]
- Focus Area: [Pedagogy/Curriculum/Technology/Assessment]
- Duration: [Short-term/Longitudinal]
- Scope: [Classroom/School/District/Multi-site]`,
    category: 'education',
    subcategory: 'research',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['educational research', 'research methodology', 'data analysis', 'academic research'],
    estimatedOutputLength: 'Very Long (2600+ words)',
    useCase: 'Design rigorous educational research studies and investigations',
    exampleInput: 'Question: Impact of flipped classroom on student engagement, Level: University',
    exampleOutput: 'Complete research design with methodology, analysis plan, and implementation strategy'
  },
  {
    id: 'program-evaluation-study',
    title: 'Educational Program Evaluation',
    description: 'Comprehensive evaluation framework for educational programs and interventions',
    content: `You are a Program Evaluator. Design evaluation study for [Educational Program/Intervention].

Program Evaluation Framework:

1. **Evaluation Planning:**
   - Evaluation purpose and stakeholders
   - Evaluation questions development
   - Logic model creation
   - Evaluation design selection
   - Resource and timeline planning

2. **Data Collection Strategy:**
   - Multiple data source identification
   - Quantitative and qualitative measures
   - Baseline and outcome data planning
   - Data collection instrument development
   - Participant recruitment strategy

3. **Analysis & Reporting:**
   - Data analysis methodology
   - Statistical and thematic analysis
   - Cost-effectiveness evaluation
   - Report structure and format
   - Stakeholder communication plan

4. **Utilization & Improvement:**
   - Findings application strategy
   - Program improvement recommendations
   - Policy implications
   - Sustainability planning
   - Continuous monitoring system

Evaluation Context:
- Program Type: [Curriculum/Intervention/Policy/Technology]
- Educational Setting: [School/District/State/National]
- Evaluation Purpose: [Improvement/Accountability/Research]
- Stakeholders: [Educators/Administrators/Policymakers/Community]
- Timeline: [Formative/Summative/Ongoing]`,
    category: 'education',
    subcategory: 'research',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['program evaluation', 'educational assessment', 'impact measurement', 'evaluation research'],
    estimatedOutputLength: 'Very Long (2500+ words)',
    useCase: 'Evaluate educational programs and interventions for effectiveness and improvement',
    exampleInput: 'Program: STEM enrichment program, Setting: Elementary schools, Purpose: Improvement',
    exampleOutput: 'Complete evaluation design with data collection, analysis, and reporting plan'
  },
  {
    id: 'action-research-methodology',
    title: 'Educational Action Research',
    description: 'Design action research projects for educational improvement and professional development',
    content: `You are an Action Research Facilitator. Design action research project for [Educational Issue/Challenge] in [Educational Setting].

Action Research Framework:

1. **Problem Identification:**
   - Current situation analysis
   - Problem definition and scope
   - Stakeholder identification
   - Root cause exploration
   - Research question formulation

2. **Action Planning:**
   - Intervention design and selection
   - Resource requirement assessment
   - Timeline and milestone planning
   - Collaboration and partnership
   - Risk assessment and mitigation

3. **Implementation & Data Collection:**
   - Action implementation protocols
   - Data collection methods
   - Progress monitoring systems
   - Adjustment and adaptation procedures
   - Reflection and documentation

4. **Evaluation & Reflection:**
   - Data analysis and interpretation
   - Impact assessment
   - Learning and insight development
   - Next cycle planning
   - Knowledge sharing and dissemination

Research Context:
- Issue/Challenge: [Instructional/Administrative/Systemic]
- Setting: [Classroom/School/District/Organization]
- Participants: [Teachers/Students/Administrators/Community]
- Duration: [Single cycle/Multiple cycles/Ongoing]
- Scope: [Small scale/Medium/Large-scale change]`,
    category: 'education',
    subcategory: 'research',
    difficulty: 'advanced',
    domain: 'education',
    skillLevel: {
      technical: 'high',
      complexity: 'complex',
      timeRequired: 'long'
    },
    tags: ['action research', 'educational improvement', 'professional development', 'reflective practice'],
    estimatedOutputLength: 'Long (2200+ words)',
    useCase: 'Design action research projects for educational improvement and professional learning',
    exampleInput: 'Issue: Low student engagement in mathematics, Setting: Middle school classroom, Participants: Teacher + students',
    exampleOutput: 'Complete action research plan with problem analysis, intervention design, and evaluation framework'
  },
  {
    id: 'learning-analytics-research',
    title: 'Learning Analytics & Educational Data Science',
    description: 'Design research studies using learning analytics and educational data science methods',
    content: `You are a Learning Analytics Researcher. Design analytics study for [Educational Question] using [Data Sources/Methods].

Learning Analytics Framework:

1. **Research Design:**
   - Learning analytics question formulation
   - Theoretical framework selection
   - Data mining and analysis approach
   - Privacy and ethics considerations
   - Predictive modeling planning

2. **Data Strategy:**
   - Data source identification and integration
   - Data quality assessment and cleaning
   - Feature engineering and selection
   - Data visualization and exploration
   - Storage and management protocols

3. **Analysis & Modeling:**
   - Statistical analysis methods
   - Machine learning algorithms
   - Pattern recognition techniques
   - Predictive model development
   - Validation and testing procedures

4. **Interpretation & Application:**
   - Result interpretation and contextualization
   - Educational implication development
   - Actionable insight generation
   - Intervention recommendation
   - Continuous monitoring and improvement

Analytics Context:
- Research Question: [Learning/Performance/Engagement/Retention]
- Data Sources: [LMS/Assessment/Behavioral/Administrative]
- Methods: [Descriptive/Predictive/Prescriptive analytics]
- Stakeholders: [Students/Instructors/Administrators/Researchers]
- Application: [Individual/Course/Program/Institutional level]`,
    category: 'education',
    subcategory: 'research',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['learning analytics', 'educational data science', 'predictive modeling', 'educational technology'],
    estimatedOutputLength: 'Very Long (2400+ words)',
    useCase: 'Design learning analytics research to understand and improve educational processes',
    exampleInput: 'Question: Predicting student success in online courses, Data: LMS + demographic, Methods: Machine learning',
    exampleOutput: 'Complete learning analytics research design with data strategy, analysis methods, and application framework'
  },
  {
    id: 'comparative-education-study',
    title: 'Comparative Education Research',
    description: 'Design comparative studies to analyze educational systems, policies, and practices across contexts',
    content: `You are a Comparative Education Researcher. Design comparative study analyzing [Educational Phenomenon] across [Contexts/Systems].

Comparative Education Framework:

1. **Comparative Design:**
   - Research question and hypothesis
   - Context selection and justification
   - Comparative framework development
   - Unit of analysis definition
   - Cross-cultural considerations

2. **Data Collection Strategy:**
   - Multi-site data collection planning
   - Cultural adaptation of instruments
   - Translation and validation procedures
   - Local partnership development
   - Ethical approval across contexts

3. **Analysis & Interpretation:**
   - Cross-cultural analysis methods
   - Contextual factor consideration
   - Pattern identification across sites
   - Cultural interpretation frameworks
   - Generalizability assessment

4. **Synthesis & Implications:**
   - Cross-system learning identification
   - Policy and practice implications
   - Transfer and adaptation guidelines
   - Cultural sensitivity considerations
   - Global education contribution

Study Parameters:
- Phenomenon: [Policy/Practice/Outcome/System feature]
- Contexts: [Countries/Regions/Systems/Institutions]
- Level: [National/Regional/Institutional/Classroom]
- Approach: [Quantitative/Qualitative/Mixed methods]
- Purpose: [Description/Explanation/Policy development]`,
    category: 'education',
    subcategory: 'research',
    difficulty: 'expert',
    domain: 'education',
    skillLevel: {
      technical: 'expert',
      complexity: 'advanced',
      timeRequired: 'extensive'
    },
    tags: ['comparative education', 'international education', 'cross-cultural research', 'educational systems'],
    estimatedOutputLength: 'Very Long (2600+ words)',
    useCase: 'Design comparative education research to analyze and learn from different educational contexts',
    exampleInput: 'Phenomenon: STEM education approaches, Contexts: US vs. Finland vs. Singapore, Level: National policy',
    exampleOutput: 'Complete comparative education study with cross-cultural design, data collection, and analysis framework'
  }
];

export const educationTemplates: TemplateCategory = {
  id: 'education',
  name: 'Education & Training',
  icon: '🎓',
  description: 'Curriculum design, instructional methods, assessment strategies, and educational research',
  color: '#2563EB',
  domain: 'education',
  subcategories: [
    {
      id: 'curriculum',
      name: 'Curriculum Development',
      description: 'Curriculum design, course planning, and educational program development',
      templates: curriculumTemplates
    },
    {
      id: 'instruction',
      name: 'Instructional Design',
      description: 'Teaching methods, learning strategies, and online education design',
      templates: instructionalTemplates
    },
    {
      id: 'assessment',
      name: 'Assessment & Evaluation',
      description: 'Student assessment, competency evaluation, and learning measurement',
      templates: assessmentTemplates
    },
    {
      id: 'research',
      name: 'Educational Research',
      description: 'Educational research design, program evaluation, and academic studies',
      templates: researchTemplates
    }
  ]
}; 