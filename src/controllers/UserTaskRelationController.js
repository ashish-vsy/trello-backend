import { supabase } from "../db/supabase";
exports.addUserToTask = async (req, res) => {
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