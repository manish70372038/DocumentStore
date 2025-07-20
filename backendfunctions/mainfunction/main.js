const sdk = require("node-appwrite");

module.exports = async function ({ req, res, log }) {
  log("Function is running");

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return res.send("", 204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    });
  }

  // Setup Appwrite Client
  const client = new sdk.Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID)
    .setKey(process.env.REACT_APP_APPWRITE_PROJECT_API_KEY);

  const users = new sdk.Users(client);
  const databases = new sdk.Databases(client);
  const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
  const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID;

  try {
    const body = JSON.parse(req.bodyRaw || '{}');
    const work = body.work;
    const userId = body.userId || null;

    if (!work || !userId) {
      return res.json({
        success: false,
        message: "Invalid execution",
      }, 400, {
        "Access-Control-Allow-Origin": "*",
      });
    }

    switch (work) {
      case "deleteAccount":
        await users.delete(userId);
        return res.json({
          success: true,
          message: "Your Account and your data have been deleted.",
        }, 200, {
          "Access-Control-Allow-Origin": "*",
        });

      case "getData":
        const userDocs = await databases.listDocuments(databaseId, collectionId, [
          sdk.Query.equal("userId", userId),
        ]);
        return res.json({
          success: true,
          data: userDocs.documents,
        }, 200, {
          "Access-Control-Allow-Origin": "*",
        });

      default:
        return res.json({
          success: false,
          message: `Unknown work: ${work}`,
        }, 400, {
          "Access-Control-Allow-Origin": "*",
        });
    }
  } catch (err) {
    log("Error: " + err.message);
    return res.json({
      success: false,
      error: err.message,
    }, 500, {
      "Access-Control-Allow-Origin": "*",
    });
  }
};
