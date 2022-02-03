import React, { useState } from "react";
import styles from "./HomePageUser.module.css";
import { useTranslation } from "react-i18next";
import SingleComment from "./homePageUtils/SingleComment";
import SinglePost from "./homePageUtils/SinglePost";

function FeedPosts({ postsToShow, userId }) {
  return (
    <div className="mt-3">
      {postsToShow &&
        postsToShow.length > 0 &&
        postsToShow
          .slice(0)
          .reverse()
          .map((post, index) => {
            return (
              <SinglePost
                key={index}
                post={post}
                index={index}
                userId={userId}
              />
            );
          })}
    </div>
  );
}

export default FeedPosts;
