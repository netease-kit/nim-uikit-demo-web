import React, { FC, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { ComplexAvatarContainer, useStateContext } from '@xkit-yx/im-kit-ui';
import { ComplexAvatarContainerProps } from '@xkit-yx/common-ui/es/components/ComplexAvatar/Container';

const MyUserInfo: FC = () => {
  const { nim, initOptions } = useStateContext();

  // @ts-ignore
  window.nim = nim;

  const [myUserInfo, setMyUserInfo] = useState<
    ComplexAvatarContainerProps | undefined
  >(undefined);

  useEffect(() => {
    nim
      .getUsersNameCardFromServer({ accounts: [initOptions.account] })
      .then((res) => {
        const userInfo = res[0];
        setMyUserInfo({
          ...userInfo,
        });
      });
  }, [initOptions.account]);

  return myUserInfo ? (
    <ComplexAvatarContainer
      {...myUserInfo}
      afterSave={(res) => {
        setMyUserInfo({
          ...res,
        });
      }}
    />
  ) : (
    <Spin />
  );
};

export default MyUserInfo;
