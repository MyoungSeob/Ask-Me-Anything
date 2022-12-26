import BadRequestError from './bad_request_error';

export default function checkSupportMethod(supportMethod: string[], method?: string) {
  if (supportMethod.indexOf(method!) === -1) {
    // 에러 반환
    throw new BadRequestError('지원하지 않는 메서드입니다.');
  }
}
