import { useCallback, useRef, useState, DragEvent, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  MiniMap,
  NodeTypes,
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Sidebar } from './components/Sidebar';
import { StartNode } from './components/StartNode';
import { TaskNode } from './components/TaskNode';
import { ApprovalNode } from './components/ApprovalNode';
import { AutomatedNode } from './components/AutomatedNode';
import { EndNode } from './components/EndNode';
import { NodeConfigPanel } from './components/NodeConfigPanel';
import { WorkflowSimulator } from './components/WorkflowSimulator';
import { getAutomations } from './api/mockApi';
import { AutomationAction } from './types/workflow';

import './App.css';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [automations, setAutomations] = useState<AutomationAction[]>([]);

  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [showGuide, setShowGuide] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  
  useEffect(() => {
    const loadAutomations = async () => {
      const actions = await getAutomations();
      setAutomations(actions);
    };
    loadAutomations();
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(
  {
    ...params,
    animated: true,
    style: { stroke: "#6366f1" }
  },
  eds
)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const getDefaultNodeData = (type: string) => {
    switch (type) {
      case 'start':
        return { 
          label: 'Start',
          title: 'Start Workflow',
          metadata: {}
        };
      case 'task':
        return { 
          label: 'Task',
          title: 'New Task',
          description: '',
          assignee: '',
          dueDate: '',
          customFields: {}
        };
      case 'approval':
        return { 
          label: 'Approval',
          title: 'Approval Required',
          approverRole: '',
          autoApproveThreshold: 0
        };
      case 'automated':
        return { 
          label: 'Automated',
          title: 'Automated Step',
          actionId: '',
          actionLabel: '',
          parameters: {}
        };
      case 'end':
        return { 
          label: 'End',
          endMessage: 'Workflow Complete',
          showSummary: false
        };
      default:
        return { label: 'Unknown' };
    }
  };

  const onSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
    if (nodes.length === 1) {
      setSelectedNode(nodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleClosePanel = useCallback(() => {
    setSelectedNode(null);
  }, []);
const handleSaveWorkflow = () => {
  localStorage.setItem(
    "workflow",
    JSON.stringify({ nodes, edges, workflowName })
  );
};
const handleNewWorkflow = () => {
  setNodes([]);
  setEdges([]);
  setWorkflowName("Untitled Workflow");
};
  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNode && document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
          setEdges((eds) => eds.filter(
            (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
          ));
          setSelectedNode(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, setNodes, setEdges]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>HR Workflow Designer</h1>
          <p>Visual workflow builder for HR processes</p>
        </div>
        {/* <div className="header-actions">
          <button 
            className="simulator-toggle"
            onClick={() => setShowSimulator(!showSimulator)}
          >
            {showSimulator ? '📊 Hide Simulator' : '🧪 Test Workflow'}
          </button>
        </div> */}
        <div className="header-actions">
  <input
    type="text"
    value={workflowName}
    onChange={(e) => setWorkflowName(e.target.value)}
    placeholder="Enter workflow name"
    className="workflow-name-input"
  />

  <button
   onClick={() => setShowConfirm(true)}
  >
    ➕ New Workflow
  </button>
<div className="stats">
  Nodes: {nodes.length} | Edges: {edges.length}
</div>
  <button 
    className="simulator-toggle"
    onClick={() => setShowSimulator(!showSimulator)}
  >
    {showSimulator ? '📊 Hide Simulator' : '🧪 Test Workflow'}
  </button>
</div>
      </header>
{showConfirm && (
  <div className="confirm-overlay">
    <div className="confirm-modal">
      <h3>Save current workflow?</h3>
      <p>You have unsaved changes. What do you want to do?</p>

      <div className="confirm-actions">
        <button
          className="save-btn"
          onClick={() => {
            handleSaveWorkflow();
            handleNewWorkflow();
            setShowConfirm(false);
          }}
        >
          💾 Save & Continue
        </button>

        <button
          className="discard-btn"
          onClick={() => {
            handleNewWorkflow();
            setShowConfirm(false);
          }}
        >
          ❌ Don't Save
        </button>

        <button
          className="cancel-btn"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      <div className="app-content">
        <Sidebar />
        {showGuide && (
  <div className="guide-popup">
    <h2>👋 Welcome to Workflow Designer</h2>
    <p>This tool helps you build workflows visually.</p>
    <ul>
      <li>Drag nodes from sidebar</li>
      <li>Connect nodes using edges</li>
      <li>Click nodes to configure</li>
      <li>Run simulation to test</li>
    </ul>
    <button onClick={() => setShowGuide(false)}>Got it</button>
  </div>
)}


        <div className="canvas-container" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.type) {
                  case 'start': return '#10b981';
                  case 'task': return '#3b82f6';
                  case 'approval': return '#f59e0b';
                  case 'automated': return '#8b5cf6';
                  case 'end': return '#ef4444';
                  default: return '#6b7280';
                }
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>

        {selectedNode && (
          <NodeConfigPanel
            selectedNode={selectedNode}
            onUpdateNode={handleUpdateNode}
            onClose={handleClosePanel}
            automations={automations}
          />
        )}

        <WorkflowSimulator
          nodes={nodes}
          edges={edges}
          isOpen={showSimulator}
          onClose={() => setShowSimulator(false)}
        />
      </div>
    </div>
  );
}

export default App;
