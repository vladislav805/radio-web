import { IApiEndpoint, ICurrentTrack } from '../../types';

type IParams = {
    streamId: number;
};

const getCurrentTrack: IApiEndpoint<ICurrentTrack, IParams> = async rawParams => {
    const { streamId } = rawParams;


    return { errorCode: 0, stream: streamId };
};

export default getCurrentTrack;
