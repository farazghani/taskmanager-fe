"use client";

import React, { useState, useEffect } from "react";
import API from "@/api/api";
import { useRouter } from "next/navigation";
import { signOut } from "@/api/auth";
import PomodoroCounter from "@/components/pomodoro-counter";

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
  const [loading, setLoading] = useState(false); //ading loading finctionality
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
  }, [router]);

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
    
    //  Prevent duplicate clicks
    if (loading) return;

  setLoading(true);
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
     await fetchTasks();
    } catch (err) {
      console.log("Error saving task:", err);
    }finally{
      setLoading(false);
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
      case 'high': return 'text-rose-100 bg-rose-500/15 border-rose-400/20';
      case 'medium': return 'text-amber-100 bg-amber-500/15 border-amber-400/20';
      case 'low': return 'text-sky-100 bg-sky-500/15 border-sky-400/20';
      default: return 'text-slate-100 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0f1017] font-sans text-[#f4f0e8]">
      
      {/* LEFT SIDEBAR (List View) */}
      <aside className={`w-full md:w-[23rem] flex flex-col flex-shrink-0 border-r border-white/10 bg-[#151722] transition-all duration-300 ${selectedTaskId || isCreating ? 'hidden md:flex' : 'flex'}`}>
        <div className="border-b border-white/10 p-3">
          <PomodoroCounter
            variant="compact"
            workMinutes={25}
            breakMinutes={5}
            className="w-full"
          />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-gradient-to-br from-indigo-400 via-sky-400 to-emerald-500 p-1.5">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#fffaf0]">
              TaskFlow
            </span>
          </div>
          <div className="flex items-center gap-2">
  <button
    onClick={handleCreateNew}
    disabled={loading }
    className={`p-2 rounded-full transition-colors 
      ${loading  
        ? "bg-white/5 text-white/30 cursor-not-allowed" 
        : "bg-white/5 text-emerald-200 hover:bg-white/10"
      }`}
  >
    {loading ? (
      <span className="animate-spin w-5 h-5 rounded-full border-2 border-emerald-300 border-t-transparent"></span>
    ) : (
      <Plus className="w-5 h-5" />
    )}
  </button>

  <button
    className="md:hidden p-2 text-white/70"
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  >
    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
  </button>
</div>

        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-white/5 px-4 py-2">
            <button
              onClick={signOut}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-200 hover:bg-white/5"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Desktop Sign Out */}
        <div className="hidden border-b border-white/10 px-4 py-2 md:block">
          <button
            onClick={signOut}
            className="text-sm font-medium text-rose-200 hover:text-rose-100"
          >
            Sign Out
          </button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3 border-b border-white/10 bg-white/3 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35" />
            <input 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#232531] py-2.5 pl-10 pr-4 text-sm text-[#f4f0e8] outline-none placeholder:text-white/30 focus:border-[#7c6bff] focus:ring-2 focus:ring-[#7c6bff]/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['all', 'active', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as "all" | "active" | "completed")}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors whitespace-nowrap ${
                  filterStatus === status 
                  ? 'bg-[#f4efe7] text-[#1f1f24] border-[#f4efe7]' 
                  : 'bg-transparent text-[#c8c0b6] border-white/10 hover:bg-white/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {filteredTasks.length === 0 ? (
            <div className="py-10 text-center text-white/40">
              <p className="text-sm">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task._id}
                onClick={() => handleSelectTask(task)}
                className={`group p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  selectedTaskId === task._id 
                  ? 'border-[#7c6bff]/40 bg-white/8 shadow-[0_16px_40px_rgba(0,0,0,0.24)] ring-1 ring-[#7c6bff]/25' 
                  : 'border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskStatus(task._id, task.status);
                    }}
                    className={`mt-0.5 transition-colors ${task.status === 'done' ? 'text-emerald-300' : 'text-white/30 hover:text-emerald-300'}`}
                  >
                    {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${task.status === 'done' ? 'text-white/35 line-through' : 'text-[#f7f1e8]'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className={`text-[10px] flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-rose-300' : 'text-white/45'}`}>
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
        <div className="border-t border-white/10 p-3 text-center text-xs text-white/35">
          {filteredTasks.length} tasks • {filteredTasks.filter(t => t.status === 'done').length} completed
        </div>
      </aside>

      {/* RIGHT MAIN AREA (Dynamic Details) */}
      <main className={`flex h-full flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(120,100,255,0.12),_transparent_32%),linear-gradient(180deg,_#1a1b24_0%,_#14151c_100%)] transition-all duration-300 ${(!selectedTaskId && !isCreating) ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Mobile Header (Back Button) */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 p-3 md:hidden">
          <button onClick={() => { setSelectedTaskId(null); setIsCreating(false); }} className="p-2 -ml-2 text-white/70">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold text-[#f7f1e8]">{isCreating ? 'New Task' : 'Task Details'}</span>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto">
          {isCreating || (selectedTaskId && isEditing) ? (
            // --- EDIT/CREATE FORM ---
            <div className="mx-auto max-w-2xl p-4 sm:p-6">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#1f202b] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                <div className="space-y-5 p-5 sm:space-y-6 sm:p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-[#f7f1e8]">
                    {isCreating ? 'Create New Task' : 'Edit Task'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#d9d1c6]">Task Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full rounded-2xl border border-white/10 bg-[#232531] px-4 py-2.5 text-[#f7f1e8] outline-none transition-all placeholder:text-white/30 focus:border-[#7c6bff] focus:ring-2 focus:ring-[#7c6bff]/20"
                        placeholder="What needs to be done?"
                        autoFocus
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-[#d9d1c6]">Priority</label>
                        <select 
                          value={formData.priority}
                          onChange={(e) => setFormData({...formData, priority: e.target.value as "low" | "medium" | "high"})}
                          className="w-full rounded-2xl border border-white/10 bg-[#232531] px-4 py-2.5 text-[#f7f1e8] outline-none focus:border-[#7c6bff] focus:ring-2 focus:ring-[#7c6bff]/20"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-[#d9d1c6]">Due Date</label>
                        <input 
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                          className="w-full rounded-2xl border border-white/10 bg-[#232531] px-4 py-2.5 text-[#f7f1e8] outline-none focus:border-[#7c6bff] focus:ring-2 focus:ring-[#7c6bff]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#d9d1c6]">Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={6}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#232531] px-4 py-2.5 text-[#f7f1e8] outline-none placeholder:text-white/30 focus:border-[#7c6bff] focus:ring-2 focus:ring-[#7c6bff]/20"
                        placeholder="Add more details..."
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-white/5 px-5 py-4 sm:px-6">
                  <button 
                    onClick={() => { 
                      if (isCreating) {
                        setSelectedTaskId(null);
                        setIsCreating(false);
                      } else {
                        setIsEditing(false);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#c8c0b6] transition-colors hover:text-[#f7f1e8]"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!formData.title.trim()}
                    className="flex items-center gap-2 rounded-2xl bg-[#f4efe7] px-6 py-2 text-sm font-medium text-[#1f1f24] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="flex items-start justify-between border-b border-white/10 bg-white/5 px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleTaskStatus(selectedTask._id, selectedTask.status)}
                    className="mt-1 transition-transform active:scale-95"
                  >
                    {selectedTask.status === 'done' ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                    ) : (
                      <Circle className="w-8 h-8 text-white/30 hover:text-emerald-300" />
                    )}
                  </button>
                  <div>
                    <h1 className={`text-2xl font-semibold tracking-tight ${selectedTask.status === 'done' ? 'text-white/35 line-through' : 'text-[#f7f1e8]'}`}>
                      {selectedTask.title}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getPriorityColor(selectedTask.priority)}`}>
                        <Flag className="w-3 h-3 mr-1.5" />
                        {selectedTask.priority}
                      </span>
                      {selectedTask.dueDate && (
                        <span className="inline-flex items-center text-sm text-white/55">
                          <Calendar className="w-4 h-4 mr-1.5 text-white/40" />
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
                    className="rounded-xl p-2 text-white/45 transition-colors hover:bg-white/5 hover:text-[#f7f1e8]"
                    title="Edit Task"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedTask._id)}
                    className="rounded-xl p-2 text-white/45 transition-colors hover:bg-white/5 hover:text-rose-300"
                    title="Delete Task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8">
                <div className="max-w-3xl">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#c8c0b6]">Description</h3>
                  {selectedTask.description ? (
                    <p className="whitespace-pre-wrap leading-relaxed text-[#d9d1c6]">
                      {selectedTask.description}
                    </p>
                  ) : (
                    <p className="italic text-white/35">No description provided.</p>
                  )}

                  <div className="mt-10 border-t border-white/10 pt-6 sm:mt-12 sm:pt-8">
                    <div className="flex gap-8 text-sm text-white/55">
                      <div>
                        <span className="mb-1 block font-medium text-[#f7f1e8]">Status</span>
                        <span className="capitalize">{selectedTask.status === 'done' ? 'Completed' : 'In Progress'}</span>
                      </div>
                      <div>
                        <span className="mb-1 block font-medium text-[#f7f1e8]">Task ID</span>
                        <span className="font-mono text-xs">#{selectedTask._id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          ) : (
            // --- EMPTY STATE ---
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white/45">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/6">
                <Layout className="w-10 h-10 text-white/25" />
              </div>
              <h3 className="text-xl font-semibold text-[#f7f1e8]">No Task Selected</h3>
              <p className="mx-auto mt-2 mb-8 max-w-xs">
                Select a task from the list to view details or create a new one to get started.
              </p>
              <button 
                onClick={handleCreateNew}
                className="flex items-center gap-2 rounded-2xl bg-[#f4efe7] px-6 py-3 font-medium text-[#1f1f24] transition-colors hover:bg-white"
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
