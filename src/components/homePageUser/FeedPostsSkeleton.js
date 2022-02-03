import React from "react";
import styles from "./HomePageUser.module.css";
import Skeleton from "react-loading-skeleton";

function FeedPostsSkeleton() {
  return (
    <div className="mt-3">
      {[1, 2, 3].map((el) => {
        return (
          <Skeleton
            key={el}
            className={`mt-4 p-2`}
            style={{ height: 200 }}
          ></Skeleton>
        );
      })}
    </div>
  );
}

export default FeedPostsSkeleton;
