import { useRoutes } from 'react-router-dom';
import router from './core/router';

const App = () => {
  const routes = useRoutes(router);
  
  return <>{routes}</>;
};

export default App;
