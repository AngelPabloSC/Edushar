import { useRoutes } from 'react-router-dom';
import router from './router';

const App = () => {
  const routes = useRoutes(router);
  
  return <>{routes}</>;
};

export default App;
