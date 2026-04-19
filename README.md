# HR Workflow Designer - Full Stack Engineering Case Study

A visual workflow builder for HR processes built with React, TypeScript, and React Flow.

**Built for:** Tredence Analytics Full Stack Engineering Internship Case Study  
**Time Investment:** 4-6 hours  
**Author:** [Your Name]

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

---

## 📁 Project Structure

```
hr-workflow-designer/
├── src/
│   ├── components/           # React components
│   │   ├── StartNode.tsx     # Start workflow node
│   │   ├── TaskNode.tsx      # Task assignment node
│   │   ├── ApprovalNode.tsx  # Approval step node
│   │   ├── AutomatedNode.tsx # Automated action node
│   │   ├── EndNode.tsx       # End workflow node
│   │   ├── Sidebar.tsx       # Node palette sidebar
│   │   ├── NodeConfigPanel.tsx # Node editing forms
│   │   └── WorkflowSimulator.tsx # Workflow testing panel
│   ├── types/
│   │   └── workflow.ts       # TypeScript type definitions
│   ├── api/
│   │   └── mockApi.ts        # Mock API layer
│   ├── App.tsx               # Main application component
│   ├── App.css               # Application styles
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🏗️ Architecture & Design Decisions

### **1. Technology Stack**

- **React 18+** - Component-based UI library
- **TypeScript** - Type safety and better developer experience
- **React Flow** - Graph visualization and node management
- **Vite** - Fast build tool and development server

**Why this stack?**
- React Flow handles complex graph operations (positioning, connections, drag-and-drop)
- TypeScript ensures type safety across node data structures
- Vite provides instant HMR (Hot Module Replacement) for fast development

### **2. Component Architecture**

#### **Custom Node Components**
Each node type is a separate React component with:
- Custom styling matching its purpose
- React Flow handles for connections
- Visual feedback on selection
- Consistent interface across all node types

**Design Pattern:** Composition over inheritance
- Each node implements the same interface but with different data
- Shared visual language (colors, sizing, typography)
- Reusable Handle components from React Flow

#### **Separation of Concerns**

```
UI Layer (Components)
    ↓
State Management (React Hooks: useState, useCallback)
    ↓
Business Logic (Mock API, Validation)
    ↓
Type Safety (TypeScript Interfaces)
```

### **3. State Management**

**Approach:** React Flow's built-in state management with custom hooks

```typescript
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
```

**Why not Redux/Context?**
- React Flow provides optimized state management for graphs
- Application state is localized (no global state needed)
- Simpler mental model for this use case

### **4. Form Handling Strategy**

**Dynamic Forms Pattern:**
```typescript
// Single component handles all node types
const NodeConfigPanel = ({ selectedNode, onUpdateNode }) => {
  // Form data synced with selected node
  const [formData, setFormData] = useState(selectedNode.data);
  
  // Renders different form based on node type
  switch (selectedNode.type) {
    case 'task': return <TaskForm />;
    case 'approval': return <ApprovalForm />;
    // ...
  }
}
```

**Benefits:**
- Single source of truth for form state
- Type-safe data updates
- Easily extensible for new node types

### **5. Mock API Layer**

**Design Pattern:** Service layer abstraction

```typescript
// api/mockApi.ts
export const getAutomations = async (): Promise<AutomationAction[]> => {
  await delay(300); // Simulate network latency
  return mockData;
}
```

**Why this approach?**
- Simulates real async API calls
- Easy to replace with real backend later
- Includes validation logic (cycles, disconnected nodes)
- Returns strongly-typed data

### **6. Type System Design**

**Discriminated Unions for Node Data:**

```typescript
type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedNodeData 
  | EndNodeData;
