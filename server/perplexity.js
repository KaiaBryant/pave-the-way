import 'dotenv/config';
import Perplexity from '@perplexity-ai/perplexity_ai';

const client = new Perplexity({ apiKey: process.env.PERPLEXITY_API_KEY });

export default async function generateRoute(
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
          content: `Generate a hypothetical route in Charlotte, NC that provides the most optimal route, that doesn't currently exist, from ${originZipcode} to ${destinationZipcode} for a traveler using a ${transportationMethod} as their mode of transportation. Provide a route specifically catered to the specific traffic during the time range of ${time} on ${day}. Structure your response as a JSON. A property of this JSON will be "map_directions," which will house the route as your generated JSON that is insertable into a Map API, such as Google Maps API. Another property is "text_direction," which will house the route as text`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          schema: {
            type: 'object',
            properties: {
              map_direction: { type: 'object' },
              text_direction: { type: 'string' },
            },
            required: ['text_direction', 'map_direction'],
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
