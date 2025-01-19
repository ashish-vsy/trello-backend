import { supabase } from "../db/supabase.js";
import { isValidEmail, isValidPassword } from "../utils.js";
import bcrypt from "bcrypt";
const saltRounds = 5;

export const UserSignUp = async (req, res) => {
  try {
    const recieved_data =  req.body;
    const firstname = recieved_data.firstname;
    const lastname = recieved_data.lastname;
    const email = recieved_data.email;
    const password = recieved_data.password;
    const profilecolor = recieved_data.profilecolor;
    const orgId = recieved_data.orgid;
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: "Firstname, email, and password are required" });
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

    const hasshedPassword = await bcrypt.hash(password, saltRounds);

    const insertData = {
      orgid: orgId,
      firstname: firstname,
      lastname: lastname || "",
      email: email,
      password: hasshedPassword,
      profilecolor: profilecolor || "",
      created_at: new Date(),
    };

    const { data, error } = await supabase.from("users").insert(insertData).select();
    console.log("backend return", data, error);
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
    }
    return res.status(200).json({ message: "User signed up successfully", data: response_to_send });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const { data, error } = await supabase.from("users").select("*").eq("email", email);
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
    // const accessToken = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );
    const user_data = {
      id: user.id,
      orgid: user.orgid,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profilecolor: user.profilecolor,
    }
    return res.status(200).json({
      message: "User logged in successfully",
      data: user_data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const orgid = req.params.id;
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
    }))
    return res.status(200).json({ data: data_to_return });
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
    const data_to_return = {
      id: data[0].id,
      orgid: data[0].orgid,
      firstname: data[0].firstname,
      lastname: data[0].lastname,
      email: data[0].email,
      profilecolor: data[0].profilecolor,
    }
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
    }
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

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    if (!isValidPassword(newPassword)) {
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

    const isOldPasswordValid = await bcrypt.compare(oldPassword, userData.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

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
    }

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
