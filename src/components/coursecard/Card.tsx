/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";



import styles from "./course-card.module.scss";
import { addToCartAPI } from "@/services/cartService";
import { addCartItem } from "@/redux/slices/cartSlice";
import { addToWishlistAPI, removeFromWishlistAPI } from "@/services/wishlistService";
import { addWishlistItem, removeWishlistItem } from "@/redux/slices/wishlistSlice";
import { useSelector } from "react-redux";
import { selectUserCart, selectUserWishlist, setUserData } from "@/redux/slices/userSlice";

interface CourseCardProps {
  role: string;
  course: {
    _id: string;
    image: { url: string };
    description: string;
    averageRating: number;
    price: number;
    modules: Array<any>;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ role, course }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);
  const userCart = useSelector(selectUserCart); // NEW: Get current cart IDs
  const userWishlist = useSelector(selectUserWishlist); // NEW: Get current wishlist IDs (if using)
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingWish, setLoadingWish] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  // -----------------------------
  // Add to Cart
  // -----------------------------
  const handleAddToCart = async () => {
    // NEW: Early exit if already in cart
    if (userCart.includes(course._id)) return;

    try {
      setLoadingCart(true);
      const res = await addToCartAPI(course._id);

      // Update redux cart with full course
      dispatch(addCartItem(course));

      // NEW: Optimistically update userData.cart (merge new array)
      const updatedCart = [...userCart, course._id];
      dispatch(setUserData({ cart: updatedCart }));

      console.log("Cart updated:", res);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      // Optional: Rollback - remove from cart.items if added optimistically
      // dispatch(removeCartItem(course._id)); // If you add this reducer
    } finally {
      setLoadingCart(false);
    }
  };

  // -----------------------------
  // Toggle Wishlist
  // -----------------------------
  // const handleWishlistToggle = async () => {
  //   if (loadingWish) return;

  //   try {
  //     setLoadingWish(true);

  //     if (!isWishlisted) {
  //       await addToWishlistAPI(course._id);
  //       dispatch(addWishlistItem(course));
  //     } else {
  //       await removeFromWishlistAPI(course._id);
  //       dispatch(removeWishlistItem(course._id));
  //     }

  //     setIsWishlisted(!isWishlisted);
  //   } catch (error: any) {
  //     console.log(error.response?.data || error.message);
  //   } finally {
  //     setLoadingWish(false);
  //   }
  // };

  // Check initial wishlist state
useEffect(() => {
  setIsWishlisted(userWishlist.includes(course._id));
}, [userWishlist, course._id]);

const handleWishlistToggle = async () => {
  if (loadingWish) return;

  try {
    setLoadingWish(true);

    if (!isWishlisted) {
      // API call
      await addToWishlistAPI(course._id);

      // Add full course to redux wishlist slice
      dispatch(addWishlistItem(course));

      // Update userData
      dispatch(setUserData({
        ...userData,
        wishlist: [...userWishlist, course._id]
      }));

      setIsWishlisted(true);
    } 
    else {
      await removeFromWishlistAPI(course._id);

      dispatch(removeWishlistItem(course._id));

      dispatch(setUserData({
        ...userData,
        wishlist: userWishlist.filter(id => id !== course._id)
      }));

      setIsWishlisted(false);
    }

  } catch (error: any) {
    console.log(error.response?.data || error.message);
  } finally {
    setLoadingWish(false);
  }
};


  return (
    <article className={styles.courseCard}>

      <Link href={`/${role}/course/${course._id}`} className={styles.imageContainer}>
        <img
          className={styles.courseImage}
          src={course?.image?.url}
          alt={course?.description || "Course Image"}
        />
      </Link>

      <button
        className={styles.wishlistButton}
        onClick={handleWishlistToggle}
        aria-label="Add to wishlist"
        disabled={loadingWish}
      >
        <FaHeart
          className={`${styles.wishlistIcon} ${isWishlisted ? styles.active : ""}`}
        />
      </button>

      <div className={styles.courseContent}>
        <p className={styles.courseDescription}>{course?.description}</p>

        <div className={styles.courseMetaGrid}>
          <span className={styles.metaItem}>
            ⭐ {course?.averageRating?.toFixed(1) || "N/A"}
          </span>
          <span className={styles.metaItem}>
            ₹{course?.price?.toLocaleString()}
          </span>
        </div>

        <hr className={styles.customLine} />

        <div className={styles.courseDetailsGrid}>
          <span className={styles.detailsItem}>
            {course?.modules?.length || 0} Modules
          </span>

          <button
            className={styles.addButton}
            onClick={handleAddToCart}
            aria-label="Add to cart"
            disabled={loadingCart}
          >
            {loadingCart ? "Adding..." : "Add +"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
