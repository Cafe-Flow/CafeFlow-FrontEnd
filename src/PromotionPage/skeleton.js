import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CustomSkeleton = () => {
  return (
    <div className="skeleton">
      <Skeleton height={260} width={300} />
      <Skeleton
        height={20}
        width={250}
        count={3}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default CustomSkeleton;
