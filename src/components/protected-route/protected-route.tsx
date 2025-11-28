import { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { checkUserAuth } from '@slices';
import { getIsAuthenticated, getIsAuthChecked } from '@selectors';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isAuthenticated = useSelector(getIsAuthenticated);
  const isAuthChecked = useSelector(getIsAuthChecked);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
