import React, { useContext } from "react";
import { storeContext } from "../../context/store";
import { UserCard } from "./UserCard";

function UserPage() {
  const { store } = useContext(storeContext);
  return (
    <div className="container pt-5 mb-5">
      <div className="row">
        <div className="col-lg-3 col-12">
          <UserCard currentUserPage={store.userDetails} isItMe={true} />
        </div>
      </div>
    </div>
  );
}

export default UserPage;
