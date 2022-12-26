import { NextApiRequest, NextApiResponse } from 'next';
import MessageModel from '@/models/message/message.model';
import BadRequestError from './error/bad_request_error';
import CustomServerError from './error/custom_server_error';
import FirebaseAdmin from '@/models/firebase_admin';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { uid, message, author } = req.body;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (message === undefined) {
    throw new BadRequestError('message 누락');
  }
  await MessageModel.post({ uid, message, author });
  return res.status(201).end();
}

async function list(req: NextApiRequest, res: NextApiResponse) {
  const { uid, page, size } = req.query;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  const convertPage = page === undefined ? '1' : page;
  const convertSize = size === undefined ? '10' : size;
  const uidToString = Array.isArray(uid) ? uid[0] : uid;
  const pageToString = Array.isArray(convertPage) ? convertPage[0] : convertPage;
  const sizeToString = Array.isArray(convertSize) ? convertSize[0] : convertSize;
  const listResponse = await MessageModel.listWithPage({
    uid: uidToString,
    size: parseInt(sizeToString, 10),
    page: parseInt(pageToString, 10),
  });
  return res.status(200).json(listResponse);
}

async function postReply(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId, reply } = req.body;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (messageId === undefined) {
    throw new BadRequestError('messageId 누락');
  }
  if (reply === undefined) {
    throw new BadRequestError('reply 누락');
  }
  await MessageModel.postReply({ uid, messageId, reply });
  return res.status(201).end();
}

async function updateMessage(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  if (token === undefined) {
    throw new CustomServerError({ statusCode: 401, message: '권한이 없습니다.' });
  }
  let tokenUid: null | string = null;
  try {
    const decode = await FirebaseAdmin.getInstance().Auth.verifyIdToken(token);
    tokenUid = decode.uid;
  } catch (error) {
    throw new BadRequestError('token에 문제가 있습니다.');
  }
  const { uid, messageId, deny } = req.body;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (uid !== tokenUid) {
    throw new CustomServerError({ statusCode: 401, message: '수정 권한이 없습니다.' });
  }
  if (messageId === undefined) {
    throw new BadRequestError('messageId 누락');
  }
  if (deny === undefined) {
    throw new BadRequestError('deny 누락');
  }
  const result = await MessageModel.updateMessage({ uid, messageId, deny });
  return res.status(200).json(result);
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { uid, messageId } = req.query;
  if (uid === undefined) {
    throw new BadRequestError('uid 누락');
  }
  if (messageId === undefined) {
    throw new BadRequestError('messageId 누락');
  }
  const uidToString = Array.isArray(uid) ? uid[0] : uid;
  const messageIdToString = Array.isArray(messageId) ? messageId[0] : messageId;
  const data = await MessageModel.get({ uid: uidToString, messageId: messageIdToString });
  return res.status(200).json(data);
}

const MessageCtrl = {
  post,
  updateMessage,
  list,
  postReply,
  get,
};

export default MessageCtrl;
