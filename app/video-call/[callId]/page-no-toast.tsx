import React from 'react';
import VideoCallClientNoToast from './VideoCallClientNoToast';

interface PageProps {
  params: {
    callId: string;
  };
}

const VideoCallPage = ({ params }: PageProps) => {
  const { callId } = params;
  
  return <VideoCallClientNoToast callId={callId} />;
};

export default VideoCallPage;
