import { supabase } from "../db/supabase";
import { isValidEmail, isValidPassword } from "../utils";
const bcrypt = require("bcrypt");
const saltRounds = 5;

exports.UserSignUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password, profilecolor, orgId } = req.body;
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

    const userId = uuidv4();
    const insertData = {
      id: userId,
      orgid: orgId,
      firstname: firstname,
      lastname: lastname || "",
      email: email,
      password: hasshedPassword,
      profilecolor: profilecolor || "",
      created_at: new Date(),
    };

    const { data, error } = await supabase.from("users").insert(insertData);
    if (error) {
      return res.status(500).json({ message: "Error signing up", error: error.message });
    }
    return res.status(200).json({ message: "User signed up successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
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
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      data: user,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
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
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserByOrganizationId = async (req, res) => {
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

exports.editUser = async (req, res) => {
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

    const { data, error } = await supabase.from("users").update(req.body).eq("id", userId);
    if (error) {
      return res.status(500).json({ message: "Error updating user", error: error.message });
    }
    return res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
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
