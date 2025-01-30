import { supabase } from "../db/supabase.js";

export const getAllTasks = async (req, res) => {
  try {
    const orgid = req.params.id;
    if (!orgid) {
      return res.status(400).json({ message: "Organization ID is required" });
    }
    const { data: org, error: orgError } = await supabase.from("organization").select("orgname").eq("id", orgid);
    if (orgError) {
      return res.status(500).json({ message: "Error fetching tasks" });
    }
    if (org?.length === 0) {
      return res.status(400).json({ message: "Organization not found " });
    }
    const { data:tasks, taskerror } = await supabase
      .from("tasks")
      .select("id, taskname, taskdescription, priority, status, duedate, userid")
      .eq("orgid", orgid);

    if (taskerror) {
      return res.status(500).json({ message: error.message });
    }
    const enhancedTasks = await Promise.all(tasks.map(async (task) => {
      const user_id = task.userid;
      
      const { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("firstname, profilecolor")
        .eq("id", user_id);
        
      if (userError) {
        console.error('error', userError);
        return task;
      }
      
      if (!userInfo || userInfo.length === 0) {
        console.error(`No user found with id: ${task.userid}`);
        return task;
      }
      
      return {
        ...task,
        profilecolor: userInfo[0].profilecolor,
        firstname: userInfo[0].firstname
      };
    }));
    return res.status(200).json(enhancedTasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTaskDetailsById = async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No Task found with id: " + req.params.id });
    }
    const data_to_return = {
      id: data[0].id,
      taskname: data[0].taskname,
      taskdescription: data[0].taskdescription,
      priority: data[0].priority,
      status: data[0].status,
      duedate: data[0].duedate,
    };
    return res.status(200).json({ data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { data: task, error: nameError } = await supabase.from("tasks").select("taskname").eq("id", taskId);
    if (nameError) {
      return res.status(500).json({ message: nameError.message });
    }
    if (!task.length > 0) {
      return res.status(400).json({ message: "Task not found" });
    }

    const { taskname, taskdescription, priority, status, duedate } = req.body;
    if (taskname && taskname.trim().length < 3) {
      return res.status(400).json({ message: "Task name is required" });
    }
    if (taskdescription && taskdescription.trim().length < 3) {
      return res.status(400).json({ message: "Task description is required" });
    }
    if (priority && !["high", "medium", "low"].includes(priority)) {
      return res.status(400).json({ message: "Priority must be 'high', 'medium', or 'low'" });
    }
    if (status && !["completed", "pending", "not started"].includes(status)) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (duedate && duedate.trim().length < 3) {
      return res.status(400).json({ message: "Due date is required" });
    }
    const data_to_update = {
      taskname: taskname || task[0].taskname,
      taskdescription: taskdescription || task[0].taskdescription,
      priority: priority || task[0].priority,
      status: status || task[0].status,
      duedate: duedate || task[0].duedate,
    };
    const { data, error } = await supabase.from("tasks").update(data_to_update).eq("id", taskId).select();
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    const data_to_return = {
      id: data[0].id,
      taskname: data[0].taskname,
      taskdescription: data[0].taskdescription,
      priority: data[0].priority,
      status: data[0].status,
      duedate: data[0].duedate,
    };
    return res.status(200).json({ data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addTask = async (req, res) => {
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

    const insertData = {
      orgid: orgid,
      userid: userid,
      taskname: taskname,
      priority: priority,
      status: status,
      duedate: duedate,
    };

    const { data, error } = await supabase.from("tasks").insert(insertData).select();
    if (error) {
      return res.status(500).json({ message: "Error adding task", error: error.message });
    }
    const data_to_return = {
      id: data[0].id,
      orgid: data[0].orgid,
      userid: data[0].userid,
      taskname: data[0].taskname,
      priority: data[0].priority,
      status: data[0].status,
      duedate: data[0].duedate,
    };
    return res.status(201).json({ message: "Task added successfully", data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
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
