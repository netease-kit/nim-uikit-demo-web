import AddressBookInfo from '@/components/AddressBookInfo/index';
import { ContactListContainer } from '@xkit-yx/im-kit-ui';

import './index.less';

const AddressBook: React.FC = () => {
  return (
    <div className="address-book-container">
      <div className="address-book-list">
        <ContactListContainer />
      </div>
      <AddressBookInfo />
    </div>
  );
};

export default AddressBook;
