import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { hasPremiumAccess } from '../utils/templateAccess';
import './CustomRoleBuilder.css';

interface CustomRole {
  id: string;
  nameKey: string;
  displayName: string;
  icon: string;
  description: string;
  tasks: CustomTask[];
  category: 'business' | 'creative' | 'technical' | 'educational' | 'custom';
  isCustom: boolean;
  createdAt: number;
  updatedAt: number;
}

interface CustomTask {
  id: string;
  key: string;
  nameKey: string;
  displayName: string;
  fields: CustomField[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
}

interface CustomField {
  id: string;
  key: string;
  displayName: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'file' | 'number' | 'date' | 'checkbox' | 'radio';
  required: boolean;
  placeholder: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

interface CustomRoleBuilderProps {
  onSave: (role: CustomRole) => void;
  onCancel: () => void;
  editingRole?: CustomRole;
}

const fieldTypeOptions = [
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'textarea', label: 'Multi-line Text', icon: '📄' },
  { value: 'select', label: 'Dropdown', icon: '📋' },
  { value: 'multiselect', label: 'Multi-select', icon: '☑️' },
  { value: 'file', label: 'File Upload', icon: '📎' },
  { value: 'number', label: 'Number', icon: '🔢' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'checkbox', label: 'Checkbox', icon: '✅' },
  { value: 'radio', label: 'Radio Button', icon: '🔘' }
];

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', color: '#10B981' },
  { value: 'intermediate', label: 'Intermediate', color: '#F59E0B' },
  { value: 'advanced', label: 'Advanced', color: '#EF4444' },
  { value: 'expert', label: 'Expert', color: '#8B5CF6' }
];

const categoryOptions = [
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'technical', label: 'Technical', icon: '💻' },
  { value: 'educational', label: 'Educational', icon: '🎓' },
  { value: 'custom', label: 'Custom', icon: '⚙️' }
];

