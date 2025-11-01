import 'dotenv/config';
import Perplexity from '@perplexity-ai/perplexity_ai';

const client = new Perplexity({ apiKey: process.env.PERPLEXITY_API_KEY });

export async function generateRoute(
  originZipcode,
  destinationZipcode,
  transportationMethod,
  time,
  day
) {
  try {
    const completion = await client.chat.completions.create({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: `You are a data analyst who provides the most optimal hypothetical routes to navigate  Charlotte, NC, based on provided traveler data. Your role is to determine which potential nonexistent routes would be the most optimal to build and recommend to lawmakers to establish.`,
        },
        {
          role: 'user',
          content: `Generate coordinates for a NEW, NON-EXISTENT transportation route in Charlotte, NC from ${originZipcode} to ${destinationZipcode}. This route should:
                - Connect the two points via a straight or optimized path that IGNORES existing roads
                - Consider natural obstacles (rivers, lakes, protected areas)
                - Suggest new infrastructure (bridges, tunnels, dedicated lanes) where beneficial
                - Be optimized for ${transportationMethod} during ${time} on ${day}
                - Include approximately 15 waypoint coordinates that form a logical new path
            Do NOT follow existing roads - suggest entirely new routes that would require construction.
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
        origin_zipcode: originZipcode,
        destination_zipcode: destinationZipcode,
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

export async function compareRoutes(genRoute, currRoute) {
  try {
    const completion = await client.chat.completions.create({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: `You are a data analyst who compares and contrasts the time saved, saved carbon emission, energy consumption, accessibility of routes.`,
        },
        {
          role: 'user',
          content: `Generate a JSON with a "generated_route" property that is an object with the properties: time saved, saved carbon emission, energy consumption, accessibility of the ${genRoute} route; assign to those properties your projected metrics accordingly. Do the same for the "current_route", but based on the ${currRoute} route. Additionally, that JSON will have a "compared_metrics" property with the same properties as the "generated_route" and "curent_route" properties, but with the compared metrics between ${genRoute} and ${currRoute}. In comparison, provide which one of the route is better.`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          schema: {
            type: 'object',
            properties: {
              generated_route: { type: 'object' },
              current_route: { type: 'object' },
              compared_metrics: { type: 'object' },
            },
            required: ['generated_route', 'current_route', 'compared_metrics'],
          },
        },
      },
    });

    const response = JSON.parse(completion.choices[0].message.content);
    console.log('Perplexity routes compared metrics:', response);

    return response;
  } catch (err) {
    console.log('Failed to fetch response from Perplexity:', err);
  }
}
