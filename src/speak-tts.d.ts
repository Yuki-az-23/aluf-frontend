declare module 'speak-tts' {
  interface SpeechInit {
    lang?: string;
    splitSentences?: boolean;
    volume?: number;
    rate?: number;
    pitch?: number;
  }
  interface SpeechListeners {
    onstart?: () => void;
    onend?: () => void;
    onresume?: () => void;
    onboundary?: (event: SpeechSynthesisEvent) => void;
  }
  interface SpeakOptions {
    text: string;
    queue?: boolean;
    listeners?: SpeechListeners;
  }
  export default class Speech {
    init(options?: SpeechInit): Promise<unknown>;
    speak(options: SpeakOptions): Promise<unknown>;
    pause(): void;
    resume(): void;
    cancel(): void;
  }
}
