const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID)
  .setKey(process.env.REACT_APP_APPWRITE_PROJECT_API_KEY);

const users = new sdk.Users(client);
const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID;
const bucketId = process.env.REACT_APP_APPWRITE_BUCKET_ID;

module.exports = async function ({ req, res, log }) {
  log("Function is running");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.send("", 204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    });
  }

  try {
    const body = JSON.parse(req.bodyRaw || "{}");
    const { work, userId } = body;

    if (!work || !userId) {
      return res.json(
        {
          success: false,
          message: "Invalid execution",
        },
        400,
        { "Access-Control-Allow-Origin": "*" }
      );
    }

    switch (work) {
      case "deleteAccount":
        // Delete documents with userId
        await databases.deleteDocuments(databaseId, collectionId, [
          sdk.Query.equal("userId", userId),
        ]);

        // Delete files in storage for this user
        const files = await storage.listFiles(bucketId, [
          sdk.Query.equal("userId", userId),
        ]);

        for (const file of files.files) {
          await storage.deleteFile(bucketId, file.$id);
        }

        // Delete the user account
        await users.delete(userId);

        return res.json(
          {
            success: true,
            message: "Your Account and data have been deleted.",
          },
          200,
          { "Access-Control-Allow-Origin": "*" }
        );

      case "getData":
        const userDocs = await databases.listDocuments(databaseId, collectionId, [
          sdk.Query.equal("userId", userId),
        ]);

        return res.json(
          {
            success: true,
            data: userDocs.documents,
          },
          200,
          { "Access-Control-Allow-Origin": "*" }
        );

      default:
        return res.json(
          {
            success: false,
            message: `Unknown work: ${work}`,
          },
          400,
          { "Access-Control-Allow-Origin": "*" }
        );
    }
  } catch (err) {
    log("Error: " + err.message);
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500,
      { "Access-Control-Allow-Origin": "*" }
    );
  }
};
