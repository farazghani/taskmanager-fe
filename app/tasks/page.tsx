"use client";

import React, { useState, useEffect } from "react";
import API from "@/api/api";
import { useRouter } from "next/navigation";
import { signOut } from "@/api/auth";

import { Plus,Trash2,CheckCircle2,Circle,Calendar,Flag, Search,Layout,ChevronLeft,Edit3,Save,Menu, X} from "lucide-react";

interface Task {
  _id: string;
  title: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  description?: string;
  dueDate?: string;
}

const TasksPage: React.FC = () => {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Edit/Create Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium' as "low" | "medium" | "high",
    dueDate: '',
    description: '',
    status: 'todo' as "todo" | "in-progress" | "done"
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/login");
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/task");
      setTasks(res.data.tasks);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const selectedTask = tasks.find(t => t._id === selectedTaskId);

  const filteredTasks = tasks
    .filter((task) => {
      if (filterStatus === "active") return task.status !== "done";
      if (filterStatus === "completed") return task.status === "done";
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSelectTask = (task: Task) => {
    setSelectedTaskId(task._id);
    setFormData({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      description: task.description || '',
      status: task.status
    });
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedTaskId(null);
    setIsCreating(true);
    setIsEditing(false);
    setFormData({
      title: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      description: '',
      status: 'todo'
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      if (isCreating) {
        await API.post("/task", {
          title: formData.title,
          priority: formData.priority,
          dueDate: formData.dueDate || null,
          description: formData.description,
          status: formData.status
        });
        setIsCreating(false);
      } else if (selectedTaskId) {
        await API.put(`/task/${selectedTaskId}`, {
          title: formData.title,
          priority: formData.priority,
          dueDate: formData.dueDate || null,
          description: formData.description,
          status: formData.status
        });
        setIsEditing(false);
      }
      fetchTasks();
    } catch (err) {
      console.log("Error saving task:", err);
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    try {
      await API.put(`/task/${id}`, { status: newStatus });
      
      if (selectedTaskId === id) {
        setFormData(prev => ({ ...prev, status: newStatus as "todo" | "in-progress" | "done" }));
      }
      fetchTasks();
    } catch (err) {
      console.log("Error toggling task:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/task/${id}`);
      if (selectedTaskId === id) {
        setSelectedTaskId(null);
        setIsEditing(false);
      }
      fetchTasks();
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR (List View) */}
      <aside className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 transition-all duration-300 ${selectedTaskId || isCreating ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCreateNew} className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-2 border-b bg-slate-50">
            <button
              onClick={signOut}
              className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Desktop Sign Out */}
        <div className="hidden md:block px-4 py-2 border-b">
          <button
            onClick={signOut}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Sign Out
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 space-y-3 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 pl-10 pr-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'active', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as "all" | "active" | "completed")}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors whitespace-nowrap ${
                  filterStatus === status 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task._id}
                onClick={() => handleSelectTask(task)}
                className={`group p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  selectedTaskId === task._id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200' 
                  : 'bg-white border-slate-100 hover:border-indigo-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskStatus(task._id, task.status);
                    }}
                    className={`mt-0.5 transition-colors ${task.status === 'done' ? 'text-indigo-500' : 'text-slate-300 hover:text-indigo-500'}`}
                  >
                    {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className={`text-[10px] flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-500' : 'text-slate-400'}`}>
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t text-xs text-center text-slate-400">
          {filteredTasks.length} tasks • {filteredTasks.filter(t => t.status === 'done').length} completed
        </div>
      </aside>

      {/* RIGHT MAIN AREA (Dynamic Details) */}
      <main className={`flex-1 flex flex-col bg-slate-50 h-full overflow-hidden transition-all duration-300 ${(!selectedTaskId && !isCreating) ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Mobile Header (Back Button) */}
        <div className="md:hidden bg-white border-b p-3 flex items-center gap-2">
          <button onClick={() => { setSelectedTaskId(null); setIsCreating(false); }} className="p-2 -ml-2 text-slate-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold text-slate-800">{isCreating ? 'New Task' : 'Task Details'}</span>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto">
          {isCreating || (selectedTaskId && isEditing) ? (
            // --- EDIT/CREATE FORM ---
            <div className="max-w-2xl mx-auto p-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    {isCreating ? 'Create New Task' : 'Edit Task'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Task Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-700 focus:ring-2  text-slate-700 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="What needs to be done?"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">Priority</label>
                        <select 
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value as "low" | "medium" | "high"})}
                          className="w-full px-4 py-2 rounded-lg text-slate-700 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">Due Date</label>
                        <input 
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={6}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        placeholder="Add more details..."
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button 
                    onClick={() => { 
                      if (isCreating) {
                        setSelectedTaskId(null);
                        setIsCreating(false);
                      } else {
                        setIsEditing(false);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!formData.title.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Save Task
                  </button>
                </div>
              </div>
            </div>

          ) : selectedTask ? (
            // --- VIEW DETAIL ---
            <div className="h-full flex flex-col">
              {/* Detail Header */}
              <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleTaskStatus(selectedTask._id, selectedTask.status)}
                    className="mt-1 transition-transform active:scale-95"
                  >
                    {selectedTask.status === 'done' ? (
                      <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                    ) : (
                      <Circle className="w-8 h-8 text-slate-300 hover:text-indigo-400" />
                    )}
                  </button>
                  <div>
                    <h1 className={`text-2xl font-bold ${selectedTask.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {selectedTask.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getPriorityColor(selectedTask.priority)}`}>
                        <Flag className="w-3 h-3 mr-1.5" />
                        {selectedTask.priority}
                      </span>
                      {selectedTask.dueDate && (
                        <span className="inline-flex items-center text-sm text-slate-500">
                          <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
                          {new Date(selectedTask.dueDate).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { 
                      setFormData({
                        title: selectedTask.title,
                        priority: selectedTask.priority,
                        dueDate: selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : '',
                        description: selectedTask.description || '',
                        status: selectedTask.status
                      });
                      setIsEditing(true);
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Task"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedTask._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-3xl">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Description</h3>
                  {selectedTask.description ? (
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedTask.description}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic">No description provided.</p>
                  )}

                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex gap-8 text-sm text-slate-500">
                      <div>
                        <span className="block font-medium text-slate-900 mb-1">Status</span>
                        <span className="capitalize">{selectedTask.status === 'done' ? 'Completed' : 'In Progress'}</span>
                      </div>
                      <div>
                        <span className="block font-medium text-slate-900 mb-1">Task ID</span>
                        <span className="font-mono text-xs">#{selectedTask._id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          ) : (
            // --- EMPTY STATE ---
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Layout className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700">No Task Selected</h3>
              <p className="max-w-xs mx-auto mt-2 mb-8">
                Select a task from the list to view details or create a new one to get started.
              </p>
              <button 
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                <Plus className="w-5 h-5" />
                Create New Task
              </button>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default TasksPage;