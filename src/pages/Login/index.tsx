import { Login as Signin } from '@xkit-yx/login-react-ui';

import '@xkit-yx/login-react-ui/es/style';
import './index.less';

const Login: React.FC = () => {
  return (
    <div className="login-wrapper">
      <Signin />
    </div>
  );
};

export default Login;
