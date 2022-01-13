import { store } from "emoji-mart";
import React, { useContext } from "react";
import { storeContext } from "../../context/store";
import { UserCard } from "./helperComponents";

function UserPage() {
  const { store } = useContext(storeContext);
  return (
    <div className="container pt-5">
      <div className="row">
        <UserCard currentUserPage={store.userDetails} editOption={true} />
      </div>
    </div>
  );
}

export default UserPage;
