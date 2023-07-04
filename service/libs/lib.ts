import * as CryptoJS from 'crypto-js';
import { cryptoConstants } from './crypto';

export const cryptoString = (str) => {
  return CryptoJS.HmacSHA1(str, cryptoConstants.privateKey).toString();
};

export const jwtConstants = {
  secret: 'jaydenBlog',
  adminSecret: 'admin.jaydenBlog',
};
