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

import { genkit } from 'genkit';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';
import { vertexAI } from '@genkit-ai/vertexai';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC38dynEZixecYeabGonZG6o7StLcNa9NY",
  authDomain: "genkit-codelab-fe964.firebaseapp.com",
  projectId: "genkit-codelab-fe964",
  storageBucket: "genkit-codelab-fe964.firebasestorage.app",
  messagingSenderId: "141817368829",
  appId: "1:141817368829:web:cf2e4e04c9172a222fee94",
  measurementId: "G-6B83LP4WK8"
};

export const getProjectId = () => firebaseConfig.projectId;

enableFirebaseTelemetry({ projectId: getProjectId() });

export const ai = genkit({
  plugins: [
    vertexAI({
      projectId: getProjectId(),
      location: 'us-central1',
    }),
  ],
});
