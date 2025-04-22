import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios"; // Adjust the import based on your project structure
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  console.log("User:", user);
  // Set up authorization header for all requests
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    }
  }, [user]);

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/todo");

      // Transform the data to match our component structure
      // Using our DB schema (title, completed, created_at)
      const formattedTasks = response.data.map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.created_at,
        // Default values for features not in DB
        priority: "medium",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;

      await api.put(`/api/todo/${id}`, {
        completed: updatedStatus,
      });

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: updatedStatus } : task
        )
      );

      toast({
        title: "Success",
        description: `Task marked as ${
          updatedStatus ? "completed" : "incomplete"
        }.`,
      });
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add new task
  const addTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        const response = await api.post("/api/todo", {
          title: newTaskTitle,
        });

        // Format the response to match our component structure
        const newTask = {
          id: response.data.id,
          title: response.data.title,
          completed: response.data.completed || false,
          createdAt: response.data.created_at,
          // Default values for features not in DB
          priority: "medium",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        };

        setTasks([...tasks, newTask]);
        setNewTaskTitle("");

        toast({
          title: "Success",
          description: "Task added successfully.",
        });
      } catch (error) {
        console.error("Failed to add task:", error);
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/todo/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));

      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="outline">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // Get style for due date
  const getDueDateStyle = (dueDate) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (dueDate < today) return "text-red-500 font-medium";
    if (dueDate === today) return "text-orange-500 font-medium";
    if (dueDate === tomorrow) return "text-yellow-500";
    return "";
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Add new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="flex-1"
        />
        <Button onClick={addTask} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Loading tasks...
              </TableCell>
            </TableRow>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TableRow
                key={task.id}
                className={task.completed ? "opacity-60" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() =>
                      toggleTaskCompletion(task.id, task.completed)
                    }
                  />
                </TableCell>
                <TableCell className={task.completed ? "line-through" : ""}>
                  {task.title}
                </TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell className={getDueDateStyle(task.dueDate)}>
                  {task.dueDate}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          toggleTaskCompletion(task.id, task.completed)
                        }
                      >
                        Mark as {task.completed ? "Incomplete" : "Complete"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
