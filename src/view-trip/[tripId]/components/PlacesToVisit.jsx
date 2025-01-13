import React from 'react';

function PlacesToVisit({ trip }) {
  const handlePlaceClick = (place) => {
    const { latitude, longitude } = place.geo_coordinates;
    if (latitude && longitude) {
      // Construct the Google Maps URL using latitude and longitude
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      // Open Google Maps in a new tab
      window.open(googleMapsUrl, '_blank');
    } else {
      console.error('No latitude or longitude available for the place.');
    }
  };

  return (
    <div>
      <h2 className="font-bold text-lg mt-5">Places To Visit</h2>

      <div>
        {trip?.tripData?.itinerary &&
          Object.entries(trip.tripData.itinerary)
            .sort(([dayA], [dayB]) => {
              const numA = parseInt(dayA.replace('day', ''), 10);
              const numB = parseInt(dayB.replace('day', ''), 10);
              return numA - numB; // Sort in ascending order
            })
            .map(([dayKey, dayData]) => (
              <div key={dayKey} className="mt-5">
                <h2 className="font-medium text-lg text-[#3FC1C9]">
                  {dayKey.toUpperCase()} - Best Time to Visit: {dayData.best_time_to_visit}
                </h2>

                {/* Grid layout for places */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
                  {dayData.places?.map((place, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => handlePlaceClick(place)} // Handle click to redirect
                    >
                      <h3 className="font-bold text-md text-[#5C5C5C]">{place.placeName}</h3>
                      <p>{place.PlaceDetails}</p>
                      <div className="mt-4">
                        {/* Highlighted field names */}
                        <p className="font-semibold text-[#FF6F61]">
                          Travel Time: <span className="font-normal text-[#333]">{place.travel_time}</span>
                        </p>
                        <p className="font-semibold text-[#FF6F61]">
                          Rating: <span className="font-normal text-[#333]">{place.rating}</span>
                        </p>
                        <p className="font-semibold text-[#FF6F61]">
                          Ticket Pricing: <span className="font-normal text-[#333]">{place.ticketPricing}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
