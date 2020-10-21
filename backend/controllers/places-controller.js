const uuid = require("uuid").v4;
const fs = require("fs")
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");

const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Buildinig",
    description: "One of the most famous building in the world",
    location: [49.02123, -32.21312],
    address: "20 W Street, new york",
    creator: "u1",
  },
];

exports.getPlaceById = async (req, res, next) => {
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID);
    console.log(place);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    console.log(err);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userID = req.params.uid;

  let places;

  try {
    places = await Place.find({ creator: userID });
  } catch (err) {
    const error = new HttpError(
      "Finding places for the user id failed, please try again",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invali inputs passed", 422));
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: { lng: coordinates[0], lat: coordinates[1] },
    creator: req.userData.userId,
    image: req.file.path,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating a place failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for the provided id", 400);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ places: createdPlace.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Could not delete place, please try again",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  if(place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "Your are not allowed to delete this place",
      403
    );
    return next(error);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Could not delete place, please try again",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  })

  res.status(200).json({ message: "Deleted the place" });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs", 422);
  }

  const { title, description } = req.body;
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong could not update place",
      500
    );
    return next(error);
  }

  if(place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "Your are not allowed to edit this place",
      401
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: place.toObject({ getters: true }) });
};
