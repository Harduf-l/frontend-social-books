import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Groups() {
  const [groupsList, setGroupsList] = useState([]);

  useEffect(() => {
    fetchGroups();

    async function fetchGroups() {
      try {
        const groupList = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}groups/get-groups-list`
        );

        const sortedData = [...groupList.data];
        sortedData.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        setGroupsList(sortedData);
      } catch (err) {
        console.log(err.response);
      }
    }
  }, []);

  return (
    <div style={{ height: "87vh", paddingTop: 20 }}>
      {groupsList.length > 0 &&
        groupsList.map((el) => {
          return (
            <Link
              style={{ display: "block", paddingInlineStart: 30 }}
              key={el.name}
              to={`/groups/${el._id}`}
            >
              <span>{el.name}</span>
            </Link>
          );
        })}
    </div>
  );
}

export default Groups;
