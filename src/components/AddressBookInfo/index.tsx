import {
  FriendListContainer,
  BlackListContainer,
  GroupListContainer,
  useStateContext,
  Welcome,
} from '@xkit-yx/im-kit-ui';
import { useHistory } from 'react-router-dom';

import './index.less';

const AdressBookInfo: React.FC = () => {
  const { state } = useStateContext();
  const history = useHistory();

  const goChat = () => {
    history.push('/main/chat');
  };

  return (
    <div className="address-book-info">
      {(() => {
        switch (state.selectedContactType) {
          case 'friendList':
            return <FriendListContainer afterSendMsgClick={goChat} />;
          case 'blackList':
            return <BlackListContainer afterSendMsgClick={goChat} />;
          case 'groupList':
            return <GroupListContainer onItemClick={goChat} />;
          default:
            return <Welcome />;
        }
      })()}
    </div>
  );
};

export default AdressBookInfo;
