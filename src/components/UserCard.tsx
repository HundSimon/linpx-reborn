import { history } from 'umi';

import { INovelProfile, IUserInfo } from '@/utils/api';

interface IUserCard {
  userInfo: IUserInfo;
  novelInfoList: INovelProfile[];
}

export const NovelNumber = 5;

function NovelCard({ coverUrl, title, id }: INovelProfile) {
  return (
    <div
      className="lp-shadow mx-2 text-sm w-20 flex-grow-0 flex-shrink-0 overflow-hidden flex flex-col"
      onClick={() => id && history.push(`/pixiv/novel/${id}`)}
    >
      {coverUrl ? (
        <div className="h-20 w-full overflow-hidden flex items-center">
          <img className="w-full" src={coverUrl} loading="lazy" />
        </div>
      ) : (
        <div className="h-20 w-full bg-gray-200" />
      )}
      <div className="u-line-2 m-1 text-center font-bold text-xs whitespace-pre-line flex-grow">
        {title || '\n\n'}
      </div>
    </div>
  );
}

export default function UserCard({ userInfo, novelInfoList }: IUserCard) {
  const { name, imageUrl, id } = userInfo;
  if (novelInfoList.length < NovelNumber) {
    novelInfoList = novelInfoList.concat(
      Array(NovelNumber - novelInfoList.length).fill({}),
    );
  }

  return (
    <div className="my-3 p-2 lp-shadow lp-bgcolor flex overflow-x-scroll">
      <div
        className="mt-1 flex flex-col items-center flex-grow"
        onClick={() => history.push(`/pixiv/user/${id}`)}
      >
        <div
          className="rounded-full bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            width: '4.7rem',
            height: '4.7rem',
          }}
        />
        <div
          className="py-1 w-24 text-center text-base font-bold u-line-2"
          style={{ lineHeight: '1.1rem' }}
        >
          {name}
        </div>
      </div>
      <div className="pr-1 flex">
        {novelInfoList.slice(0, NovelNumber).map((ele, index) => (
          <NovelCard key={ele?.id || index} {...ele} />
        ))}
      </div>
    </div>
  );
}
