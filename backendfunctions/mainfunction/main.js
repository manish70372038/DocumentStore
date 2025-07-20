const sdk = require("node-appwrite");
 const client = new sdk.Client()
      .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
      .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID)
      .setKey(process.env.REACT_APP_APPWRITE_PROJECT_API_KEY); 

    const users = new sdk.Users(client);
    const databases = new sdk.Databases(client);
    const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID; 
    const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID; 

module.exports = async function ({ req, res, log }) {
  log("Function is running");

  try {
    const body = JSON.parse(req.bodyRaw || '{}');
    const work = body.work;
    log(work);
    const userId = body.userId || null;

    if (!work || !userId) {
      return res.json({
        success: false,
        message: "Invalid execution",
      }, 400);
    }

    // Initialize Appwrite SDK
   
    switch (work) {
      case "deleteAccount":
        // Step 1: Delete all user-related documents
        // const allDocs = await databases.listDocuments(databaseId, collectionId, [
        //   sdk.Query.equal("userId", userId)
        // ]);

        // for (const doc of allDocs.documents) {
        //   await databases.deleteDocument(databaseId, collectionId, doc.$id);
        // }

        // Step 2: Delete user account
        await users.delete(userId);

        return res.json({
          success: true,
          message: `Your Account and your data have been deleted.`,
        });
      break;

      case "getData":
        const userDocs = await databases.listDocuments(databaseId, collectionId, [
          sdk.Query.equal("userId", userId)
        ]);

        return res.json({
          success: true,
          data: userDocs.documents
        });

      default:
        return res.json({
          success: false,
          message: `Unknown work: ${work}`,
        }, 400);
    }
  } catch (err) {
    log("Error: " + err.message);
    return res.json({
      success: false,
      error: err.message,
    }, 500);
  }
};

