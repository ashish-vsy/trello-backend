import { supabase } from "../db/supabase.js";
export const addUserToTask = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usertaskrelation')
            .insert(req.body)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


export const getUserTasks = async (req, res) => {
    const taskid = req.args.get('taskid')
    if (!taskid) {
        return res.status(400).json({ message: "Task ID is required" });
    }
    try {
        const { data, error } = await supabase
            .from('usertaskrelation')
            .select('*')
            .eq('taskid', taskid)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}