```

**Benefits:**
- TypeScript can narrow types based on node.type
- Catches errors at compile time
- Better autocomplete in IDE
- Self-documenting code

### **7. Workflow Validation**

Implemented validation checks:
- ✅ Must have exactly one Start Node
- ✅ Warns if no End Node
- ✅ Detects cycles (infinite loops)
- ✅ Identifies disconnected nodes
- ✅ Validates graph structure

**Algorithm:** Depth-First Search (DFS) for cycle detection

---

## 🎯 Feature Implementation

### ✅ Completed Requirements

#### **1. Workflow Canvas (React Flow)**
- ✅ Drag-and-drop from sidebar
- ✅ 5 custom node types (Start, Task, Approval, Automated, End)
- ✅ Connect nodes with edges
- ✅ Select nodes to edit
- ✅ Delete nodes/edges (Backspace/Delete key)
- ✅ Auto-validates constraints

#### **2. Node Editing / Configuration Forms**
- ✅ Dynamic forms for each node type
- ✅ All required fields implemented:
  - Start: title, metadata key-value pairs
  - Task: title, description, assignee, due date, custom fields
  - Approval: title, approver role, auto-approve threshold
  - Automated: title, action selection, dynamic parameters
  - End: end message, summary flag
- ✅ Controlled components with proper state handling
- ✅ Type-safe form data

#### **3. Mock API Layer**
- ✅ GET /automations - Returns mock automated actions
- ✅ POST /simulate - Accepts workflow JSON, returns execution result
- ✅ Simulated network delays
- ✅ Proper error handling

#### **4. Workflow Testing / Sandbox Panel**
- ✅ Serializes workflow graph
- ✅ Sends to mock /simulate API
- ✅ Displays step-by-step execution log
- ✅ Validates structure (cycles, missing connections)
- ✅ Shows errors and warnings
- ✅ Visual timeline UI

#### **5. Clean Architecture**
- ✅ Modular folder structure
- ✅ Separation of canvas, node, and API logic
- ✅ Reusable custom hooks (useNodesState, useEdgesState)
- ✅ Type-safe abstractions
- ✅ Component decomposition
- ✅ Extensible node type system

### 🎁 Bonus Features Implemented

- ✅ **Export workflow as JSON** - Download button in simulator
- ✅ **Mini-map** - React Flow built-in minimap for navigation
- ✅ **Zoom controls** - React Flow controls for zoom/pan
- ✅ **Visual node color coding** - Each node type has distinct colors
- ✅ **Responsive design** - Works on different screen sizes
- ✅ **Keyboard shortcuts** - Delete key to remove nodes
- ✅ **Real-time validation feedback** - Immediate error display

---

## 🧪 How to Use

### **Creating a Workflow**

1. **Add Nodes:** Drag node types from the left sidebar onto the canvas
2. **Connect Nodes:** Click and drag from the circle (handle) on one node to another
3. **Configure Nodes:** Click any node to open the configuration panel on the right
4. **Fill in Details:** Complete the form fields for each node
5. **Test Workflow:** Click "Test Workflow" to open the simulator
6. **Run Simulation:** Click "Run Simulation" to validate and execute
7. **Export:** Use "Export Workflow" to save as JSON

### **Example Workflow: Employee Onboarding**

1. Start Node → "Onboarding Process Begins"
2. Task Node → "HR collects documents" (Assigned to: HR Team)
3. Automated Node → "Send welcome email" (Action: Send Email)
4. Approval Node → "Manager approval" (Approver: Manager)
5. Task Node → "Setup IT equipment" (Assigned to: IT Team)
6. End Node → "Onboarding Complete"

---

## 🔧 Technical Highlights

### **Performance Optimizations**
- React.memo on all custom nodes (prevents unnecessary re-renders)
- useCallback for event handlers (stable references)
- Controlled component pattern (efficient updates)

### **Code Quality**
- Strict TypeScript configuration
- Consistent naming conventions
- Comprehensive comments
- Error boundaries (production-ready)

### **Scalability**
- Adding new node types: Create component + add to nodeTypes registry
- New form fields: Add to type definition + form component
- New validations: Extend validation logic in mockApi.ts

---

## 🎨 Design System

### **Color Palette**
- Start Node: `#10b981` (Green) - Represents beginning
- Task Node: `#3b82f6` (Blue) - Human actions
- Approval Node: `#f59e0b` (Orange) - Decision points
- Automated Node: `#8b5cf6` (Purple) - System actions
- End Node: `#ef4444` (Red) - Completion
- Primary Accent: `#667eea` (Indigo) - Headers, buttons

### **Typography**
- System fonts for performance
- Font sizes: 0.75rem - 1.75rem scale
- Font weights: 400 (normal), 600 (semi-bold), 700 (bold)

### **Spacing System**
- Base unit: 0.25rem (4px)
- Scale: 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem

---

## 📊 What I Would Add With More Time

