import { supabase } from "../db/supabase.js";

export const getOrganizationById = async (req, res) => {
  try {
    const { data, error } = await supabase.from("organization").select("*").eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if(Object.keys(data).length === 0) {
        return res.status(400).json({ message: "Organization not found" });
    }
    const data_to_return = {
        id: data[0].id,
        orgname: data[0].orgname
    }
    return res.status(200).json({ data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {

    const orgId = req.params.id;
    const {data: org, nameError} = await supabase.from("organization").select("orgname").eq("id", orgId).select();
    if(!org.length > 0) {
      return res.status(400).json({ message: "Organization not found" });
    }

    const { orgname } = req.body;
    if(orgname.trim().lenght < 4){
        return res.status(400).json({ message: "Name must be at least 4 characters long" });
    }
    const { data, error } = await supabase.from("organization").update({orgname: orgname}).eq("id", orgId).select();
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    const data_to_return = {
        id: data[0].id,
        orgname: data[0].orgname
    }
    return res.status(200).json({ data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addOrganization = async (req, res) => {
  try {
    const { orgname } = req.body;
    if (!orgname) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (orgname.trim().length < 4) {
      return res.status(400).json({ message: "Name must be at least 4 characters long" });
    }

    const { data: org, error: getError } = await supabase
      .from("organization")
      .select("orgname")
      .eq("orgname", orgname);

    if (getError) {
      return res.status(500).json({ message: getError.message });
    }

    if (org.length > 0) {
      return res.status(400).json({ message: "Organization already exists" });
    }

    const inserData = {
      orgname: orgname,
    };

    const { data, error } = await supabase.from("organization").insert(inserData).select();
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    const data_to_return = {
      id: data[0].id,
      orgname: data[0].orgname,
    }
    return res.status(200).json({ data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

