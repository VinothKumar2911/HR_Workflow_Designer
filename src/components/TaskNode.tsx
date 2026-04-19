import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface TaskNodeProps {
  data: {
    title?: string;
    assignee?: string;
    label?: string;
  };
  selected?: boolean;
}

export const TaskNode = memo(({ data, selected }: TaskNodeProps) => {
  return (
    <div 
      className={`custom-node task-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '14px 18px',
        borderRadius: '8px',
        border: selected ? '2px solid #3b82f6' : '2px solid #60a5fa',
        background: '#fff',
        minWidth: '180px',
        boxShadow: selected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        fontWeight: '600', 
        textTransform: 'uppercase',
        color: '#3b82f6',
        marginBottom: '6px'
      }}>
        Task
      </div>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '4px'
      }}>
        {data.title || data.label || 'Untitled Task'}
      </div>
      {data.assignee && (
        <div style={{ 
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ fontSize: '14px' }}>👤</span>
          {data.assignee}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#3b82f6',
          width: '10px',
          height: '10px',
          border: '2px solid #fff'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#3b82f6',
          width: '10px',
          height: '10px',
          border: '2px solid #fff'
        }}
      />
    </div>
  );
});

TaskNode.displayName = 'TaskNode';
