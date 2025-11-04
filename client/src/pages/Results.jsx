import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import polyline from '@mapbox/polyline';
import '../styles/Results.css';
import { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import pic from '../assets/ptw.png';

export default function Results() {
  const surveyLocation = useLocation();
  const survey = surveyLocation.state;

  const [comparedMetrics, setComparedMetrics] = useState(null);
  const handleComparedMetrics = (data) => {
    setComparedMetrics(data);
    console.log('Compared metrics sent from Mapbox to parent page:', data);
  };

  useEffect(() => {
    async function saveSurvey() {
      if (!comparedMetrics || !survey?.generatedRes) return;

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.email) {
        console.warn('User not logged in — skipping survey save');
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/survey/results`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              email: user.email,
              hypothetical: comparedMetrics.hypothetical,
              existing: comparedMetrics.existing,
              improvements: comparedMetrics.improvements,
              additional_info: survey.generatedRes.text_direction || '',
            }),
          }
        );

        const result = await res.json();
        console.log('Survey saved:', result);
      } catch (err) {
        console.error('Error saving survey', err);
      }
    }

    saveSurvey();
  }, [comparedMetrics]);

  if (!survey || !survey.generatedRes) {
    return <p>No survey data found — please submit again.</p>;
  }

  return (
    <main>
      {survey ? (
        <Mapbox survey={survey || {}} sendMetrics={handleComparedMetrics} />
      ) : (
        <p>No survey data available.</p>
      )}
      <p className="fs-5 mb-8 directions">
        <strong>Directions for the proposed route:</strong>{' '}
        {survey.generatedRes.text_direction}
      </p>
      {/* <p>Compared Metrics: {JSON.stringify(comparedMetrics)}</p> */}

      {/* Below is a bootstrap carousel component */}
      {comparedMetrics ? (
        <div className="impact-container">
          <div className="metrics-description">
            <h1>What does this mean?</h1>
            <p>
              Refer to the "Impact Metrics" section to see the effects of the
              implementation of your generated route. There, you see the numbers
              that <strong>matter.</strong> The distance you would have to
              travel, the time you would spend on each route, the compared
              carbon emissions, and how many people in surrounding communities
              would be served. We also understand that time
              <strong> is money.</strong> The time saved is factored into the
              annual return on investment (ROI), valuing an hour of time at an
              estimate of 25 dollars. The Accessibility Score is a number
              (0-100) indicating accessibility improvement to underserved areas.
              With this analysis, you can see how your hypothetical route would
              drive positive change, serve communities, and most importantly,
              serve <strong>you.</strong>
            </p>
          </div>
          <div className="metrics-container">
            <h1>Impact Metrics</h1>
            <Carousel
              className="carousel"
              prevIcon={
                <span aria-hidden="true" className="custom-prev">
                  ‹
                </span>
              }
              nextIcon={
                <span aria-hidden="true" className="custom-next">
                  ›
                </span>
              }
            >
              <Carousel.Item className="carousel-content item1">
                <h3>Existing Route</h3>
                <ul>
                  <li>
                    <strong>Distance:</strong>{' '}
                    {(comparedMetrics.existing.distance_km / 1.609344).toFixed(
                      2
                    )}{' '}
                    mi
                  </li>
                  <li>
                    <strong>Duration:</strong>{' '}
                    {comparedMetrics.existing.duration_min} min
                  </li>
                  <li>
                    <strong>Estimated Carbon Emissions:</strong>{' '}
                    {comparedMetrics.existing.carbon_emissions} kg 𝐶𝑂2
                  </li>
                </ul>
              </Carousel.Item>
              <Carousel.Item className="carousel-content item2">
                <h3>Hypothetical Route</h3>
                <ul>
                  <li>
                    <strong>Distance:</strong>{' '}
                    {(
                      comparedMetrics.hypothetical.distance_km / 1.609344
                    ).toFixed(2)}{' '}
                    mi
                  </li>
                  <li>
                    <strong>Duration:</strong>{' '}
                    {comparedMetrics.hypothetical.duration_min} min
                  </li>
                  <li>
                    <strong>Estimated Carbon Saved:</strong>{' '}
                    {comparedMetrics.hypothetical.carbon_saved} kg 𝐶𝑂2
                  </li>
                </ul>
              </Carousel.Item>
              <Carousel.Item className="carousel-content">
                <h3>Improvements</h3>
                <ul>
                  <li>
                    <strong>Estimated Population Served:</strong>{' '}
                    {comparedMetrics.hypothetical.population_served}
                  </li>
                  <li>
                    <strong>Estimated annual ROI:</strong> $
                    {
                      comparedMetrics.improvements.roi_estimate
                        .annual_benefit_usd
                    }
                  </li>
                  <li>
                    <strong>Accessibility Score:</strong>{' '}
                    {comparedMetrics.hypothetical.accessibility}
                  </li>
                  {comparedMetrics.improvements.distance_saved_percent > 0 && (
                    <li>
                      <strong>Reduced Distance:</strong>{' '}
                      {comparedMetrics.improvements.distance_saved_percent}%
                    </li>
                  )}
                </ul>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      ) : (
        <p>Loading metrics...</p>
      )}
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
    <>
      <h1 className="results">Survey Results</h1>
      <div className="map-container">
        <div className="map1">
          <h1>Existing Route</h1>
          <div
            style={{ width: '100%', height: '100%' }}
            ref={currMapContainerRef}
            className="currentRoute-container"
          />
        </div>
        <div className="map2">
          <h1>Hypothetical Route</h1>
          <div
            style={{ width: '100%', height: '100%' }}
            ref={genMapContainerRef}
            className="generatedRoute-container"
          />
        </div>
      </div>
    </>
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
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
        location
      )}&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`
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
      `https://api.mapbox.com/directions/v5/${encodeURIComponent(
        profile
      )}/${encodeURIComponent(coordinates)}.json?access_token=${
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
