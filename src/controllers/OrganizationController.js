import { supabase } from "../db/supabase";

exports.getOrganizationById = async (req, res) => {
  try {

    const { data, error } = await supabase.from("organizations").select("*").eq("id", req.params.id);
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if(Object.keys(data).length === 0) {
        return res.status(400).json({ message: "Organization not found" });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.editOrganization = async (req, res) => {
  try {

    const orgId = req.params.id;
    const {data: org, nameError} = await supabase.from("organizations").select("orgname").eq("id", orgId);
    if(!org.length > 0) {
      return res.status(400).json({ message: "Organization not found" });
    }

    const { orgname } = req.body;
    if(orgname.trim().lenght < 4){
        return res.status(400).json({ message: "Name must be at least 4 characters long" });
    }
    const { data, error } = await supabase.from("organizations").update(orgname).eq("id", orgId);
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addOrganization = async (req, res) => {
  try {
    const { orgname } = req.body;
    if (!orgname) {
      return res.status(400).json({ message: "Name is required" });
    }

    const { data: org, getError } = await supabase.from("organizations").select("orgname").eq("orgname", orgname);
    if (org.length > 0) {
      return res.status(400).json({ message: "Organization already exists" });
    }
    if(orgname.trim().lenght < 4){
        return res.status(400).json({ message: "Name must be at least 4 characters long" });
    }

    const inserData = {
      orgname: orgname,
    };

    const { data, error } = await supabase.from("organizations").insert(inserData);
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

