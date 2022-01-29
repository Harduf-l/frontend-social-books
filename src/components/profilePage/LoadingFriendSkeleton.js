import React from "react";
import Skeleton from "react-loading-skeleton";

function LoadingFriendSkeleton() {
  return (
    <div className="d-flex flex-wrap">
      {[1, 2, 3, 4, 5].map((el) => {
        return (
          <Skeleton
            key={el}
            height={100}
            width={80}
            style={{ marginInlineEnd: 10 }}
          />
        );
      })}
    </div>
  );
}

export default LoadingFriendSkeleton;
