import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import polyline from '@mapbox/polyline';
import { useState } from 'react';

export default function Dummy() {
  const surveyLocation = useLocation();
  const survey = surveyLocation.state;

  const [comparedMetrics, setComparedMetrics] = useState(null);
  const handleComparedMetrics = (data) => {
    setComparedMetrics(data);
    console.log('Compared metrics sent from Mapbox to parent page:', data);
  };

  return (
    <main>
      {survey ? (
        <Mapbox survey={survey || {}} sendMetrics={handleComparedMetrics} />
      ) : (
        <p>No survey data available.</p>
      )}
      <p>
        HYPOTHETICAL ROUTE'S DIRECTIONS: {survey.generatedRes.text_direction}
      </p>
      <p>Compared Metrics: {JSON.stringify(comparedMetrics)}</p>
      {/* stringified the metrics so that we could see what's in the obj; pls refer to the properties when trying to display it */}
    </main>
  );
}

function Mapbox({ survey, sendMetrics }) {
  console.log(survey);
  console.log(survey.generatedRes);
  const { map_direction, text_direction, user_input } = survey.generatedRes;
  const {
    origin_address,
    destination_address,
    transportation_method,
    time,
    day,
  } = user_input;

  const hypotheticalRoute = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: map_direction.coordinates,
    },
    properties: {
      routeType: 'hypothetical',
      description: text_direction,
    },
  };

  const genMapContainerRef = useRef(null);
  const genMapRef = useRef(null);
  const currMapContainerRef = useRef(null);
  const currMapRef = useRef(null);

  const [currMetrics, setCurrMetrics] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

    // Config of generated route's map
    genMapRef.current = new mapboxgl.Map({
      container: genMapContainerRef.current,
      center: [-80.8431, 35.2272],
      zoom: 12,
    });

    genMapRef.current.on('load', async () => {
      if (genMapRef.current.getSource('hypothetical-route')) {
        genMapRef.current.removeLayer('hypothetical-route');
        genMapRef.current.removeSource('hypothetical-route');
      }

      genMapRef.current.addSource('hypothetical-route', {
        type: 'geojson',
        data: hypotheticalRoute,
      });

      genMapRef.current.addLayer({
        id: 'hypothetical-route',
        type: 'line',
        source: 'hypothetical-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FF6B6B',
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });
    });

    // Config of current optimal route's map
    currMapRef.current = new mapboxgl.Map({
      container: currMapContainerRef.current,
      center: [-80.8431, 35.2272],
      zoom: 12,
    });

    currMapRef.current.on('load', async () => {
      const originGeocode = await geocode(origin_address);
      const originCoords = originGeocode.features[0].geometry.coordinates;
      const destinationGeocode = await geocode(destination_address);
      const destinationCoords =
        destinationGeocode.features[0].geometry.coordinates;
      console.log('Origin coordinates:', originCoords);
      console.log('Destination coordinates:', destinationCoords);

      const geocodedCoords = [originCoords, destinationCoords];
      console.log('Geocoded coordinates:', geocodedCoords);
      const formattedCurrCoords = geocodedCoords
        .map((pair) => pair.join(','))
        .join(';');
      console.log(formattedCurrCoords);

      const currMetrics = await getDirectionRoute(
        map_direction.profile,
        formattedCurrCoords
      );

      async function compareRoutesWithMetrics(
        hypotheticalRoute,
        existingRoute
      ) {
        const comparison = {
          hypothetical: {
            distance_km: (
              hypotheticalRoute.metrics.distance_meters / 1000
            ).toFixed(2),
            duration_min: (
              hypotheticalRoute.metrics.duration_seconds / 60
            ).toFixed(1),
            cost_millions: (
              hypotheticalRoute.metrics.construction_cost_usd / 1000000
            ).toFixed(2),
            carbon_saved: hypotheticalRoute.metrics.carbon_saved_kg.toFixed(2),
            accessibility: hypotheticalRoute.metrics.accessibility_score,
            population_served:
              hypotheticalRoute.metrics.population_served.toLocaleString(),
          },
          existing: {
            distance_km: (existingRoute.distance / 1000).toFixed(2),
            duration_min: (existingRoute.duration / 60).toFixed(1),
            carbon_emissions: ((existingRoute.distance / 1000) * 0.171).toFixed(
              2
            ),
          },
          improvements: {
            time_saved: hypotheticalRoute.metrics.time_saved_minutes,
            distance_saved_percent: (
              ((existingRoute.distance -
                hypotheticalRoute.metrics.distance_meters) /
                existingRoute.distance) *
              100
            ).toFixed(1),
            roi_estimate: calculateROI(hypotheticalRoute.metrics),
          },
        };

        return comparison;
      }

      function calculateROI(metrics) {
        // Simple ROI: (Annual benefits / Construction cost) * 100
        const dailyUsers = metrics.population_served * 0.1; // Assume 10% daily usage
        const annualTimeSavings = dailyUsers * metrics.time_saved_minutes * 365;
        const annualBenefit = (annualTimeSavings / 60) * 25; // $25/hour value of time

        return {
          annual_benefit_usd: Math.round(annualBenefit),
          payback_years: (
            metrics.construction_cost_usd / annualBenefit
          ).toFixed(1),
        };
      }

      const comparedMetrics = await compareRoutesWithMetrics(
        survey.generatedRes,
        currMetrics
      );
      sendMetrics(comparedMetrics);
      console.log(
        'Hypothetical route vs Current route compared metrics:',
        comparedMetrics
      );

      const geojson = polyline.toGeoJSON(currMetrics.geometry);
      renderRoute(currMapRef.current, geojson);
    });
  }, []);

  return (
    <div className="map-container">
      <div
        style={{ height: '75vh', width: '50vw' }}
        ref={genMapContainerRef}
        className="generatedRoute-container"
      />
      <div
        style={{ height: '75vh', width: '50vw' }}
        ref={currMapContainerRef}
        className="currentRoute-container"
      />
    </div>
  );
}

function renderRoute(map, geojson) {
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
  }

  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: geojson,
    },
  });

  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#0047AB',
      'line-width': 2,
    },
  });
}

async function geocode(location) {
  try {
    const res = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&access_token=${
        import.meta.env.VITE_MAPBOX_API_KEY
      }`
    );
    if (!res.ok)
      throw new Error('MapBox Geocode HTTP Request Error', res.status);
    const data = res.json();
    console.log('Geocoding API Response:', data);
    return data;
  } catch (err) {
    console.log('Error fetching geocode:', err);
  }
}

async function getDirectionRoute(profile, coordinates) {
  try {
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/${profile}/${coordinates}.json?access_token=${
        import.meta.env.VITE_MAPBOX_API_KEY
      }`
    );
    if (!res.ok)
      throw new Error('MapBox Direction HTTP Request Error', res.status);
    const data = await res.json();
    console.log('Direction API Response:', data);
    const currRoute = data.routes[0];

    return {
      distance: currRoute.distance,
      duration: currRoute.duration,
      geometry: currRoute.geometry,
    };
  } catch (err) {
    console.log('Error fetching directions:', err);
  }
}
