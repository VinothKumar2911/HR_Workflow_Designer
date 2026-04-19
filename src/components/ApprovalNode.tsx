import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface ApprovalNodeProps {
  data: {
    title?: string;
    approverRole?: string;
    label?: string;
  };
  selected?: boolean;
}

export const ApprovalNode = memo(({ data, selected }: ApprovalNodeProps) => {
  return (
    <div 
      className={`custom-node approval-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '14px 18px',
        borderRadius: '8px',
        border: selected ? '2px solid #f59e0b' : '2px solid #fbbf24',
        background: '#fff',
        minWidth: '180px',
        boxShadow: selected ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        fontWeight: '600', 
        textTransform: 'uppercase',
        color: '#f59e0b',
        marginBottom: '6px'
      }}>
        Approval
      </div>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '4px'
      }}>
        {data.title || data.label || 'Approval Required'}
      </div>
      {data.approverRole && (
        <div style={{ 
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ fontSize: '14px' }}>✓</span>
          {data.approverRole}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#f59e0b',
          width: '10px',
          height: '10px',
          border: '2px solid #fff'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#f59e0b',
          width: '10px',
          height: '10px',
          border: '2px solid #fff'
        }}
      />
    </div>
  );
});

ApprovalNode.displayName = 'ApprovalNode';
