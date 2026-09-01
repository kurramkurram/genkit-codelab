/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import {onRequest, onCall} from "firebase-functions/v2/https";
import {getStorage} from "firebase-admin/storage";
import {initializeApp} from "firebase-admin/app";

initializeApp();

export const saveHello = onRequest(async (req, res) => {
  console.log("saveHello called");

  try {
    const bucket = getStorage().bucket();

    const file = bucket.file("test/hello.txt");

    await file.save("Hello from Cloud Functions!", {
      contentType: "text/plain",
    });

    console.log("hello.txt saved");

    res.status(200).send("Saved successfully.");
  } catch (error) {
    console.error("Failed to save hello.txt", error);
    res.status(500).send("Failed to save.");
  }
});

export const saveItinerary = onRequest(async (req, res) => {
  console.log("saveItinerary called");

  try {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const {itineraryId, itinerary} = req.body;

    if (!itineraryId) {
      res.status(400).send("itineraryId is required");
      return;
    }

    if (!itinerary) {
      res.status(400).send("itinerary is required");
      return;
    }

    const bucket = getStorage().bucket();

    const file = bucket.file(
      `itineraries/${itineraryId}.json`,
    );

    await file.save(JSON.stringify(itinerary, null, 2), {
      contentType: "application/json",
    });

    console.log(`itinerary saved: ${itineraryId}`);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to save itinerary", error);

    res.status(500).json({
      success: false,
      error: "Failed to save itinerary",
    });
  }
});

export const getItinerary = onCall(
  {
    enforceAppCheck: true,
  },
  async (request) => {
    console.log("App Check:", request.app);
    try {
      const itineraryId = request.data?.itineraryId;

      if (
        typeof itineraryId !== "string" ||
        !itineraryId
      ) {
        throw new Error("itineraryId is required");
      }

      const bucket = getStorage().bucket();

      const file = bucket.file(
        `itineraries/${itineraryId}.json`,
      );

      const [exists] = await file.exists();

      if (!exists) {
        throw new Error("Itinerary not found");
      }

      const [contents] = await file.download();

      const itinerary = JSON.parse(
        contents.toString("utf-8"),
      );

      return {
        itineraryId,
        itinerary,
      };
    } catch (error) {
      console.error("Failed to get itinerary", error);

      throw new Error("Failed to get itinerary");
    }
  },
);

// export const getItinerary = onCall(
//   {
//     cors: [
//       "http://localhost:3000",
//       "https://genkit-codelab--genkit-codelab-fe964.asia-east1.hosted.app",
//     ],
//     enforceAppCheck: true,
//   },
//   async (req, res) => {
//     try {
//       if (req.method !== "GET") {
//         res.status(405).send("Method Not Allowed");
//         return;
//       }

//       const itineraryId = req.query.itineraryId;

//       if (
//         typeof itineraryId !== "string" ||
//         !itineraryId
//       ) {
//         res.status(400).send("itineraryId is required");
//         return;
//       }

//       const bucket = getStorage().bucket();

//       const file = bucket.file(
//         `itineraries/${itineraryId}.json`,
//       );

//       const [exists] = await file.exists();

//       if (!exists) {
//         res.status(404).send("Itinerary not found");
//         return;
//       }

//       const [contents] = await file.download();

//       const itinerary = JSON.parse(
//         contents.toString("utf-8"),
//       );

//       res.status(200).json({
//         itineraryId,
//         itinerary,
//       });
//     } catch (error) {
//       console.error("Failed to get itinerary", error);

//       res.status(500).json({
//         error: "Failed to get itinerary",
//       });
//     }
//   }
// );
