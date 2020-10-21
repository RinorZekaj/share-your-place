import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";

function UserPlaces() {
  const userId = useParams().userID;
  const [loadedPlaces, setLoadedPlaces] = useState();

  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`,
        "GET",
        {},
        { "Content-Type": "application/json" }
      );

      console.log(responseData);
      setLoadedPlaces(responseData.places);
    };

    fetchPlaces();
  }, [sendRequest]);

  const deletePlaceHandler = (deletedPlaceID) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceID)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={deletePlaceHandler} />
      )}
    </>
  );
}

export default UserPlaces;
