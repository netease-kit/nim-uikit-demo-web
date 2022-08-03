import { makeAutoObservable } from 'mobx';
import config from '@/config';
const { imAccid, imToken, imVersion } = config;

export class AuthStore {
  imAccid = imAccid;
  imToken = imToken;
  imVersion = imVersion;

  constructor() {
    makeAutoObservable(this);
  }

  public set(params: {
    imAccid?: string;
    imToken?: string;
    imVersion?: 1 | 2;
  }) {
    Object.assign(this, params);
  }

  public reset() {
    this.imAccid = '';
    this.imToken = '';
    this.imVersion = 2;
  }
}

export const authStore = new AuthStore();
