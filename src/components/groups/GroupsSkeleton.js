import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./groups.module.css";
function GroupsSkeleton() {
  return (
    <div>
      {[1, 2, 3, 4, 5, 6].map((el) => {
        return (
          <div key={el} className="d-flex flex-wrap m-1">
            <div>
              <Skeleton className={styles.groupCardPicture}></Skeleton>
            </div>

            <div style={{ paddingInlineStart: 20 }}>
              <Skeleton height={20} width={100}></Skeleton>
              <div style={{ height: 20 }}></div>
              <Skeleton height={10} width={100}></Skeleton>
              <Skeleton height={10} width={100}></Skeleton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GroupsSkeleton;
