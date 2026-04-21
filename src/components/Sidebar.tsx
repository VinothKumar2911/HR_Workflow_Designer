import { DragEvent } from 'react';

export const Sidebar = () => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'start', label: 'Start', icon: '▶', color: '#10b981', description: 'Workflow entry point' },
    { type: 'task', label: 'Task', icon: '📋', color: '#3b82f6', description: 'Human task assignment' },
    { type: 'approval', label: 'Approval', icon: '✓', color: '#f59e0b', description: 'Manager/HR approval' },
    { type: 'automated', label: 'Automated', icon: '⚡', color: '#8b5cf6', description: 'System action' },
    { type: 'end', label: 'End', icon: '◼', color: '#ef4444', description: 'Workflow completion' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Workflow Nodes</h2>
        <p>Drag and drop to canvas</p>
      </div>
      <div className="node-palette">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="palette-node"
            onDragStart={(e) => onDragStart(e, node.type)}
            draggable
            style={{
              borderLeft: `4px solid ${node.color}`
            }}
          >
            <div className="node-icon" style={{ color: node.color }}>
              {node.icon}
            </div>
            <div className="node-info">
              <div className="node-label">{node.label}</div>
              <div className="node-description">{node.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar-help">
        <h3>Tips</h3>
        <ul>
          <li>Click a node to configure it</li>
          <li>Connect nodes by dragging from handles</li>
          <li>Delete nodes with Delete/Backspace and for edges use Backspace key</li>
          <li>Test your workflow in the simulator</li>
        </ul>
      </div>
    </aside>
  );
};
