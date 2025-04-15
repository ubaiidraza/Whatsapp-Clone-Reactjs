// import { onAuthStateChanged } from "firebase/auth";
// import React, { useEffect, useState } from "react";
// import { auth } from "../config/firebase/firebasemethods";
// import { useNavigate } from "react-router-dom";

// const ProtectedRoutes = ({ component, allowAnonymous = false }) => {
//   const [isUser, setIsUser] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsUser(true);
//       } else {
//         setIsUser(false);
//         navigate("/login", { replace: true }); // Redirect to login page if not authenticated
//       }
//       setLoading(false);
//     });
//   }, [navigate]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!isUser && !allowAnonymous) {
//     return navigate("/login", { replace: true }); // Redirect to login page if not authenticated
//   }

//   return component;
// };

// export default ProtectedRoutes;
