import { Client,Account, Storage, ID, Databases, Query } from "appwrite";
import bcrypt from 'bcryptjs';
import { client } from "../Auth/appwriteauth";
import { formatDate } from "../components/Documents";

export const account = new Account(client);
export { ID } from 'appwrite';

const storage = new Storage(client);
const databases = new Databases(client);
const bucketId = process.env.REACT_APP_APPWRITE_BUCKET_ID;
const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID;
const userId = "jbbfsgfbhb"

// Password hashing utilities
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const initStorageSystem = async () => {
  try {
    await storage.getBucket(bucketId);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: "Failed to initialize storage system" 
    };
  }
};

export const uploadFileForUser = async (file, permissionSettings = {}) => {
  try {
    if (!userId) throw new Error("User not authenticated");
    console.log("permissionsetting",permissionSettings);
    const permissions = [
      `read("user:${userId}")`,
      `write("user:${userId}")`,
      `delete("user:${userId}")`,
      ...(permissionSettings.isPublic ? ['read("any")'] : []),
      ...(permissionSettings.allowedUsers?.map(u => `read("user:${u}")`) || [])
    ];

    const fileResponse = await storage.createFile(
      bucketId,
      ID.unique(),
      file,
    );

    const passwordHash = permissionSettings.password 
      ? await hashPassword(permissionSettings.password) 
      : null;
   const newfile =  await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        userId,
        fileId: fileResponse.$id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        isPublic: permissionSettings.isPublic || false,
        allowedUsers: permissionSettings.allowedUsers || [],
        passwordHash,
        shareableLink: `${window.location.origin}/share/${fileResponse.$id}`,
        uploadedAt: new Date(Date.now()),
      }
    );

    return { 
      success: true, 
      newfile:{...newfile,name:newfile.fileName,id:fileResponse.$id},
      fileId: fileResponse.$id,
      shareableLink: `${window.location.origin}/share/${fileResponse.$id}`
    };
  } catch (error) {
    console.log("error ",error.message)
    if (error.fileId) {
      try {
        await storage.deleteFile(bucketId, error.fileId);
      } catch (cleanupError) {}
    }
    return { success: false, error: error.message };
  }
};

export const verifyDocumentAccess = async (fileId, password = null) => {
  try {
    const doc = await databases.getDocument(databaseId, collectionId, fileId);
    
    // Owner always has access
    if (userId && doc?.userId === userId) return { hasAccess: true, doc };
    
    // Public documents
    if (doc.isPublic) return { hasAccess: true, doc };
    
    // Allowed users
    if (userId && doc.allowedUsers?.includes(userId)) return { hasAccess: true, doc };
    
    // Password protected
    if (doc.passwordHash) {
      if (!password) return { hasAccess: false, doc, reason: 'needsPassword' };
      const isValid = await verifyPassword(password, doc.passwordHash);
      return isValid 
        ? { hasAccess: true, doc } 
        : { hasAccess: false, doc, reason: 'invalidPassword' };
    }
    
    return { hasAccess: false, doc, reason: 'unauthorized' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateDocumentPermissions = async (fileId, updates) => {
  try {
    if (!userId) throw new Error("User not authenticated");

    // Verify user owns the document
    const { hasAccess, doc } = await verifyDocumentAccess(fileId);
    if (!hasAccess || doc.userId !== userId) {
      throw new Error("You don't have permission to modify this document");
    }

    const newPermissions = {
      isPublic: updates.isPublic !== undefined ? updates.isPublic : doc.isPublic,
      allowedUsers: updates.allowedUsers || doc.allowedUsers,
      passwordHash: updates.password 
        ? await hashPassword(updates.password) 
        : doc.passwordHash
    };

    // Update storage permissions
    const permissions = [
      `read("user:${userId}")`,
      `write("user:${userId}")`,
      `delete("user:${userId}")`,
      ...(newPermissions.isPublic ? ['read("any")'] : []),
      ...(newPermissions.allowedUsers?.map(u => `read("user:${u}")`) || [])
    ];

    // await storage.updateFile(bucketId, fileId, permissions);

    // Update database record
    const updatedDoc = await databases.updateDocument(
      databaseId,
      collectionId,
      fileId,
      newPermissions
    );

    return { success: true, document: updatedDoc };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const listFilesForUser = async () => {
  try {
    if (!userId) throw new Error("User not authenticated");

    const metadataResponse = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("userId", userId)]
    );

    const files = await Promise.all(
      metadataResponse.documents.map(async (doc) => {
        const file = await storage.getFile(bucketId, doc.fileId);
        return {
          file,
          id: file.$id,
          name: doc.fileName,
          fileType: doc.fileType,
          fileSize: doc.fileSize,
          isPublic: doc.isPublic,
          shareableLink: doc.shareableLink,
          uploadedAt: doc.uploadedAt,
          previewUrl: storage.getFilePreview(bucketId, file.$id).href,
          downloadUrl: storage.getFileDownload(bucketId, file.$id).href
        };
      })
    );

    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFileDownload = async (fileId, password = null) => {
  try {
    const { hasAccess, doc } = await verifyDocumentAccess(fileId, password);
    if (!hasAccess) throw new Error("Access denied");

    const url = storage.getFileDownload(bucketId, fileId).href;
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFilePreview = async (fileId, password = null) => {
  try {
    const { hasAccess, doc } = await verifyDocumentAccess(fileId, password);
    if (!hasAccess) throw new Error("Access denied");

    const url = storage.getFilePreview(bucketId, fileId);
    window.open(url, "_blank");    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteFileForUser = async (fileId) => {
  try {
    if (!userId) throw new Error("User not authenticated");

    const metadata = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("userId", userId), Query.equal("fileId", fileId)]
    );

    if (metadata.documents.length === 0) {
      throw new Error("File not found or access denied");
    }

    await storage.deleteFile(bucketId, fileId);
    await databases.deleteDocument(
      databaseId,
      collectionId,
      metadata.documents[0].$id
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getDocumentDetails = async (fileId) => {
  try {
    const doc = await databases.getDocument(databaseId, collectionId, fileId);
    return { success: true, document: doc };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

