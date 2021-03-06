import request from '@/utils/request';
import { HouseListParams } from './house.d';

/**
 * 获取楼房接口
 * @param data
 */
export async function queryHouse(data: HouseListParams) {
  return request('/busi/house/houseInfo', {
    method: 'POST',
    data,
  });
}
