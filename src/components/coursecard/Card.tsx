/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link, useParams } from "react-router-dom";
// import { addItemToCart } from "../../features/cartSlice";
import { FaHeart } from "react-icons/fa6";
// import { addItemToWishlist, removeWishlistItem, selectWishlistItems } from "../../features/wishlistSlice";
import "./CourseCard.scss"; // Import SCSS for CourseCard

function CourseCard({ role, course }) {
  const { userId } = useParams();

  const dispatch = useDispatch();

  const wishlistItems = useSelector(selectWishlistItems);

  const [isWishlisted, setIsWishlisted] = useState(false);

  // Update local state when wishlist items change
  useEffect(() => {
    if (wishlistItems && course) {
      const inWishlist = wishlistItems.some((item) => item._id === course._id);
      setIsWishlisted(inWishlist);
    }
  }, [wishlistItems, course]);

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!course || !userId) return;

    if (isWishlisted) {
      dispatch(removeWishlistItem({ courseId: course._id, userId }));
    } else {
      dispatch(addItemToWishlist({ ...course, userId }));
    }
  };

  return (
    <article
      className="course-card"
      id="Card"
    >
      <Link to={`/${role}/${userId}/coursepage/${course?._id}`}>
        <img
          className="course-image"
          src={course?.image?.url}
          alt="Course Image"
        />
      </Link>
      <button
        className="wishlist-button"
        onClick={handleWishlistToggle}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FaHeart 
          className={`wishlist-icon ${isWishlisted ? 'active' : ''}`}
        />
      </button>
      <p
        className="course-description"
        id="Text"
      >
        {course?.description}
      </p>
      <div
        className="course-meta-grid"
        id="Text"
      >
        <span
          className="meta-item"
          id="Text"
        >
          {course?.averageRating}
        </span>
        <span
          className="meta-item"
          id="Text"
        >
          &#8377; {course?.price}
        </span>
      </div>
      <hr className="custom-line" />
      <div className="course-details-grid">
        <span
          className="details-item"
          id="Text"
        >
          Modules {course?.modules?.length}
        </span>
        <button
          className="add-button"
          onClick={() => dispatch(addItemToCart({ ...course, userId: userId }))}
        >
          Add+
        </button>
      </div>
    </article>
  );
}

export default CourseCard;