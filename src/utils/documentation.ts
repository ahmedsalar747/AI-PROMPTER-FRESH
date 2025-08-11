/**
 * Documentation utilities for the Prompter Fresh application
 * 
 * This module provides utilities for generating and managing documentation
 * across the application, including JSDoc comments, type definitions, and
 * API documentation.
 * 
 * @module Documentation
 * @version 1.0.0
 * @author Prompter Fresh Team
 */

/**
 * Interface for component documentation
 */
export interface ComponentDoc {
  /** Component name */
  name: string;
  /** Component description */
  description: string;
  /** Component props */
  props?: Record<string, PropDoc>;
  /** Usage examples */
  examples?: string[];
  /** Related components */
  related?: string[];
  /** Version added */
  since?: string;
  /** Deprecation info */
  deprecated?: boolean;
  /** Deprecation message */
  deprecationMessage?: string;
}

/**
 * Interface for prop documentation
 */
export interface PropDoc {
  /** Prop type */
  type: string;
  /** Prop description */
  description: string;
  /** Is prop required */
  required?: boolean;
  /** Default value */
  defaultValue?: any;
  /** Possible values */
  values?: string[];
  /** Version added */
  since?: string;
  /** Deprecation info */
  deprecated?: boolean;
}

/**
 * Interface for API documentation
 */
export interface ApiDoc {
  /** API endpoint name */
  name: string;
  /** API description */
  description: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** API endpoint URL */
  url: string;
  /** Request parameters */
  params?: Record<string, ParamDoc>;
  /** Request body */
  body?: Record<string, ParamDoc>;
  /** Response format */
  response?: Record<string, any>;
  /** Error codes */
  errors?: Record<string, string>;
  /** Usage examples */
  examples?: ApiExample[];
  /** Version added */
  since?: string;
  /** Deprecation info */
  deprecated?: boolean;
}

/**
 * Interface for parameter documentation
 */
export interface ParamDoc {
  /** Parameter type */
  type: string;
  /** Parameter description */
  description: string;
  /** Is parameter required */
  required?: boolean;
  /** Default value */
  defaultValue?: any;
  /** Validation rules */
  validation?: string[];
}

/**
 * Interface for API examples
 */
export interface ApiExample {
  /** Example title */
  title: string;
  /** Example description */
  description: string;
  /** Request example */
  request: any;
  /** Response example */
  response: any;
}

/**
 * Collection of component documentation
 */
export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  ErrorBoundary: {
    name: 'ErrorBoundary',
    description: 'React Error Boundary component that catches JavaScript errors in child components',
    props: {
      children: {
        type: 'ReactNode',
        description: 'Child components to be wrapped',
        required: true
      },
      fallback: {
        type: 'ReactNode',
        description: 'Custom fallback UI to display when an error occurs',
        required: false
      },
      onError: {
        type: '(error: Error, errorInfo: ErrorInfo) => void',
        description: 'Callback function called when an error occurs',
        required: false
      }
    },
    examples: [
      `<ErrorBoundary>
        <YourComponent />
      </ErrorBoundary>`,
      `<ErrorBoundary fallback={<CustomErrorUI />}>
        <YourComponent />
      </ErrorBoundary>`
    ],
    since: '1.0.0'
  },
  
  Dashboard: {
    name: 'Dashboard',
    description: 'Main dashboard component showing user statistics and quick actions',
    props: {},
    examples: [
      '<Dashboard />'
    ],
    since: '1.0.0'
  },
  
  PromptEnhancer: {
    name: 'PromptEnhancer',
    description: 'Component for enhancing user prompts using AI',
    props: {},
    examples: [
      '<PromptEnhancer />'
    ],
    since: '1.0.0'
  }
};

/**
 * Collection of API documentation
 */
export const API_DOCS: Record<string, ApiDoc> = {
  enhancePrompt: {
    name: 'enhancePrompt',
    description: 'Enhances a user prompt using AI models',
    method: 'POST',
    url: '/api/enhance',
    params: {
      userPrompt: {
        type: 'string',
        description: 'The prompt to enhance',
        required: true,
        validation: ['min:1', 'max:5000']
      },
      model: {
        type: 'string',
        description: 'AI model to use',
        required: false,
        defaultValue: 'gpt-3.5-turbo'
      },
      temperature: {
        type: 'number',
        description: 'Temperature for AI generation',
        required: false,
        defaultValue: 0.7
      }
    },
    response: {
      success: 'boolean',
      data: {
        enhancedPrompt: 'string',
        originalPrompt: 'string',
        tokensUsed: 'number'
      }
    },
    errors: {
      '400': 'Invalid prompt or parameters',
      '401': 'Invalid API key',
      '429': 'Rate limit exceeded',
      '500': 'Internal server error'
    },
    examples: [
      {
        title: 'Basic prompt enhancement',
        description: 'Enhance a simple prompt',
        request: {
          userPrompt: 'Write an email',
          model: 'gpt-3.5-turbo'
        },
        response: {
          success: true,
          data: {
            enhancedPrompt: 'Write a professional email to a client...',
            originalPrompt: 'Write an email',
            tokensUsed: 45
          }
        }
      }
    ],
    since: '1.0.0'
  }
};

