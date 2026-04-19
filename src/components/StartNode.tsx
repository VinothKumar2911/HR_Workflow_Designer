import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface StartNodeProps {
  data: {
    title?: string;
    label?: string;
  };
  selected?: boolean;
}

export const StartNode = memo(({ data, selected }: StartNodeProps) => {
  return (
    <div 
      className={`custom-node start-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 20px',
        borderRadius: '20px',
        border: selected ? '2px solid #10b981' : '2px solid #059669',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        minWidth: '150px',
        boxShadow: selected ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
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
        Start
      </div>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '500'
      }}>
        {data.title || data.label || 'Start Workflow'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#fff',
          width: '10px',
          height: '10px',
          border: '2px solid #059669'
        }}
      />
    </div>
  );
});

StartNode.displayName = 'StartNode';
