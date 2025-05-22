import { PAGINATION } from 'src/utilities/constant';
import {
  IFindUserResponse,
  IListUserInput,
} from 'src/infrastructure/serviceInterfaces/user.service.interface';

/**
 * Paginates the given data based on the provided filter object and total records.
 *
 * @param {any[]} data
 * @param {(IListUserInput)} inputObj
 * @param {number} total
 * @return {*}  {(IFindBookResponse | IBorrowedBookListResponse)}
 */
export const pagination = (
  data: any[],
  inputObj: IListUserInput,
  total: number,
): IFindUserResponse => {
  const pageRecords = inputObj?.pageSize || PAGINATION?.defaultRecords;
  const page = inputObj?.pageNum;
  const totalPages = Math.ceil(total / pageRecords);
  const startRecord = (page - 1) * pageRecords + 1;
  const endRecord = Math.min(page * pageRecords, total);
  return {
    startRecord,
    endRecord,
    nextPage: totalPages > page ? page + 1 : null,
    total,
    totalPages,
    data,
  };
};
