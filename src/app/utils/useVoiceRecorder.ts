import { useState, useRef, useCallback } from 'react';

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // 1 channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioDataRef = useRef<Float32Array[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      scriptProcessorRef.current = processor;
      audioDataRef.current = [];

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);
        audioDataRef.current.push(new Float32Array(channelData));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      setAudioBlob(null);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Could not access microphone. Please allow microphone permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (isRecording) {
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
      }
      
      const sampleRate = audioContextRef.current?.sampleRate || 16000;
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      
      // Merge audio data
      const buffers = audioDataRef.current;
      let totalLength = 0;
      for (const b of buffers) totalLength += b.length;
      
      const result = new Float32Array(totalLength);
      let offset = 0;
      for (const b of buffers) {
        result.set(b, offset);
        offset += b.length;
      }
      
      const blob = encodeWAV(result, sampleRate);
      setAudioBlob(blob);
      
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearAudio = useCallback(() => {
    setAudioBlob(null);
  }, []);

  return { isRecording, audioBlob, startRecording, stopRecording, clearAudio };
}
