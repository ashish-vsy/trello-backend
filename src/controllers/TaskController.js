import { supabase } from "../db/supabase";

exports.getAllTasks = async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("id, title, description, priority");
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No Task found with id: " + req.params.id });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.editTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { data: task, nameError } = await supabase.from("tasks").select("title").eq("id", taskId);
    if (!task.length > 0) {
      return res.status(400).json({ message: "Task not found" });
    }

    const { taskname, taskdescription } = req.body;
    if (taskname.trim().length < 3) {
      return res.status(400).json({ message: "Task name is required" });
    }
    if ( taskdescription && taskdescription.trim().length < 3) {
      return res.status(400).json({ message: "Task description is required" });
    }
   
    const { data, error } = await supabase.from("tasks").update(req.body).eq("id", taskId);
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addTask = async (req, res) => {
    try {
      const { orgid, userid, taskname, priority, status, duedate } = req.body;
  
      
      if (!orgid || !userid || !taskname || !priority || !status || !duedate) {
        return res.status(400).json({ message: "orgid, userid, taskname, priority, status and duedate are required" });
      }
      if (taskname.trim().length < 3) {
        return res.status(400).json({ message: "Task name must be at least 3 characters long" });
      }
      if (!["high", "medium", "low"].includes(priority)) {
        return res.status(400).json({ message: "Priority must be 'high', 'medium', or 'low'" });
      }
      if (!["completed", "pending", "not started"].includes(status)) {
        return res.status(400).json({ message: "Status must be 'completed', 'pending', or 'not started'" });
      }
  
      const { data, error } = await supabase.from("tasks").insert(req.body);
      if (error) {
        return res.status(500).json({ message: "Error adding task", error: error.message });
      }
      return res.status(201).json({ message: "Task added successfully", data });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };

exports.deleteTask = async (req, res) => {
    try {
      const id  = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Task ID is required" });
      }
  
      const { data, error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) {
        return res.status(500).json({ message: "Error deleting task", error: error.message });
      }
      if (!data.length) {
        return res.status(404).json({ message: `No task found with ID: ${id}` });
      }
      return res.status(200).json({ message: "Task deleted successfully", data });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
