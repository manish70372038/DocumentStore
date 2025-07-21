// appwriteAuth.js
import { Client, Account, ID } from "appwrite";

// ✅ Configure the Appwrite Client
export const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

const account = new Account(client);
const BASE_URL = process.env.BASE_URL;
console.log("this is base url",BASE_URL);

export const appwriteAuth = {
  // ✅ Sign Up and Force Verification
  async signUp(email, password) {
    try {
      const user = await account.create(ID.unique(), email, password);
      console.log("User created:", user);

      // 🔐 Login to create session temporarily
      await account.createEmailPasswordSession(email, password);

      // ✉️ Send verification email
      await account.createVerification(`${BASE_URL}/verify`);

      // 🔐 Logout immediately after sending verification
        await account.deleteSession("current");


      return {
        success: true,
        message: "Verification email sent. Please check your inbox.",
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: error.message };
    }
  },

  // ✅ Login only after verified
  async login(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log("this is sesssion ",session);
      const user = await account.get();

      if (!user.emailVerification) {
        // 🔐 Force logout if not verified
        await account.deleteSession("current");
        return {
          success: false,
          message: "Email not verified. Please verify your email first.",
        };
      }

      return { success: true, message: "Login successful", user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    }
  },

  // ✅ Resend Email Verification
  async resendVerification() {
    try {
      await account.createVerification(`${BASE_URL}/verify`);
      return { success: true, message: "Verification email resent." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ✅ Confirm Verification (to call from /verify page)
  async confirmVerification(userId, secret) {
    try {
      await account.updateVerification(userId, secret);
      return { success: true, message: "Email verified successfully!" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ✅ Request Password Reset
  async requestPasswordReset(email) {
    try {
      await account.createRecovery(email, `${BASE_URL}/reset-password`);
      return { success: true, message: "If the email exists, a recovery link was sent." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ✅ Complete Password Reset
  async resetPassword(userId, secret, newPassword) {
    try {
      await account.updateRecovery(userId, secret, newPassword);
      return { success: true, message: "Password has been reset." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ✅ Logout
  async logout() {
    try {
      await account.deleteSession("current");
      return { success: true, message: "Logged out successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // ✅ Get Current User
  async getUser() {
    try {
      const user = await account.get();
      return { success: true, user,message:"Welcome back !" };
    } catch (error) {
      return { success: false, user: null , message:error.message };
    }
  },
  

  
};
