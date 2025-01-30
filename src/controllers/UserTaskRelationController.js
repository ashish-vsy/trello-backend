import { supabase } from "../db/supabase.js";
export const addUserToTask = async (req, res) => {
    try {
        const { taskid, userid } = req.body;

        const { error: deleteError } = await supabase
            .from("usertaskrelation")
            .delete()
            .eq("taskid", taskid);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        const insertPromises = userid.map(async (user_data) => {
            const user_id = user_data?.id;
            const { error } = await supabase
                .from("usertaskrelation")
                .insert({ taskid, assigned_to: user_id, assigned_at: new Date() });

            if (error) {
                throw new Error(error.message);
            }
        });

        await Promise.all(insertPromises);

        return res.status(200).json({ message: "User added to task successfully" });
    } catch (error) {
        console.error("Error adding user to task:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const getUserTasks = async (req, res) => {
    const taskid = req.params.taskid;

    if (!taskid) {
        return res.status(400).json({ message: "Task ID is required" });
    }

    try {
        const { data, error } = await supabase
            .from("usertaskrelation")
            .select("assigned_to")
            .eq("taskid", taskid);

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(200).json({ message: "No users assigned to this task" });
        }

        const userIds = data.map(task => task.assigned_to);

        const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, firstname, lastname, profilecolor")
            .in("id", userIds);

        if (userError) {
            return res.status(500).json({ message: userError.message });
        }

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUserTasks:", error);
        return res.status(500).json({ message: error.message });
    }
};
