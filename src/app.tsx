import React from 'react';
import { FormattedMessage } from 'umi';
import { authStore } from '@/store';
import packageJson from '../package.json';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Select } from 'antd';
import { observer } from 'mobx-react';

const VersionSelect = observer(() => {
  return (
    <Select
      className="im-version"
      options={[
        { label: 'IM SDK', value: 1 },
        { label: 'IM Elite SDK ', value: 2 },
      ]}
      value={authStore.imVersion}
      onChange={(value) => {
        authStore.set({
          imVersion: value as any,
        });
      }}
    />
  );
});

const Index: React.FC<any> = (props) => {
  // setLocale('en-US'); 手动设置国际化语言
  return (
    <ConfigProvider locale={zhCN}>
      <div className="wrapper">
        {props.children}
        <VersionSelect />
        <div className="app-info">
          ©1997 - {new Date().getFullYear()} <FormattedMessage id="copyright" />{' '}
          v{packageJson.version}
        </div>
      </div>
    </ConfigProvider>
  );
};

export function rootContainer(container: any) {
  return React.createElement(Index, null, container);
}
