import { Client, Account, ID } from "appwrite";

export const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

const account = new Account(client);
const domain = process.env.REACT_APP_VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000"
const BASE_URL = `https://${domain}`;
console.log("this is base url",BASE_URL);

export const appwriteAuth = {
  async signUp(email, password) {
    try {
      const user = await account.create(ID.unique(), email, password);
      console.log("User created:", user);

      await account.createEmailPasswordSession(email, password);

      await account.createVerification(`${BASE_URL}/verify`);

        await account.deleteSession("current");


      return {
        success: true,
        message: "Verification email sent. Please check your inbox.",
      };
    } catch (error) {
      await account.deleteSession("current");
      console.error("Signup error:", error);
      return { success: false, message: error.message };
    }
  },

  async login(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log("this is sesssion ",session);
      const user = await account.get();

      if (!user.emailVerification) {
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

  async confirmVerification(userId, secret) {
    try {
      await account.updateVerification(userId, secret);
      return { success: true, message: "Email verified successfully!" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async requestPasswordReset(email) {
    try {
      await account.createRecovery(email, `${BASE_URL}/reset-password`);
      return { success: true, message: "If the email exists, a recovery link was sent." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async resetPassword(userId, secret, newPassword) {
    try {
      await account.updateRecovery(userId, secret, newPassword);
      return { success: true, message: "Password has been reset." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
      return { success: true, message: "Logged out successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  async getUser() {
    try {
      const user = await account.get();
      return { success: true, user,message:"Welcome back !" };
    } catch (error) {
      return { success: false, user: null , message:error.message };
    }
  },
  

  
};

