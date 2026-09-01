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

        const functionUrl =
          process.env.NEXT_PUBLIC_GET_ITINERARY_FUNCTION_URL;

        if (!functionUrl) {
          throw new Error(
            'NEXT_PUBLIC_GET_ITINERARY_FUNCTION_URL is not configured',
          );
        }

        const response = await fetch(
          `${functionUrl}?itineraryId=${encodeURIComponent(itineraryId)}`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch itinerary: ${response.status}`,
          );
        }

        const data = await response.json();

        setDestinations(data.itinerary);
      } catch (error) {
        console.error('Failed to load itinerary', error);
        setDestinations(null);
      }
    };

    fetchDestinations();
  }, []);

  return { destinations };
}
