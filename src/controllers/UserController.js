import { supabase } from "../db/supabase.js";
import { isValidEmail, isValidPassword } from "../utils.js";
import bcrypt from "bcrypt";
const saltRounds = 5;
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const UserSignUp = async (req, res) => {
  try {
    const recieved_data = req.body;
    const firstname = recieved_data.firstname;
    const lastname = recieved_data.lastname;
    const email = recieved_data.email;
    const password = recieved_data.password;
    const profilecolor = recieved_data.profilecolor;
    const orgName = recieved_data.orgName;
    if (!firstname || !email || !password || !orgName) {
      return res.status(400).json({ message: "Firstname, email, OrganizationName, and password are required" });
    }

    if (firstname.trim().length < 4) {
      return res.status(400).json({ message: "Firstname must be at least 4 characters long" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain at least one number and one special character",
      });
    }
    const { data: existingOrg, error: orgerror } = await supabase
      .from("organization")
      .select("id")
      .eq("orgname", orgName);
    if (orgerror) {
      return res.status(500).json({ message: "Error fetching organization", error: orgerror.message });
    }
    let orgid = null;
    if (!existingOrg.length > 0) {
      const { data: orgdata, insertError } = await supabase.from("organization").insert({ orgname: orgName }).select();
      if (insertError) {
        return res.status(500).json({ message: "Error creating organization", error: insertError.message });
      }
      orgid = orgdata[0].id;
    } else {
      orgid = existingOrg[0].id;
    }

    const hasshedPassword = await bcrypt.hash(password, saltRounds);

    const insertData = {
      orgid: orgid,
      firstname: firstname,
      lastname: lastname || "",
      email: email,
      password: hasshedPassword,
      profilecolor: profilecolor || "",
      created_at: new Date(),
    };

    const { data, error } = await supabase.from("users").insert(insertData).select();
    if (error) {
      return res.status(500).json({ message: "Error signing up", error: error.message });
    }
    const response_to_send = {
      id: data[0].id,
      orgid: data[0].orgid,
      firstname: data[0].firstname,
      lastname: data[0].lastname,
      email: data[0].email,
      profilecolor: data[0].profilecolor,
      created_at: data[0].created_at,
    };
  

    return res.status(200).json({ message: "User signed up successfully", data: response_to_send });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};





export const userLogin = async (req, res) => {
  try {
    const { email, password, orgname } = req.body;

    if (!email || !password || !orgname) {
      return res.status(400).json({ message: "Enter all required fields" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const { data: orgdata, orgerror } = await supabase.from("organization").select("id").eq("orgname", orgname);
    if (orgerror) {
      return res.status(500).json({ message: "Error fetching organization", error: orgerror.message });
    }
    if (!orgdata.length) {
      return res.status(404).json({ message: `No organization found with name: ${orgname}` });
    }

    const { data, error } = await supabase.from("users").select("*").eq("email", email).eq("orgid", orgdata[0].id);
    if (error) {
      return res.status(500).json({ message: "Error fetching user", error: error.message });
    }
    if (!data.length) {
      return res.status(404).json({ message: `No user found with email: ${email}` });
    }

    const user = data[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const user_data = {
      id: user.id,
      orgid: user.orgid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profilecolor: user.profilecolor,
    };

    const token = jwt.sign({ type: "member", userid: user_data.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  
    const responseData = {
      ...user_data, 
      token: token  
    };

    return res.status(200).json({
      message: "User logged in successfully",
      data: responseData,  
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const orgid = req.query.orgid;
    if (!orgid) {
      return res.status(400).json({ message: "Organization ID is required" });
    }
    const { data, error } = await supabase.from("users").select("*").eq("orgid", orgid);
    if (error) {
      return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
    const data_to_return = data.map((user) => ({
      id: user.id,
      orgid: user.orgid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profilecolor: user.profilecolor,
    }));


    return res.status(200).json({ message: "User logged in successfully", data: data_to_return});
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { data, error } = await supabase.from("users").select("*").eq("id", userId);
    if (error) {
      return res.status(500).json({ message: "Error fetching user", error: error.message });
    }
    if (!data.length) {
      return res.status(404).json({ message: `No user found with ID: ${userId}` });
    }
    const { data: orgname, orgerror } = await supabase
      .from("organization")
      .select("orgname")
      .eq("id", data[0].orgid)
      .select();
    const data_to_return = {
      id: data[0].id,
      orgname: orgname[0].orgname,
      orgid: data[0].orgid,
      firstname: data[0].firstname,
      lastname: data[0].lastname,
      email: data[0].email,
      profilecolor: data[0].profilecolor,
    };
    return res.status(200).json({ data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserByOrganizationId = async (req, res) => {
  try {
    const orgId = req.params.orgid;
    if (!orgId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const { data, error } = await supabase.from("users").select("*").eq("orgid", orgId);
    if (error) {
      return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
    if (!data.length) {
      return res.status(404).json({ message: `No users found for organization ID: ${orgId}` });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId);
    if (userError) {
      return res.status(500).json({ message: "Error fetching user", error: userError.message });
    }
    if (!user.length) {
      return res.status(404).json({ message: `No user found with ID: ${userId}` });
    }

    const { name, email } = req.body;
    if (name && name.trim().length < 4) {
      return res.status(400).json({ message: "Name must be at least 4 characters long" });
    }
    if (email && !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const { data, error } = await supabase.from("users").update(req.body).eq("id", userId).select();
    if (error) {
      return res.status(500).json({ message: "Error updating user", error: error.message });
    }
    const data_to_return = {
      id: data[0].id,
      orgid: data[0].orgid,
      firstname: data[0].firstname,
      lastname: data[0].lastname,
      email: data[0].email,
      profilecolor: data[0].profilecolor,
    };
    return res.status(200).json({ message: "User updated successfully", data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { oldpassword, newpassword } = req.body;

    if (!oldpassword || !newpassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    if (!isValidPassword(newpassword)) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters long and contain at least one number and one special character",
      });
    }

    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", userId);
    if (userError) {
      return res.status(500).json({ message: "Error fetching user", error: userError.message });
    }
    if (!user.length) {
      return res.status(404).json({ message: `No user found with ID: ${userId}` });
    }

    const userData = user[0];

    const isOldPasswordValid = await bcrypt.compare(oldpassword, userData.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    const { data, error } = await supabase.from("users").update({ password: hashedPassword }).eq("id", userId);

    if (error) {
      return res.status(500).json({ message: "Error updating password", error: error.message });
    }
    const data_to_return = {
      id: userData.id,
      orgid: userData.orgid,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      profilecolor: userData.profilecolor,
    };

    return res.status(200).json({ message: "Password updated successfully", data: data_to_return });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { data, error } = await supabase.from("users").update({ is_deleted: true }).eq("id", userId);

    if (error) {
      return res.status(500).json({ message: "Error deleting user", error: error.message });
    }

    if (!data.length) {
      return res.status(404).json({ message: `No user found with ID: ${userId}` });
    }

    return res.status(200).json({ message: "User marked as deleted successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
