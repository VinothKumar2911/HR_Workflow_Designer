import { AutomationAction, SimulationResult, SimulationStep } from '../types/workflow';

// Mock automation actions
const mockAutomations: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body']
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient']
  },
  {
    id: 'create_ticket',
    label: 'Create Support Ticket',
    params: ['priority', 'category', 'assignee']
  },
  {
    id: 'update_database',
    label: 'Update Database Record',
    params: ['table', 'recordId', 'fields']
  },
  {
    id: 'send_notification',
    label: 'Send Push Notification',
    params: ['userId', 'message', 'priority']
  },
  {
    id: 'generate_pdf',
    label: 'Generate PDF Report',
    params: ['template', 'data', 'outputPath']
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// GET /automations
export const getAutomations = async (): Promise<AutomationAction[]> => {
  await delay(300);
  return mockAutomations;
};

// POST /simulate
export const simulateWorkflow = async (workflow: any): Promise<SimulationResult> => {
  await delay(800);
  
  const { nodes, edges } = workflow;
  const steps: SimulationStep[] = [];
  const errors: string[] = [];
  const validationMessages: string[] = [];

  // Validation: Check for start node
  const startNodes = nodes.filter((n: any) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start Node');
  } else if (startNodes.length > 1) {
    errors.push('Workflow can only have one Start Node');
  }

  // Validation: Check for end node
  const endNodes = nodes.filter((n: any) => n.type === 'end');
  if (endNodes.length === 0) {
    validationMessages.push('Warning: Workflow has no End Node');
  }

  // Validation: Check for disconnected nodes
  const connectedNodeIds = new Set<string>();
  edges.forEach((edge: any) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const disconnectedNodes = nodes.filter((n: any) => 
    !connectedNodeIds.has(n.id) && nodes.length > 1
  );

  if (disconnectedNodes.length > 0) {
    validationMessages.push(
      `Warning: ${disconnectedNodes.length} disconnected node(s) found`
    );
  }

  // Validation: Check for cycles (simple check)
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push('Workflow contains a cycle - infinite loop detected');
  }

  // If there are critical errors, return early
  if (errors.length > 0) {
    return {
      success: false,
      steps: [],
      errors,
      validationMessages
    };
  }

  // Simulate execution path
  if (startNodes.length === 1) {
    const visited = new Set<string>();
    simulateNode(startNodes[0], nodes, edges, steps, visited);
  }

  return {
    success: true,
    steps,
    errors,
    validationMessages
  };
};

// Helper function to simulate individual node execution
function simulateNode(
  node: any,
  allNodes: any[],
  allEdges: any[],
  steps: SimulationStep[],
  visited: Set<string>
): void {
  if (visited.has(node.id)) return;
  visited.add(node.id);

  const nodeData = node.data || {};
  const timestamp = new Date().toISOString();

  let message = '';
  switch (node.type) {
    case 'start':
      message = `Workflow started: ${nodeData.title || 'Untitled'}`;
      break;
    case 'task':
      message = `Task "${nodeData.title || 'Untitled'}" assigned to ${nodeData.assignee || 'Unassigned'}`;
      break;
    case 'approval':
      message = `Approval requested from ${nodeData.approverRole || 'Unknown role'}`;
      break;
    case 'automated':
      message = `Automated action executed: ${nodeData.actionLabel || 'Unknown action'}`;
      break;
    case 'end':
      message = `Workflow completed: ${nodeData.endMessage || 'Done'}`;
      break;
    default:
      message = `Unknown node type executed`;
  }

  steps.push({
    nodeId: node.id,
    nodeType: node.type,
    nodeTitle: nodeData.title || nodeData.label || 'Untitled',
    status: 'completed',
    message,
    timestamp
  });

  // Find next nodes
  const outgoingEdges = allEdges.filter((e: any) => e.source === node.id);
  outgoingEdges.forEach((edge: any) => {
    const nextNode = allNodes.find((n: any) => n.id === edge.target);
    if (nextNode) {
      simulateNode(nextNode, allNodes, allEdges, steps, visited);
    }
  });
}

// Simple cycle detection using DFS
function detectCycle(nodes: any[], edges: any[]): boolean {
  const adjList = new Map<string, string[]>();
  
  nodes.forEach((node: any) => {
    adjList.set(node.id, []);
  });

  edges.forEach((edge: any) => {
    const neighbors = adjList.get(edge.source) || [];
    neighbors.push(edge.target);
    adjList.set(edge.source, neighbors);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}
