
import { supabase } from "../db/supabase";

exports.getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.params.id)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.createUser = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert(req.body)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getUserByOrganizationId = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('orgid', req.params.orgid)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.editUser = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(req.body)
            .eq('id', req.params.id)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', req.params.id)
        if (error) {
            return res.status(500).json({ message: error.message })
        }
        return res.status(200).json({ data })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}