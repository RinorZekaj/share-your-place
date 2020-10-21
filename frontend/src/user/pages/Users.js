import Axios from "axios";
import React, { useState, useEffect } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UserList from "../components/UserList";

function Users() {
  const [loadedUsers, setLoadedUsers] = useState();

  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };

    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className="center"><LoadingSpinner /></div>}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </>
  );
}

export default Users;
