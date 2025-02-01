import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserAuth = ({ children }) => {

    const navigate = useNavigate();
  const {user} = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (!user) {
        navigate("/login");
        return;
      }
    if (user) {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return <>{children}</>;
};

export default UserAuth;
