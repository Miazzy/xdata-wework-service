// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportBussiness = require('../../../app/service/bussiness');
import ExportBussinesscd = require('../../../app/service/bussinesscd');

declare module 'egg' {
  interface IService {
    bussiness: AutoInstanceType<typeof ExportBussiness>;
    bussinesscd: AutoInstanceType<typeof ExportBussinesscd>;
  }
}
