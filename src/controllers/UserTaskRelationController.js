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
    try {
        const { data, error } = await supabase
            .from('usertaskrelation')
            .select('*')
            .eq('userid', req.params.id)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}