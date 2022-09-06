import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'umi';
import chatActivatedSrc from '@/assets/Index/chat_activated.png';
import chatInactivatedSrc from '@/assets/Index/chat_inactivated.png';
import addressBookActivatedSrc from '@/assets/Index/addressBook_activated.png';
import addressBookInactivatedSrc from '@/assets/Index/addressBook_inactivated.png';
import { logoutFn } from '@xkit-yx/login-react-ui';
import { authStore } from '@/store';
import config from '@/config';
import { observer } from 'mobx-react';
import { Modal, message } from 'antd';
import {
  Provider,
  SearchContainer,
  AddContainer,
  MyAvatarContainer,
} from '@xkit-yx/im-kit-ui';
import { useIntl } from 'umi';

import '@xkit-yx/im-kit-ui/es/style';
import './index.less';

const Index: React.FC<any> = observer(({ location, history, children }) => {
  const [chatLogo, setChatLogo] = useState<string>(chatActivatedSrc);
  const [addressBookLogo, setAddressBookLogo] = useState<string>(
    addressBookInactivatedSrc,
  );

  const intl = useIntl();
  const t = (id: string) => {
    return intl.formatMessage({
      id,
    });
  };

  const quit = () => {
    Modal.confirm({
      title: t('logout'),
      content: t('confirmLogout'),
      okText: t('okText'),
      cancelText: t('cancelText'),
      onOk: () => {
        logoutFn()
          .then(() => {
            message.success(t('logoutSuccess'));
            history.replace('/login');
            authStore.reset();
          })
          .catch((err) => {
            message.error(t('logoutFalied'));
            console.error('退出登录失败：', err);
          });
      },
    });
  };

  const goChat = () => {
    history.push('/main/chat');
  };

  useEffect(() => {
    if (location.pathname === '/main/addressBook') {
      setChatLogo(chatInactivatedSrc);
      setAddressBookLogo(addressBookActivatedSrc);
    } else if (location.pathname === '/main/chat') {
      setChatLogo(chatActivatedSrc);
      setAddressBookLogo(addressBookInactivatedSrc);
    }
  }, [location.pathname]);

  const initOptions = useMemo(() => {
    console.log('authStore: ', authStore.imAccid, authStore.imToken);
    if (authStore.imAccid && authStore.imToken) {
      return {
        appkey: config.appKey,
        account: authStore.imAccid,
        token: authStore.imToken,
        debugLevel: 'debug',
        lbsUrls: config.lbsUrls,
        linkUrl: config.linkUrl,
        needReconnect: true,
        reconnectionAttempts: 5,
      };
    }
    return null;
  }, [authStore.imAccid, authStore.imToken]);

  return initOptions ? (
    <Provider initOptions={initOptions} sdkVersion={authStore.imVersion as any}>
      <div className="desk-container">
        <div className="top">
          <div className="search">
            <SearchContainer onClickChat={goChat} />
          </div>
          <div className="add">
            <AddContainer onClickChat={goChat} />
          </div>
        </div>
        <div className="conversation-list">
          <div className="left-nav">
            <div className="avatar">
              <MyAvatarContainer />
            </div>
            <NavLink to="/main/chat" activeClassName="selected">
              <div className="chat">
                <img src={chatLogo} />
                <div className="content">{t('message')}</div>
              </div>
            </NavLink>
            <NavLink to="/main/addressBook">
              <div className="address-book">
                <img src={addressBookLogo} />
                <div className="content">{t('contact')}</div>
              </div>
            </NavLink>
            <div className="quit" onClick={quit}>
              <div className="quit-logo"></div>
              <div className="content">{t('exit')}</div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </Provider>
  ) : null;
});
export default Index;
