import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface EndNodeProps {
  data: {
    endMessage?: string;
    label?: string;
  };
  selected?: boolean;
}

export const EndNode = memo(({ data, selected }: EndNodeProps) => {
  return (
    <div 
      className={`custom-node end-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 20px',
        borderRadius: '20px',
        border: selected ? '2px solid #ef4444' : '2px solid #f87171',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        minWidth: '150px',
        boxShadow: selected ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ 
        fontSize: '11px', 
        fontWeight: '600', 
        textTransform: 'uppercase',
        opacity: 0.9,
        marginBottom: '4px'
      }}>
        End
      </div>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '500'
      }}>
        {data.endMessage || data.label || 'Workflow Complete'}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#fff',
          width: '10px',
          height: '10px',
          border: '2px solid #dc2626'
        }}
      />
    </div>
  );
});

EndNode.displayName = 'EndNode';
