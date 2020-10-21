import React, { useCallback, useReducer, useContext } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";

import "./NewPlace.css";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

function NewPlace() {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('address', formState.inputs.address.value)
      formData.append('creator', auth.userID)
      formData.append('image', formState.inputs.image.value)
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places/",
        "POST",
        formData,
        { "Authorization": "Bearer " + auth.token } 
      );
      history.push("/");
    } catch (err) {}
    history.push("/");

  };

  return (
    <>
      <ErrorModal error={error} clearError={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          errorText="Please enter a valid title."
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          label="Description"
          element="textarea"
          errorText="Please enter a valid description (at least 5 characters)."
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        <Input
          id="address"
          label="Address"
          element="input"
          errorText="Please enter a valid address."
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <ImageUpload id="image" errorText="Please provide an image" onInput={inputHandler} />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
}

export default NewPlace;
