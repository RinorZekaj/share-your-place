const { default: Axios } = require("axios");
const HttpError = require("../models/http-error");

const MAP_API_KEY = process.env.MAPBOX_API_KEY;

const getCoordsForAddress = async (address) => {
  const response = await Axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAP_API_KEY}`
  );

  const data = response.data;

  if(!data) {
    const error = new HttpError("Could not find location for the specified address", 422)
    throw error;
  }

  const coorditanes = data.features[0].geometry.coordinates;

  return coorditanes
};

module.exports = getCoordsForAddress;