const CustomRoleBuilder: React.FC<CustomRoleBuilderProps> = ({ onSave, onCancel, editingRole }) => {
  // const { t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const isPremium = hasPremiumAccess();

  const [role, setRole] = useState<Partial<CustomRole>>(editingRole || {
    displayName: '',
    icon: '🤖',
    description: '',
    tasks: [],
    category: 'custom',
    isCustom: true
  });

  const [currentTask, setCurrentTask] = useState<Partial<CustomTask>>({
    displayName: '',
    fields: [],
    difficulty: 'beginner',
    description: ''
  });

  const [currentField, setCurrentField] = useState<Partial<CustomField>>({
    displayName: '',
    type: 'text',
    required: true,
    placeholder: ''
  });

  const [showTaskBuilder, setShowTaskBuilder] = useState(false);
  const [showFieldBuilder, setShowFieldBuilder] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  const handleRoleChange = (field: keyof CustomRole, value: any) => {
    setRole(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskChange = (field: keyof CustomTask, value: any) => {
    setCurrentTask(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (field: keyof CustomField, value: any) => {
    setCurrentField(prev => ({ ...prev, [field]: value }));
  };

  const addField = () => {
    if (!currentField.displayName) {
      addToast('Please enter field name', 'error');
      return;
    }

    const field: CustomField = {
      id: Date.now().toString(),
      key: currentField.displayName.toLowerCase().replace(/\s+/g, '_'),
      displayName: currentField.displayName,
      type: currentField.type || 'text',
      required: currentField.required || false,
      placeholder: currentField.placeholder || '',
      options: currentField.options,
      validation: currentField.validation
    };

    if (editingFieldIndex !== null) {
      const updatedFields = [...(currentTask.fields || [])];
      updatedFields[editingFieldIndex] = field;
      setCurrentTask(prev => ({ ...prev, fields: updatedFields }));
      setEditingFieldIndex(null);
    } else {
      setCurrentTask(prev => ({ 
        ...prev, 
        fields: [...(prev.fields || []), field] 
      }));
    }

    setCurrentField({
      displayName: '',
      type: 'text',
      required: true,
      placeholder: ''
    });
    setShowFieldBuilder(false);
  };

  const editField = (index: number) => {
    const field = currentTask.fields?.[index];
    if (field) {
      setCurrentField(field);
      setEditingFieldIndex(index);
      setShowFieldBuilder(true);
    }
  };

  const deleteField = (index: number) => {
    setCurrentTask(prev => ({
      ...prev,
      fields: prev.fields?.filter((_, i) => i !== index) || []
    }));
  };

  const addTask = () => {
    // Check premium access for advanced/expert difficulty
    if ((currentTask.difficulty === 'advanced' || currentTask.difficulty === 'expert') && !isPremium) {
      addToast('Advanced and Expert tasks require Premium subscription', 'warning');
      // Navigate to premium page after a short delay
      setTimeout(() => {
        navigate('/premium');
      }, 1500);
      return;
    }

    if (!currentTask.displayName || !currentTask.fields?.length) {
      addToast('Please enter task name and at least one field', 'error');
      return;
    }

    const task: CustomTask = {
      id: Date.now().toString(),
      key: currentTask.displayName.toLowerCase().replace(/\s+/g, '_'),
      nameKey: `custom.${currentTask.displayName.toLowerCase().replace(/\s+/g, '_')}`,
      displayName: currentTask.displayName,
      fields: currentTask.fields,
      difficulty: currentTask.difficulty || 'beginner',
      description: currentTask.description || ''
    };

    if (editingTaskIndex !== null) {
      const updatedTasks = [...(role.tasks || [])];
      updatedTasks[editingTaskIndex] = task;
      setRole(prev => ({ ...prev, tasks: updatedTasks }));
      setEditingTaskIndex(null);
    } else {
      setRole(prev => ({ 
        ...prev, 
        tasks: [...(prev.tasks || []), task] 
      }));
    }

    setCurrentTask({
      displayName: '',
      fields: [],
      difficulty: 'beginner',
      description: ''
    });
    setShowTaskBuilder(false);
  };

  const editTask = (index: number) => {
    const task = role.tasks?.[index];
    if (task) {
      setCurrentTask(task);
      setEditingTaskIndex(index);
      setShowTaskBuilder(true);
    }
  };

  const deleteTask = (index: number) => {
    setRole(prev => ({
      ...prev,
      tasks: prev.tasks?.filter((_, i) => i !== index) || []
    }));
  };

  const saveRole = () => {
    // Check if any task requires premium access
    const hasAdvancedTasks = role.tasks?.some(task => 
      task.difficulty === 'advanced' || task.difficulty === 'expert'
    );
    
    if (hasAdvancedTasks && !isPremium) {
      addToast('Saving roles with Advanced/Expert tasks requires Premium subscription', 'warning');
      // Navigate to premium page after a short delay
      setTimeout(() => {
        navigate('/premium');
      }, 1500);
      return;
    }

    if (!role.displayName || !role.description || !role.tasks?.length) {
      addToast('Please fill all required fields and add at least one task', 'error');
      return;
    }

    const finalRole: CustomRole = {
      id: editingRole?.id || Date.now().toString(),
      nameKey: `custom.${role.displayName.toLowerCase().replace(/\s+/g, '_')}`,
      displayName: role.displayName,
      icon: role.icon || '🤖',
      description: role.description,
      tasks: role.tasks,
      category: role.category || 'custom',
      isCustom: true,
      createdAt: editingRole?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    onSave(finalRole);
    addToast(editingRole ? 'Role updated successfully!' : 'Role created successfully!', 'success');
  };

  return (
    <div className="custom-role-builder">
      <div className="builder-header">
        <h3>🛠️ {editingRole ? 'Edit Custom Role' : 'Create Custom Role'}</h3>
        {!isPremium && (
          <div className="premium-badge">
            <span>⭐ Premium Feature</span>
          </div>
        )}
        <div className="header-actions">
          <button onClick={onCancel} className="cancel-button">Cancel</button>
          <button onClick={saveRole} className="save-button">
            {editingRole ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Role Basic Info */}
        <div className="section">
          <h4>📋 Basic Information</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Role Name *</label>
              <input
                type="text"
                value={role.displayName || ''}
                onChange={(e) => handleRoleChange('displayName', e.target.value)}
                placeholder="e.g., Social Media Manager"
              />
            </div>

            <div className="form-group">
              <label>Icon</label>
              <div className="icon-selector">
                <input
                  type="text"
                  value={role.icon || ''}
                  onChange={(e) => handleRoleChange('icon', e.target.value)}
                  placeholder="🤖"
                  className="icon-input"
                />
                <div className="icon-suggestions">
                  {['🤖', '👨‍💼', '👩‍💻', '🎨', '📊', '✍️', '🏗️', '🔬', '👨‍🏫', '💼'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleRoleChange('icon', emoji)}
                      className="icon-suggestion"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={role.category || 'custom'}
                onChange={(e) => handleRoleChange('category', e.target.value)}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={role.description || ''}
              onChange={(e) => handleRoleChange('description', e.target.value)}
              placeholder="Describe what this role does and its expertise areas..."
              rows={3}
            />
          </div>
        </div>

        {/* Tasks Management */}
        <div className="section">
          <div className="section-header">
            <h4>⚡ Tasks ({role.tasks?.length || 0})</h4>
            <button
              onClick={() => setShowTaskBuilder(true)}
              className="add-button"
            >
              ➕ Add Task
            </button>
          </div>

          <div className="tasks-list">
            {role.tasks?.map((task, index) => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <span className="task-name">{task.displayName}</span>
                  <span className={`difficulty-badge difficulty-${task.difficulty}`}>
                    {task.difficulty}
                  </span>
                  <span className="field-count">{task.fields.length} fields</span>
                </div>
                <div className="task-actions">
                  <button onClick={() => editTask(index)} className="edit-button">✏️</button>
                  <button onClick={() => deleteTask(index)} className="delete-button">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Builder Modal */}
      {showTaskBuilder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>🔧 {editingTaskIndex !== null ? 'Edit Task' : 'Create Task'}</h4>
              <button onClick={() => setShowTaskBuilder(false)} className="close-button">✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Task Name *</label>
                <input
                  type="text"
                  value={currentTask.displayName || ''}
                  onChange={(e) => handleTaskChange('displayName', e.target.value)}
                  placeholder="e.g., Create Social Media Campaign"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={currentTask.description || ''}
                  onChange={(e) => handleTaskChange('description', e.target.value)}
                  placeholder="Describe what this task accomplishes..."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>
                <select
                  value={currentTask.difficulty || 'beginner'}
                  onChange={(e) => handleTaskChange('difficulty', e.target.value)}
                >
                  {difficultyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fields Management */}
              <div className="fields-section">
                <div className="section-header">
                  <h5>📝 Fields ({currentTask.fields?.length || 0})</h5>
                  <button
                    onClick={() => setShowFieldBuilder(true)}
                    className="add-button"
                  >
                    ➕ Add Field
                  </button>
                </div>

                <div className="fields-list">
                  {currentTask.fields?.map((field, index) => (
                    <div key={field.id} className="field-item">
                      <div className="field-info">
                        <span className="field-name">{field.displayName}</span>
                        <span className="field-type">{field.type}</span>
                        {field.required && <span className="required-badge">Required</span>}
                      </div>
                      <div className="field-actions">
                        <button onClick={() => editField(index)} className="edit-button">✏️</button>
                        <button onClick={() => deleteField(index)} className="delete-button">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowTaskBuilder(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={addTask} className="save-button">
                {editingTaskIndex !== null ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Builder Modal */}
      {showFieldBuilder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>🎛️ {editingFieldIndex !== null ? 'Edit Field' : 'Create Field'}</h4>
              <button onClick={() => setShowFieldBuilder(false)} className="close-button">✕</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Field Name *</label>
                <input
                  type="text"
                  value={currentField.displayName || ''}
                  onChange={(e) => handleFieldChange('displayName', e.target.value)}
                  placeholder="e.g., Target Audience"
                />
              </div>

              <div className="form-group">
                <label>Field Type</label>
                <select
                  value={currentField.type || 'text'}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                >
                  {fieldTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Placeholder</label>
                <input
                  type="text"
                  value={currentField.placeholder || ''}
                  onChange={(e) => handleFieldChange('placeholder', e.target.value)}
                  placeholder="Placeholder text for this field..."
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={currentField.required || false}
                    onChange={(e) => handleFieldChange('required', e.target.checked)}
                  />
                  Required Field
                </label>
              </div>

              {/* Options for select/multiselect */}
              {(currentField.type === 'select' || currentField.type === 'multiselect' || currentField.type === 'radio') && (
                <div className="form-group">
                  <label>Options (one per line)</label>
                  <textarea
                    value={currentField.options?.join('\n') || ''}
                    onChange={(e) => handleFieldChange('options', e.target.value.split('\n').filter(Boolean))}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={4}
                  />
                </div>
              )}

              {/* Validation for text/textarea */}
              {(currentField.type === 'text' || currentField.type === 'textarea') && (
                <div className="validation-section">
                  <h6>Validation Rules</h6>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Min Length</label>
                      <input
                        type="number"
                        value={currentField.validation?.minLength || ''}
                        onChange={(e) => handleFieldChange('validation', {
                          ...currentField.validation,
                          minLength: parseInt(e.target.value) || undefined
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Max Length</label>
                      <input
                        type="number"
                        value={currentField.validation?.maxLength || ''}
                        onChange={(e) => handleFieldChange('validation', {
                          ...currentField.validation,
                          maxLength: parseInt(e.target.value) || undefined
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowFieldBuilder(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={addField} className="save-button">
                {editingFieldIndex !== null ? 'Update Field' : 'Add Field'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomRoleBuilder; 