/**
 * Generates JSDoc comment for a function
 * 
 * @param funcName - Name of the function
 * @param description - Description of the function
 * @param params - Function parameters
 * @param returns - Return value description
 * @param examples - Usage examples
 * @returns JSDoc comment string
 * 
 * @example
 * ```typescript
 * const jsdoc = generateJSDocComment('calculateTotal', 'Calculates total price', [
 *   { name: 'price', type: 'number', description: 'Item price' },
 *   { name: 'tax', type: 'number', description: 'Tax percentage' }
 * ], 'Total price with tax');
 * ```
 */
export function generateJSDocComment(
  _funcName: string,
  description: string,
  params: Array<{ name: string; type: string; description: string }> = [],
  returns?: string,
  examples: string[] = []
): string {
  let jsdoc = `/**\n * ${description}\n *\n`;
  
  // Add parameters
  if (params.length > 0) {
    params.forEach(param => {
      jsdoc += ` * @param ${param.name} - ${param.description}\n`;
    });
    jsdoc += ` *\n`;
  }
  
  // Add return value
  if (returns) {
    jsdoc += ` * @returns ${returns}\n *\n`;
  }
  
  // Add examples
  if (examples.length > 0) {
    jsdoc += ` * @example\n`;
    examples.forEach(example => {
      jsdoc += ` * ${example}\n`;
    });
    jsdoc += ` *\n`;
  }
  
  jsdoc += ` */`;
  
  return jsdoc;
}

/**
 * Generates TypeScript interface documentation
 * 
 * @param interfaceName - Name of the interface
 * @param description - Description of the interface
 * @param properties - Interface properties
 * @returns Interface documentation string
 * 
 * @example
 * ```typescript
 * const interfaceDoc = generateInterfaceDoc('User', 'User data interface', [
 *   { name: 'id', type: 'string', description: 'User ID' },
 *   { name: 'name', type: 'string', description: 'User name' }
 * ]);
 * ```
 */
export function generateInterfaceDoc(
  interfaceName: string,
  description: string,
  properties: Array<{ name: string; type: string; description: string; optional?: boolean }>
): string {
  let interfaceDoc = `/**\n * ${description}\n */\n`;
  interfaceDoc += `export interface ${interfaceName} {\n`;
  
  properties.forEach(prop => {
    interfaceDoc += `  /** ${prop.description} */\n`;
    interfaceDoc += `  ${prop.name}${prop.optional ? '?' : ''}: ${prop.type};\n`;
  });
  
  interfaceDoc += `}`;
  
  return interfaceDoc;
}

/**
 * Validates component props documentation
 * 
 * @param component - Component to validate
 * @param requiredProps - Required props for the component
 * @returns Validation result
 * 
 * @example
 * ```typescript
 * const isValid = validateComponentDoc('ErrorBoundary', ['children']);
 * ```
 */
export function validateComponentDoc(
  component: string,
  requiredProps: string[]
): { isValid: boolean; missing: string[] } {
  const doc = COMPONENT_DOCS[component];
  
  if (!doc) {
    return { isValid: false, missing: ['Component documentation not found'] };
  }
  
  const missing: string[] = [];
  
  requiredProps.forEach(prop => {
    if (!doc.props || !doc.props[prop]) {
      missing.push(prop);
    }
  });
  
  return { isValid: missing.length === 0, missing };
}

/**
 * Exports all documentation as JSON
 * 
 * @returns Complete documentation object
 * 
 * @example
 * ```typescript
 * const docs = exportDocumentation();
 * console.log(JSON.stringify(docs, null, 2));
 * ```
 */
export function exportDocumentation(): {
  components: Record<string, ComponentDoc>;
  apis: Record<string, ApiDoc>;
  version: string;
  generatedAt: string;
} {
  return {
    components: COMPONENT_DOCS,
    apis: API_DOCS,
    version: '1.0.0',
    generatedAt: new Date().toISOString()
  };
}

/**
 * Documentation status checker
 * 
 * @returns Documentation coverage statistics
 * 
 * @example
 * ```typescript
 * const stats = getDocumentationStats();
 * console.log(`Documentation coverage: ${stats.coverage}%`);
 * ```
 */
export function getDocumentationStats(): {
  totalComponents: number;
  documentedComponents: number;
  totalApis: number;
  documentedApis: number;
  coverage: number;
} {
  const totalComponents = Object.keys(COMPONENT_DOCS).length;
  const documentedComponents = Object.values(COMPONENT_DOCS).filter(
    doc => doc.description && doc.description.length > 0
  ).length;
  
  const totalApis = Object.keys(API_DOCS).length;
  const documentedApis = Object.values(API_DOCS).filter(
    doc => doc.description && doc.description.length > 0
  ).length;
  
  const coverage = Math.round(
    ((documentedComponents + documentedApis) / (totalComponents + totalApis)) * 100
  );
  
  return {
    totalComponents,
    documentedComponents,
    totalApis,
    documentedApis,
    coverage
  };
} 