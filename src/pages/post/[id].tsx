import { postApi, postCommentApi } from '@/api';
import { closeModal, openModal } from '@/components/LinpxModal';
import PageLayout from '@/components/PageLayout';
import { stringHash } from '@/utils/util';
import { Pagination } from 'antd';
import { Toast } from 'antd-mobile';
import React, { useRef, useState } from 'react';
import { IRouteProps } from 'umi';
import CommentModal from '../components/CommentModal';
import NameTime from './components/NameTime';

const PostComment: React.FC<{
  id: string;
  rootRef: React.RefObject<HTMLDivElement>;
}> = ({ id, rootRef }) => {
  const [commentPage, setCommentPage] = useState(1);
  const { data: commentData, revalidate } = postCommentApi.useByPostId({
    postId: id,
    page: commentPage,
    pageSize: 10,
  });
  // 评论数据
  if (!commentData) return <></>;
  const { records, pageTotal, pageSize, total, page } = commentData;
  return (
    <div className="px-2">
      {records.length ? (
        records.map(({ ip, content, _time }, index) => (
          <div className="py-1" style={{ borderBottom: '1px solid #eee' }}>
            <NameTime
              className="text-base"
              ip={ip}
              _time={_time}
              rightEle={(page - 1) * pageSize + index + 1 + 'F'}
            />
            {content}
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center h-20 text-gray-400">
          快来添加第一条回复吧
        </div>
      )}
      {pageTotal > 1 && (
        <div className="flex justify-center my-4">
          <Pagination
            pageSize={pageSize}
            current={page}
            total={total}
            showSizeChanger={false}
            onChange={(e) => {
              rootRef.current?.scrollIntoView({ behavior: 'smooth' });
              setCommentPage(e);
            }}
          />
        </div>
      )}
      <div
        className="w-full py-3 pl-6 absolute bottom-0 text-gray-400 bg-white"
        style={{ borderTop: '1px solid #ccc' }}
        onClick={() =>
          openModal({
            children: (
              <CommentModal
                submitText="回复"
                onSubmit={async (content) => {
                  const res = await postCommentApi.postOne({
                    postId: id,
                    content,
                  });
                  if (res.error) {
                    Toast.info('评论失败', 1.0, undefined, false);
                    return false;
                  } else {
                    Toast.info('评论成功', 1.0, undefined, false);
                    closeModal();
                    revalidate();
                    // endRef.current?.scrollIntoView({ behavior: 'smooth' });
                    return true;
                  }
                }}
              />
            ),
          })
        }
      >
        回复帖子
      </div>
    </div>
  );
};

const Post: React.FC<{ match: IRouteProps }> = ({ match }) => {
  const id: string = match.params.id;
  const rootRef = useRef<HTMLDivElement>(null);
  const res = postApi.useOne(id);
  if (!res) {
    return (
      <PageLayout title="帖子详情">
        <></>
      </PageLayout>
    );
  }
  const { title, content, ip, createTime } = res;
  return (
    <PageLayout title="帖子详情">
      <div className="mb-16" ref={rootRef}>
        <div className="px-2 mb-4">
          <div className="text-3xl py-3 font-bold">{title}</div>
          <div className="flex justify-between text-base text-gray-500 mb-1">
            <div style={{ width: 70 }}>{stringHash(ip)}</div>
            <div>{new Date(createTime).toLocaleString().slice(2, -3)}</div>
            <div style={{ width: '10%' }}></div>
          </div>
          <div>{content}</div>
        </div>
        <div className="bg-gray-100" style={{ height: 10 }}></div>
        <PostComment id={id} rootRef={rootRef} />
      </div>
    </PageLayout>
  );
};

export default Post;