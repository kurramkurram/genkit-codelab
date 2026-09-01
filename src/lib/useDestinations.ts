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

'use client';

import { useEffect, useState } from 'react';

import { Destination } from './gemini/types';
import { getFunctions, httpsCallable } from 'firebase/functions';

import { app } from './firebase';

export default function useDestinations() {
  const [destinations, setDestinations] = useState<
    Destination[] | undefined | null
  >();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const itineraryId = params.get('itineraryId');

        if (!itineraryId) {
          setDestinations(null);
          return;
        }

        const functions = getFunctions(app, 'us-central1');

        const getItinerary = httpsCallable<
          { itineraryId: string },
          {
            itineraryId: string;
            itinerary: Destination[];
          }
        >(functions, 'getItinerary');

        const result = await getItinerary({
          itineraryId,
        });

        setDestinations(result.data.itinerary);
      } catch (error) {
        console.error('Failed to load itinerary', error);
        setDestinations(null);
      }
    };

    fetchDestinations();
  }, []);

  return { destinations };
}
