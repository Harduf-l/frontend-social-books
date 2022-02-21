import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import bookDefaultPic from "../../images/book-default.jpg";

import styles from "./groups.module.css";
import { useNavigate } from "react-router-dom";
import GroupsSkeleton from "./GroupsSkeleton";

function Groups() {
  const [loading, setLoading] = useState(true);
  const [groupsList, setGroupsList] = useState([]);
  const [originialGroupList, setOriginialGroupList] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        setOriginialGroupList(sortedData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err.response);
      }
    }
  }, []);

  useEffect(() => {
    console.log("here");
    if (!searchWord) {
      setGroupsList(originialGroupList);
      return;
    }
    let newFilteredArray = originialGroupList.filter((el) =>
      el.name.toLowerCase().startsWith(searchWord.toLowerCase())
    );
    console.log(newFilteredArray);
    setGroupsList(newFilteredArray);
  }, [searchWord, originialGroupList]);

  return (
    <div className="container pt-4 pb-3" style={{ minHeight: "86vh" }}>
      <div className="row">
        {loading && <GroupsSkeleton />}
        {!loading && (
          <div className="d-flex align-items-center p-3 pt-0">
            <input
              onChange={(e) => setSearchWord(e.target.value)}
              type="text"
              id="startConv"
            />
            <i
              style={{ fontSize: 23, paddingInlineStart: 15 }}
              className="far fa-search"
            ></i>
          </div>
        )}
        {groupsList.length > 0 &&
          !loading &&
          groupsList.map((el) => {
            return (
              <div key={el._id} className="d-flex flex-wrap m-1">
                <div>
                  <img
                    onClick={() => navigate(`/groups/${el._id}`)}
                    role={"button"}
                    className={styles.groupCardPicture}
                    src={el.picture}
                    alt=""
                  />
                </div>
                <div style={{ paddingInlineStart: 20 }}>
                  <div className={`pb-2 ${styles.cardGroupName}`}>
                    {el.name}
                  </div>

                  <div className={styles.miniCardText}>
                    <span style={{ marginInlineEnd: 3 }}>
                      {el.members.length}
                    </span>
                    {t("groups.members in this group")}
                  </div>
                  <div className={styles.miniCardText}>
                    <span style={{ marginInlineEnd: 3 }}>
                      {el.posts.length}{" "}
                    </span>
                    {t("groups.posts in this group")}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Groups;
