import React, { useContext, useEffect, useState } from "react";
import { storeContext } from "../../context/store";
import { UserCard } from "./UserCard";
import axios from "axios";
import ContentProfilePage from "./ContentProfilePage";

function UserPage() {
  const { store } = useContext(storeContext);
  const [approvedFriends, setApprovedFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}connections/all-approved-connections/${store.userDetails._id}`
      )
      .then((res) => {
        setApprovedFriends(res.data.approvedConnections);
        setLoadingFriends(false);
      })
      .catch((err) => {
        console.log(err.response);
        setLoadingFriends(false);
      });
  }, [store.userDetails._id]);

  return (
    <div className="container pt-5 mb-5">
      <div className="row">
        <div className="col-lg-3 col-12">
          <UserCard currentUserPage={store.userDetails} isItMe={true} />
        </div>

        <div className="col-lg-9 col-md-6 col-12 pt-4 pt-md-0">
          <ContentProfilePage
            currentUserPage={store.userDetails}
            approvedFriends={approvedFriends}
            userId={store.userDetails._id}
            loadingFriends={loadingFriends}
          />
        </div>
      </div>
    </div>
  );
}

export default UserPage;
