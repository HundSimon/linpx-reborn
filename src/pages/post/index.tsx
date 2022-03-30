import PageLayout from '@/components/PageLayout';
import TopImg from '@/assets/icon/top.png';
import { Dropdown, Pagination } from 'antd';
import { IPost, postApi, usePixivNovelProfiles } from '@/api';
import { history } from 'umi';
import { useState } from 'react';
import NameTime from './components/NameTime';
import { Array2Map } from '@/types';
import NovelRefer from './components/NovelRefer';
import { CaretDownOutlined } from '@ant-design/icons';

const topPostList = [
  {
    title: '【规章】LINPX匿名版聊社区规范',
  },
  {
    title: '【教程】LINPX使用指南',
  },
  {
    title: '【闲聊】LINPX的起源、现状和未来',
  },
];

// 置顶帖子
const TopPostElement = (
  <div className="text-lg">
    {topPostList.map(({ title }, index) => (
      <div
        className="flex px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
        style={{
          borderBottom:
            index != topPostList.length - 1 ? '1px solid #ddd' : undefined,
        }}
      >
        <img
          style={{ width: 22, height: 22, position: 'relative', top: 4 }}
          src={TopImg}
        />
        <div>{title}</div>
      </div>
    ))}
    {topPostList.length > 0 && (
      <div style={{ backgroundColor: '#eee', height: 18 }} />
    )}
  </div>
);

// 普通帖子
const PostPreviewElement: React.FC<{ postList: IPost[]; sortType: ISortType }> =
  ({ postList, sortType }) => {
    const referList = postList
      .map(({ refer }) => refer)
      .filter((refer) => refer && refer.type && refer.data);
    const referNovelList = referList
      .filter((refer) => refer?.type == 'novel')
      .map((refer) => refer?.data) as string[];
    const novelInfo = usePixivNovelProfiles(referNovelList);
    const novelInfoMap = novelInfo ? Array2Map(novelInfo) : {};
    return (
      <>
        {postList.map(
          ({
            ip,
            title,
            content,
            _time,
            id,
            commentCount,
            refer,
            createTime,
          }) => {
            let referElement = null;
            // 引用小说
            if (refer?.type == 'novel' && refer.data) {
              const novelInfo = novelInfoMap[refer.data];
              if (novelInfo) {
                referElement = <NovelRefer {...novelInfo} />;
              }
            }
            return (
              <div
                key={id}
                className="px-4 py-2 hover:bg-gray-100 transition-all cursor-pointer"
                style={{ borderBottom: '1px solid #ddd' }}
                onClick={() => {
                  history.push('/post/' + id);
                }}
              >
                <NameTime
                  ip={ip}
                  _time={sortType == 'post' ? createTime : _time}
                  rightEle={'回复: ' + commentCount}
                />
                <div className="u-line-1 font-bold mt-0.5">{title}</div>
                <div className="u-line-2 text-base">{content}</div>
                {referElement}
              </div>
            );
          },
        )}
      </>
    );
  };

// 按事件排序
// 帖子分区
// todo:后端限制，每分钟最多发2条新帖，每小时最多发5条，每天最多发10条帖子
const sortTypeMap = {
  comment: '回复时间排序',
  post: '发帖时间排序',
};

type ISortType = keyof typeof sortTypeMap;

export default function () {
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState<keyof typeof sortTypeMap>('comment');
  const res = postApi.usePage({ page, sort: sortType });

  if (!res)
    return (
      <PageLayout title="最近帖子">
        <></>
      </PageLayout>
    );

  const { records: postList, pageSize, pageTotal, total } = res;

  return (
    <PageLayout title="最近帖子">
      {TopPostElement}
      <div
        className="flex justify-between text-lg p-2 px-4"
        style={{ borderBottom: '1px solid #ddd' }}
      >
        <div>帖子总数：{total}</div>
        <Dropdown
          placement="bottomCenter"
          trigger={['click']}
          overlay={
            <div className="text-lg bg-gray-300 rounded-md py-1 overflow-hidden">
              {Object.entries(sortTypeMap).map(([sortType, text]) => (
                <div
                  className="hover:bg-gray-400 px-2"
                  key={sortType}
                  onClick={() => setSortType(sortType as any)}
                >
                  {text}
                </div>
              ))}
            </div>
          }
        >
          <div>
            {sortTypeMap[sortType]}
            <CaretDownOutlined />
          </div>
        </Dropdown>
      </div>
      <PostPreviewElement postList={postList} sortType={sortType} />
      {
        // 两页以上显示分页器
        pageTotal > 1 && (
          <div className="flex justify-center my-4">
            <Pagination
              pageSize={pageSize}
              current={page}
              total={total}
              showSizeChanger={false}
              onChange={(e) => {
                setPage(e);
              }}
            />
          </div>
        )
      }
      <div
        className="absolute bg-yellow-500 rounded-full"
        style={{
          right: 18,
          bottom: 40,
          width: 80,
          height: 80,
          fontSize: 100,
          textAlign: 'center',
          lineHeight: '68px',
        }}
        onClick={() => history.push('/post/create')}
      >
        +
      </div>
    </PageLayout>
  );
}