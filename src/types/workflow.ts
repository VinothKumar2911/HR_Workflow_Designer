
export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';


export interface BaseNodeData {
  label: string;
}


export interface StartNodeData extends BaseNodeData {
  title: string;
  metadata: Record<string, string>;
}


export interface TaskNodeData extends BaseNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}


export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  title: string;
  actionId: string;
  actionLabel: string;
  parameters: Record<string, string>;
}


export interface EndNodeData extends BaseNodeData {
  endMessage: string;
  showSummary: boolean;
}


export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedNodeData 
  | EndNodeData;


export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}


export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  nodeTitle: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}


export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
  validationMessages: string[];
}


export interface WorkflowExport {
  nodes: any[];
  edges: any[];
  metadata: {
    version: string;
    createdAt: string;
    name: string;
  };
}
