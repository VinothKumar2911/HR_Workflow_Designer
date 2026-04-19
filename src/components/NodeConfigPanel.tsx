import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { AutomationAction } from '../types/workflow';

interface NodeConfigPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onClose: () => void;
  automations: AutomationAction[];
}

export const NodeConfigPanel = ({ 
  selectedNode, 
  onUpdateNode, 
  onClose,
  automations 
}: NodeConfigPanelProps) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data || {});
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMetadataChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      metadata: {
        ...(prev.metadata || {}),
        [key]: value
      }
    }));
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: {
        ...(prev.customFields || {}),
        [key]: value
      }
    }));
  };

  const handleParameterChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      parameters: {
        ...(prev.parameters || {}),
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdateNode(selectedNode.id, formData);
    onClose();
  };

  const handleActionChange = (actionId: string) => {
    const action = automations.find(a => a.id === actionId);
    if (action) {
      setFormData((prev: any) => ({
        ...prev,
        actionId: action.id,
        actionLabel: action.label,
        parameters: {}
      }));
    }
  };

  const renderStartNodeForm = () => (
    <div className="form-content">
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter start title"
        />
      </div>
      <div className="form-group">
        <label>Metadata (Optional)</label>
        <div className="key-value-pairs">
          {Object.entries(formData.metadata || {}).map(([key, value]) => (
            <div key={key} className="key-value-row">
              <input
                type="text"
                value={key}
                disabled
                placeholder="Key"
                style={{ width: '40%' }}
              />
              <input
                type="text"
                value={value as string}
                onChange={(e) => handleMetadataChange(key, e.target.value)}
                placeholder="Value"
                style={{ width: '55%' }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleMetadataChange(`key_${Date.now()}`, '')}
            className="add-pair-btn"
          >
            + Add Metadata
          </button>
        </div>
      </div>
    </div>
  );

  const renderTaskNodeForm = () => (
    <div className="form-content">
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the task"
          rows={3}
        />
      </div>
      <div className="form-group">
        <label>Assignee</label>
        <input
          type="text"
          value={formData.assignee || ''}
          onChange={(e) => handleChange('assignee', e.target.value)}
          placeholder="Enter assignee name"
        />
      </div>
      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          value={formData.dueDate || ''}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Custom Fields (Optional)</label>
        <div className="key-value-pairs">
          {Object.entries(formData.customFields || {}).map(([key, value]) => (
            <div key={key} className="key-value-row">
              <input
                type="text"
                value={key}
                disabled
                placeholder="Field name"
                style={{ width: '40%' }}
              />
              <input
                type="text"
                value={value as string}
                onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                placeholder="Field value"
                style={{ width: '55%' }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleCustomFieldChange(`field_${Date.now()}`, '')}
            className="add-pair-btn"
          >
            + Add Custom Field
          </button>
        </div>
      </div>
    </div>
  );

  const renderApprovalNodeForm = () => (
    <div className="form-content">
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter approval title"
        />
      </div>
      <div className="form-group">
        <label>Approver Role</label>
        <select
          value={formData.approverRole || ''}
          onChange={(e) => handleChange('approverRole', e.target.value)}
        >
          <option value="">Select role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HR Business Partner</option>
          <option value="Director">Director</option>
          <option value="VP">Vice President</option>
          <option value="C-Level">C-Level Executive</option>
        </select>
      </div>
      <div className="form-group">
        <label>Auto-Approve Threshold</label>
        <input
          type="number"
          value={formData.autoApproveThreshold || 0}
          onChange={(e) => handleChange('autoApproveThreshold', parseInt(e.target.value) || 0)}
          placeholder="Enter threshold value"
          min="0"
        />
        <small>Amount below which approval is automatic</small>
      </div>
    </div>
  );

  const renderAutomatedNodeForm = () => {
    const selectedAction = automations.find(a => a.id === formData.actionId);
    
    return (
      <div className="form-content">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter step title"
          />
        </div>
        <div className="form-group">
          <label>Action Type *</label>
          <select
            value={formData.actionId || ''}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">Select an action</option>
            {automations.map(action => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        </div>
        {selectedAction && selectedAction.params.length > 0 && (
          <div className="form-group">
            <label>Action Parameters</label>
            <div className="parameters">
              {selectedAction.params.map(param => (
                <div key={param} className="param-row">
                  <label>{param}</label>
                  <input
                    type="text"
                    value={formData.parameters?.[param] || ''}
                    onChange={(e) => handleParameterChange(param, e.target.value)}
                    placeholder={`Enter ${param}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEndNodeForm = () => (
    <div className="form-content">
      <div className="form-group">
        <label>End Message *</label>
        <input
          type="text"
          value={formData.endMessage || ''}
          onChange={(e) => handleChange('endMessage', e.target.value)}
          placeholder="Enter completion message"
        />
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.showSummary || false}
            onChange={(e) => handleChange('showSummary', e.target.checked)}
          />
          <span>Show workflow summary</span>
        </label>
      </div>
    </div>
  );

  const getNodeTitle = () => {
    switch (selectedNode.type) {
      case 'start': return 'Configure Start Node';
      case 'task': return 'Configure Task Node';
      case 'approval': return 'Configure Approval Node';
      case 'automated': return 'Configure Automated Node';
      case 'end': return 'Configure End Node';
      default: return 'Configure Node';
    }
  };

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start': return renderStartNodeForm();
      case 'task': return renderTaskNodeForm();
      case 'approval': return renderApprovalNodeForm();
      case 'automated': return renderAutomatedNodeForm();
      case 'end': return renderEndNodeForm();
      default: return <div>Unknown node type</div>;
    }
  };

  return (
    <div className="node-config-panel">
      <div className="panel-header">
        <h3>{getNodeTitle()}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      {renderForm()}
      <div className="panel-footer">
        <button onClick={onClose} className="cancel-btn">Cancel</button>
        <button onClick={handleSave} className="save-btn">Save Changes</button>
      </div>
    </div>
  );
};
