import { useState } from 'react';
import { Node, Edge } from 'reactflow';
import { simulateWorkflow } from '../api/mockApi';
import { SimulationResult } from '../types/workflow';

interface WorkflowSimulatorProps {
  nodes: Node[];
  edges: Edge[];
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowSimulator = ({ nodes, edges, isOpen, onClose }: WorkflowSimulatorProps) => {
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    setSimulating(true);
    setResult(null);

    try {
      const workflow = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: node.data
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      };

      const simulationResult = await simulateWorkflow(workflow);
      setResult(simulationResult);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setSimulating(false);
    }
  };

  const handleExport = () => {
    const workflowData = {
      nodes,
      edges,
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
        name: 'HR Workflow'
      }
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="simulator-panel">
      <div className="simulator-header">
        <h3>🧪 Workflow Simulator</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="simulator-content">
        <div className="simulator-actions">
          <button 
            onClick={handleSimulate} 
            disabled={simulating || nodes.length === 0}
            className="simulate-btn"
          >
            {simulating ? 'Simulating...' : '▶ Run Simulation'}
          </button>
          <button 
            onClick={handleExport}
            disabled={nodes.length === 0}
            className="export-btn"
          >
            📥 Export Workflow
          </button>
        </div>

        {result && (
          <div className="simulation-results">
            <div className={`result-status ${result.success ? 'success' : 'error'}`}>
              {result.success ? '✓ Simulation Successful' : '✗ Simulation Failed'}
            </div>

            {result.errors.length > 0 && (
              <div className="errors-section">
                <h4>❌ Errors:</h4>
                <ul>
                  {result.errors.map((error, idx) => (
                    <li key={idx} className="error-item">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.validationMessages.length > 0 && (
              <div className="warnings-section">
                <h4>⚠️ Warnings:</h4>
                <ul>
                  {result.validationMessages.map((msg, idx) => (
                    <li key={idx} className="warning-item">{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.steps.length > 0 && (
              <div className="steps-section">
                <h4>📋 Execution Steps:</h4>
                <div className="execution-timeline">
                  {result.steps.map((step, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className="step-number">{idx + 1}</div>
                      <div className="step-content">
                        <div className="step-header">
                          <span className="step-title">{step.nodeTitle}</span>
                          <span className={`step-status status-${step.status}`}>
                            {step.status}
                          </span>
                        </div>
                        <div className="step-message">{step.message}</div>
                        <div className="step-time">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !simulating && (
          <div className="simulator-empty">
            <p>Click "Run Simulation" to test your workflow</p>
            <p className="helper-text">
              The simulator will validate your workflow structure and show the execution path
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
