import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the main app
  return <Navigate to="/app" replace />;
};

export default Index;
