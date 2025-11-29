/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { FaHeart } from "react-icons/fa6";
import Link from "next/link";
// import { addItemToCart } from "../../features/cartSlice";
// import { addItemToWishlist, removeWishlistItem, selectWishlistItems } from "../../features/wishlistSlice";
import styles from "./CourseCard.module.scss";

// Define types for the props
interface CourseCardProps {
  // role: string;
  course: {
    _id: string;
    image: {
      url: string;
    };
    description: string;
    averageRating: number;
    price: number;
    modules: Array<any>;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ role, course }) => {
  const params = useParams();
  const userId = params.userId as string;
  const dispatch = useDispatch();
  // const wishlistItems = useSelector(selectWishlistItems);
  // const [isWishlisted, setIsWishlisted] = useState(false);

  // Update local state when wishlist items change
  // useEffect(() => {
  //   if (wishlistItems && course) {
  //     const inWishlist = wishlistItems.some((item) => item._id === course._id);
  //     setIsWishlisted(inWishlist);
  //   }
  // }, [wishlistItems, course]);

  // Handle wishlist toggle
  // const handleWishlistToggle = () => {
  //   if (!course || !userId) return;
  //   if (isWishlisted) {
  //     dispatch(removeWishlistItem({ courseId: course._id, userId }));
  //   } else {
  //     dispatch(addItemToWishlist({ ...course, userId }));
  //   }
  // };

  return (
    <article className={styles.courseCard}>
      {/* Image Container with Link */}
      <Link href={`/${role}/course/${course._id}`} className={styles.imageContainer}>
        <img
          className={styles.courseImage}
          src={course?.image?.url}
          alt={course?.description || "Course Image"}
        />
      </Link>

      {/* Wishlist Button */}
      <button
        className={styles.wishlistButton}
        // onClick={handleWishlistToggle}
        aria-label="Add to wishlist"
        // aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FaHeart
          className={styles.wishlistIcon}
          // className={`${styles.wishlistIcon} ${isWishlisted ? styles.active : ''}`}
        />
      </button>

      {/* Course Content */}
      <div className={styles.courseContent}>
        <p className={styles.courseDescription}>
          {course?.description}
        </p>

        {/* Rating and Price */}
        <div className={styles.courseMetaGrid}>
          <span className={styles.metaItem}>
            ⭐ {course?.averageRating?.toFixed(1) || "N/A"}
          </span>
          <span className={styles.metaItem}>
            ₹{course?.price?.toLocaleString()}
          </span>
        </div>

        {/* Divider */}
        <hr className={styles.customLine} />

        {/* Modules Count and Add Button */}
        <div className={styles.courseDetailsGrid}>
          <span className={styles.detailsItem}>
            {course?.modules?.length || 0} Modules
          </span>
          <button
            className={styles.addButton}
            // onClick={() => dispatch(addItemToCart({ ...course, userId }))}
            aria-label="Add to cart"
          >
            Add +
          </button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;