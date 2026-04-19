import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface AutomatedNodeProps {
  data: {
    title?: string;
    actionLabel?: string;
    label?: string;
  };
  selected?: boolean;
}

export const AutomatedNode = memo(({ data, selected }: AutomatedNodeProps) => {
  return (
    <div 
      className={`custom-node automated-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '14px 18px',
        borderRadius: '8px',
        border: selected ? '2px solid #8b5cf6' : '2px solid #a78bfa',
        background: '#fff',
        minWidth: '180px',
        boxShadow: selected ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        fontWeight: '600', 
        textTransform: 'uppercase',
        color: '#8b5cf6',
        marginBottom: '6px'
      }}>
        Automated
      </div>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '4px'
      }}>
        {data.title || data.label || 'Automated Step'}
      </div>
      {data.actionLabel && (
        <div style={{ 
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ fontSize: '14px' }}>⚡</span>
          {data.actionLabel}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#8b5cf6',
          width: '10px',
          height: '10px',
          border: '2px solid #fff'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#8b5cf6',
          width: '10px',
          height: '10px',
          border: '2px solid #fff'
        }}
      />
    </div>
  );
});

AutomatedNode.displayName = 'AutomatedNode';
