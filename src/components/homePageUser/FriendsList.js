import React from "react";
import defaultPicture from "../../images/plain.jpg";
import { useNavigate } from "react-router-dom";

function FriendsList({ userFriends, userId }) {
  let navigate = useNavigate();

  return (
    <div className="d-flex flex-wrap">
      {userFriends &&
        userFriends.map((el, index) => {
          return (
            <div key={index}>
              <div
                style={{
                  textAlign: "center",
                  color: "#251703",
                  backgroundColor: "#f3f3f3",
                  margin: 5,
                  borderRadius: 10,
                  border: "1px dotted #d3c6b4",
                }}
              >
                <img
                  onClick={() =>
                    navigate(el._id === userId ? "/profile" : `/user/${el._id}`)
                  }
                  role={"button"}
                  style={{
                    borderRadius: "20px",
                    height: "80px",
                    width: "80px",
                    objectFit: "cover",
                    padding: 5,
                  }}
                  src={el.picture ? el.picture : defaultPicture}
                  alt=""
                />

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    marginTop: "6px",
                  }}
                >
                  {el.username}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default FriendsList;
