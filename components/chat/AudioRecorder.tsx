"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, Play, Pause } from 'lucide-react';
// @ts-ignore
import RecordRTC from 'recordrtc';

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      // コンポーネントのアンマウント時にストリームを停止
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });
      
      recorderRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      
      // 録音時間の更新
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error('音声録音の開始に失敗しました:', error);
      alert('マイクへのアクセスが許可されていないか、エラーが発生しました。');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        
        if (blob) {
          const audioUrl = URL.createObjectURL(blob);
          setRecordedAudio(audioUrl);
          
          // オーディオ要素の作成
          if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
          } else {
            audioRef.current.src = audioUrl;
          }
        }
        
        // ストリームの停止
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        // タイマーの停止
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setIsRecording(false);
      });
    }
  };

  const cancelRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.reset();
      
      // ストリームの停止
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // タイマーの停止
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setIsRecording(false);
      setRecordedAudio(null);
      setRecordingTime(0);
    }
  };

  const playPauseRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      
      // 再生終了時のイベントリスナー
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const sendRecording = () => {
    if (recordedAudio) {
      onRecordingComplete(recordedAudio);
    }
  };

  // 録音時間のフォーマット（秒 -> mm:ss）
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center p-4">
      {isRecording ? (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-3 relative">
            <div className="absolute w-16 h-16 rounded-full bg-red-500 animate-pulse opacity-70"></div>
            <Mic size={30} className="text-white z-10" />
          </div>
          <p className="text-lg font-medium">{formatTime(recordingTime)}</p>
          <p className="text-xs text-gray-500 mb-4">録音中...</p>
          
          <div className="flex space-x-3">
            <button 
              onClick={cancelRecording}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              キャンセル
            </button>
            <button 
              onClick={stopRecording}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm flex items-center"
            >
              <Square size={14} className="mr-1" />
              停止
            </button>
          </div>
        </div>
      ) : recordedAudio ? (
        <div className="flex flex-col items-center w-full">
          <div className="w-full bg-gray-100 rounded-lg p-3 mb-3 flex items-center">
            <button 
              onClick={playPauseRecording}
              className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center mr-3"
            >
              {isPlaying ? (
                <Pause size={16} className="text-white" />
              ) : (
                <Play size={16} className="text-white ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <div className={`h-full bg-primary-500 ${isPlaying ? 'animate-progress' : ''}`} style={{ width: isPlaying ? '100%' : '0%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{formatTime(recordingTime)}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                setRecordedAudio(null);
                setRecordingTime(0);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              削除
            </button>
            <button 
              onClick={sendRecording}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm flex items-center"
            >
              <Send size={14} className="mr-1" />
              送信
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <button 
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mb-3 transition-transform transform hover:scale-105"
          >
            <Mic size={30} className="text-white" />
          </button>
          <p className="text-sm text-gray-600">タップして録音開始</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
