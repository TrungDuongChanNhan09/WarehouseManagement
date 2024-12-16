import React from 'react'
import { Navigate } from 'react-router-dom';

//Higher Order Component: HOC

export default function UserProtect({children}) {
    if (!true) {
        return (
            <>
            <Navigate to={"/login"} />
            </>
        );
    }
  return <>{children}</>;
}
