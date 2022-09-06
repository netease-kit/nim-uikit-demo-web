import { useHistory } from 'react-router-dom';
import { ContactListContainer, ContactInfoContainer } from '@xkit-yx/im-kit-ui';

import './index.less';

const AddressBook: React.FC = () => {
  const history = useHistory();

  const goChat = () => {
    history.push('/main/chat');
  };

  return (
    <div className="address-book-container">
      <div className="address-book-list">
        <ContactListContainer />
      </div>
      <div className="address-book-info">
        <ContactInfoContainer
          afterSendMsgClick={goChat}
          onGroupItemClick={goChat}
        />
      </div>
    </div>
  );
};

export default AddressBook;