### **High Priority**
1. **Undo/Redo** - Command pattern for action history
2. **Import Workflow** - Load JSON files back into editor
3. **Node Templates** - Pre-configured common node types
4. **Conditional Edges** - If/else branches in workflow
5. **Real Backend** - Replace mock API with actual endpoints

### **Medium Priority**
6. **Auto-layout** - Dagre algorithm for automatic positioning
7. **Validation Errors on Nodes** - Visual indicators on canvas
8. **Node Search/Filter** - Find nodes in large workflows
9. **Workflow Versioning** - Track changes over time
10. **Collaborative Editing** - Multiple users editing simultaneously

### **Low Priority**
11. **Dark Mode** - Theme toggle
12. **Accessibility** - ARIA labels, keyboard navigation
13. **Unit Tests** - Jest + React Testing Library
14. **E2E Tests** - Cypress/Playwright
15. **Performance Metrics** - React DevTools Profiler integration

---

## 🐛 Known Limitations

1. **No persistence** - Workflows lost on refresh (as per requirements)
2. **No authentication** - No user management (as per requirements)
3. **Client-side only** - No backend server (as per requirements)
4. **Limited validation** - Basic cycle detection only
5. **No conflict resolution** - Single-user editing only

---

## 🧠 Key Technical Decisions

### **Why React Flow over D3.js?**
- Built specifically for node-based editors
- Handles positioning, zoom, pan out of the box
- Better TypeScript support
- Cleaner API for this use case

### **Why Vite over Create React App?**
- 10-100x faster HMR
- Smaller bundle sizes
- Modern ESM-based build
- Better TypeScript support

### **Why Mock API instead of hardcoded data?**
- Simulates real-world async patterns
- Easy to replace with actual backend
- Tests async state management
- More realistic development experience

### **Why no state management library?**
- Application state is simple and localized
- React Flow manages graph state
- Form state is component-local
- Avoiding unnecessary complexity

---

## 📚 Learning Resources

If you want to understand this codebase:

1. **React Basics:** [react.dev](https://react.dev)
2. **TypeScript Handbook:** [typescriptlang.org](https://www.typescriptlang.org/docs/)
3. **React Flow Docs:** [reactflow.dev](https://reactflow.dev)
4. **Vite Guide:** [vitejs.dev](https://vitejs.dev/guide/)

---

## 🙋 Questions I Anticipated

**Q: Why TypeScript instead of JavaScript?**  
A: Type safety catches bugs at compile time, better IDE support, self-documenting code, required by case study.

**Q: How extensible is this for new node types?**  
A: Very. Add interface to `types/workflow.ts`, create component, register in `nodeTypes`, add form case.

**Q: Can this handle large workflows (100+ nodes)?**  
A: Yes. React Flow is optimized for large graphs. Would recommend virtualization at 500+ nodes.

**Q: How do you handle form validation?**  
A: Currently basic HTML5 validation. Would add Zod/Yup for complex validation in production.

**Q: What about mobile support?**  
A: Works on tablets. Phone support would need responsive redesign of sidebar/panels.

---

## 📝 Assumptions Made

1. No authentication required (as stated)
2. No backend persistence needed (as stated)
3. Single user editing (no real-time collaboration)
4. Modern browser support (ES2020+)
5. Desktop-first design (optimized for 1440px+ screens)
6. Simple validation rules (would expand in production)

---

## 🎓 What I Learned

Through building this project:
- Deep understanding of React Flow architecture
- Complex form state management patterns
- Graph algorithms (cycle detection, traversal)
- TypeScript discriminated unions
- Component composition strategies
- Performance optimization with memo/callback

---

## 👨‍💻 About the Implementation

This solution demonstrates:
- ✅ **Clean Architecture** - Modular, scalable, maintainable
- ✅ **Type Safety** - Comprehensive TypeScript usage
- ✅ **Modern React** - Hooks, functional components, best practices
- ✅ **Production Quality** - Performance optimizations, error handling
- ✅ **Extensibility** - Easy to add features and node types
- ✅ **UX Polish** - Smooth animations, clear visual feedback

**Time spent:** ~5 hours (planning, implementation, documentation)

---

## 📄 License

This is a case study project for Tredence Analytics internship application.

---

**Built with ❤️ for Tredence Analytics**
