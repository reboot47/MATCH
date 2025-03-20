import VideoCallClient from './VideoCallClientToastify';

type PageProps = {
  params: Promise<{ callId: string }>;
}

/**
 * ビデオ通話ページのサーバーコンポーネント
 * Next.js App Routerのサーバーコンポーネントで、
 * URL parametersを処理し、クライアントコンポーネントに必要な値を渡す
 */
export default async function VideoCallPage({ params }: PageProps) {
  // In Next.js, we need to await params before using its properties
  const resolvedParams = await params;
  const callId = resolvedParams.callId;
  
  return <VideoCallClient callId={callId} />;
}

