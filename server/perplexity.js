import 'dotenv/config';
import Perplexity from '@perplexity-ai/perplexity_ai';

const client = new Perplexity({ apiKey: process.env.PERPLEXITY_API_KEY });

async function geocodeAddress(address) {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?` +
      `proximity=-80.8431,35.2271&` +
      `bbox=-81.2,34.9,-80.5,35.5&` +
      `access_token=${process.env.MAPBOX_API_KEY}`
  );

  const data = await response.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].geometry.coordinates;
  }
  throw new Error(`Could not geocode address: ${address}`);
}

async function getExistingRoute(
  originCoords,
  destinationCoords,
  transportationMethod
) {
  const profileMap = {
    driving: 'driving',
    walking: 'walking',
    cycling: 'cycling',
    car: 'driving',
    bike: 'cycling',
  };

  const profile = profileMap[transportationMethod.toLowerCase()] || 'driving';

  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${profile}/` +
      `${originCoords[0]},${originCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?` +
      `geometries=geojson&overview=full&steps=true&access_token=${process.env.MAPBOX_API_KEY}`
  );

  const data = await response.json();
  const route = data.routes[0];

  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry,
    summary: route.legs[0]?.summary || 'existing road network',
  };
}

export default async function generateRoute(
  originAddress,
  destinationAddress,
  transportationMethod,
  time,
  day
) {
  try {
    const originCoords = await geocodeAddress(originAddress);
    const destinationCoords = await geocodeAddress(destinationAddress);

    const existingRoute = await getExistingRoute(
      originCoords,
      destinationCoords,
      transportationMethod
    );
    const existingCoords = existingRoute.geometry.coordinates;

    const completion = await client.chat.completions.create({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: `You are a data analyst who provides the most optimal hypothetical routes to navigate  Charlotte, NC, based on provided traveler data. Your role is to determine which potential nonexistent routes would be the most optimal to build and recommend to lawmakers to establish.`,
        },
        {
          role: 'user',
          content: `Generate a hypothetical transportation route in Charlotte, NC.
            CRITICAL REQUIREMENTS:
            - The route MUST start at exactly: [${originCoords[0]}, ${
            originCoords[1]
          }] (${originAddress})
            - The route MUST end at exactly: [${destinationCoords[0]}, ${
            destinationCoords[1]
          }] (${destinationAddress})
            - Generate approximately 13 intermediate waypoints between these endpoints
            - The first coordinate in your array must be [${originCoords[0]}, ${
            originCoords[1]
          }]
            - The last coordinate in your array must be [${
              destinationCoords[0]
            }, ${destinationCoords[1]}]
            - Intermediate points should form a logical new infrastructure path optimized for ${transportationMethod}
            - Consider the time period ${time} on ${day} for traffic optimization
            EXISTING ROUTE CONTEXT:
            - Current route distance: ${(existingRoute.distance / 1000).toFixed(
              2
            )} km
            - Current route duration: ${(existingRoute.duration / 60).toFixed(
              1
            )} minutes
            - Current route uses: ${
              existingRoute.summary || 'existing road network'
            }
            Create an optimal hybrid route that:
            1. LEVERAGES existing infrastructure where it makes sense (roads, bike lanes, bridges, tunnels)
            2. PROPOSES NEW infrastructure segments only where they provide significant improvement
            3. IDENTIFIES specific existing roads/routes to utilize (e.g., "use existing N Tryon St from mile 0-2.5")
            4. SPECIFIES where new construction should BEGIN and END
            5. MINIMIZES construction costs while maximizing benefits
            Additionally, estimate these metrics for your proposed route:
                - Expected travel time in optimal conditions
                - Estimated construction cost (USD)
                - Population served (number of residents within 1km of route)
                - Accessibility improvements (areas gaining better transit access)`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          schema: {
            type: 'object',
            properties: {
              map_direction: {
                type: 'object',
                properties: {
                  profile: {
                    type: 'string',
                    enum: [
                      'mapbox/driving',
                      'mapbox/walking',
                      'mapbox/cycling',
                    ],
                    description: 'Transportation mode profile',
                  },
                  coordinates: {
                    type: 'array',
                    items: {
                      type: 'array',
                      items: { type: 'number' },
                      minItems: 2,
                      maxItems: 2,
                    },
                    description:
                      'Array of [longitude, latitude] coordinate pairs for the new route',
                  },
                },
                required: ['profile', 'coordinates'],
              },
              text_direction: {
                type: 'string',
                description:
                  'Detailed description of the proposed route and its benefits',
              },
              metrics: {
                type: 'object',
                properties: {
                  distance_meters: {
                    type: 'number',
                    description: 'Total route distance in meters',
                  },
                  duration_seconds: {
                    type: 'number',
                    description: 'Expected travel time in seconds',
                  },
                  carbon_saved_kg: {
                    type: 'number',
                    description:
                      'Estimated CO2 savings in kilograms compared to existing routes',
                  },
                  energy_consumption_kwh: {
                    type: 'number',
                    description:
                      'Energy required for journey in kilowatt-hours',
                  },
                  construction_cost_usd: {
                    type: 'number',
                    description: 'Estimated construction cost in US dollars',
                  },
                  population_served: {
                    type: 'integer',
                    description:
                      'Number of residents within 1km who would benefit',
                  },
                  accessibility_score: {
                    type: 'integer',
                    minimum: 0,
                    maximum: 100,
                    description:
                      'Score (0-100) indicating accessibility improvement to underserved areas',
                  },
                  time_saved_minutes: {
                    type: 'number',
                    description:
                      'Minutes saved compared to typical existing routes',
                  },
                  infrastructure_type: {
                    type: 'string',
                    description:
                      'Description of infrastructure needed (e.g., dedicated bike lane, express road, pedestrian bridge)',
                  },
                },
                required: [
                  'distance_meters',
                  'duration_seconds',
                  'carbon_saved_kg',
                  'energy_consumption_kwh',
                  'construction_cost_usd',
                  'population_served',
                  'accessibility_score',
                  'time_saved_minutes',
                  'infrastructure_type',
                ],
              },
              analysis: {
                type: 'object',
                properties: {
                  key_benefits: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of 3-5 primary benefits of this route',
                  },
                  communities_impacted: {
                    type: 'array',
                    items: { type: 'string' },
                    description:
                      'Neighborhoods or communities that would benefit most',
                  },
                  challenges: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Potential implementation challenges',
                  },
                },
                required: [
                  'key_benefits',
                  'communities_impacted',
                  'challenges',
                ],
              },
            },
            required: [
              'text_direction',
              'map_direction',
              'metrics',
              'analysis',
            ],
          },
        },
      },
    });

    const response = JSON.parse(completion.choices[0].message.content);

    return {
      user_input: {
        origin_address: originAddress,
        destination_address: destinationAddress,
        transportation_method: transportationMethod,
        time,
        day,
      },
      ...response,
    };
  } catch (err) {
    console.log('Failed to fetch response from Perplexity:', err);
  }
}
