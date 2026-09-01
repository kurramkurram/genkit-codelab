/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use server';

import { ItineraryFlowOutput } from './genkit/types';
import { itineraryFlow } from './genkit/itineraryFlow';

type GenerateItineraryResult = {
  itineraryId: string;
  itinerary: ItineraryFlowOutput;
};

export async function generateItinerary(
  previousState: null | undefined | GenerateItineraryResult,
  formData: FormData,
): Promise<GenerateItineraryResult | undefined> {
  const request = formData.get('request');
  if (!request) {
    throw new Error('No request provided');
  }

  const images: File[] = formData.getAll('images[]') as File[]; // fix upload content-type
  const imageUrls = await Promise.all(
    images.filter((i) => i.size > 0).map(fileToDataURL),
  );

  const itinerary = await itineraryFlow({
    request: request.toString(),
    imageUrls,
  });

  const functionUrl = process.env.SAVE_ITINERARY_FUNCTION_URL;

  if (!functionUrl) {
    throw new Error(
      "SAVE_ITINERARY_FUNCTION_URL is not configured"
    );
  }

  const itineraryId = crypto.randomUUID();

  const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        itinerary,
        itineraryId,
      }),
    });

  if (!response.ok) {
    throw new Error(
      `Cloud Functions request failed: ${response.status}`
    )
  }

  return {
    itineraryId,
    itinerary,
  };
}

export async function fileToDataURL(file: File): Promise<string> {
  // 1. Get the file's content as an ArrayBuffer
  // The .arrayBuffer() method is available on the File object, even on the server.
  const arrayBuffer = await file.arrayBuffer();

  // 2. Convert the ArrayBuffer to a Node.js Buffer
  const buffer = Buffer.from(arrayBuffer);

  // 3. Convert the Buffer to a Base64-encoded string
  const base64 = buffer.toString('base64');

  // 4. Get the MIME type from the File object
  const mimeType = file.type;

  // 5. Construct the Data URL
  const dataURL = `data:${mimeType};base64,${base64}`;

  return dataURL;
}
