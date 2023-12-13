/**
 * 全局工具函数
 */
import * as fs from 'fs';

import { REQUEST_CODE, REQUEST_MSG } from '@/utils/enums/request';
import { Response } from '@/utils/types/response';

// 统一返回体
export const responseMessage = <T = any>(
  data,
  msg: string = REQUEST_MSG.SUCCESS,
  code: number = REQUEST_CODE.SUCCESS,
): Response<T> => {
  return { data, msg, code };
};

/**
 * 将数组转成树形数据
 * @param {any} resource: 源数据
 * @param {string} id
 * @param {string} parentId
 * @param {string} children
 */
export function initializeTree<T>(
  resource: T[],
  id: string,
  parentId: string,
  children: string,
): T[] {
  const temp = JSON.parse(JSON.stringify(resource));
  // 以id为键，当前对象为值，存入一个新的对象中
  const tempObj = {};
  for (const i in temp) {
    tempObj[temp[i][id]] = temp[i];
  }

  return temp.filter((father: T) => {
    // 把当前节点的所有子节点找到
    const childArr = temp.filter((child: T) => father[id] == child[parentId]);
    childArr.length > 0 ? (father[children] = childArr) : '';
    // 只返回第一级数据；如果当前节点的fatherId不为空，但是在父节点不存在，也为一级数据
    return father[parentId] === null || !tempObj[father[parentId]];
  });
}

/**
 * 生成文件上传文件夹
 * @param {string} filePath
 */
export const checkDirAndCreate = (filePath: string): void => {
  const pathArr = filePath.split('/');
  let checkPath = '.';
  let item: string;
  for (item of pathArr) {
    checkPath += `/${item}`;
    if (!fs.existsSync(checkPath)) {
      fs.mkdirSync(checkPath);
    }
  }
};
