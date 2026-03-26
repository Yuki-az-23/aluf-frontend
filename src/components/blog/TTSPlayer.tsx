import { useLang } from '@/i18n';
import { IconButton } from '@/components/ui/IconButton';
import { useTTS } from '@/hooks/useTTS';

interface TTSPlayerProps {
  text: string;
  lang: string;
}

export function TTSPlayer({ text, lang }: TTSPlayerProps) {
  const { t } = useLang();
  const { play, pause, stop, isPlaying, isPaused, progress } = useTTS(text, lang);

  return (
    <div
      role="group"
      aria-label={t('tts.player')}
      className="flex flex-col gap-2 my-4"
    >
      <div className="flex items-center gap-1">
        <IconButton
          icon="play_arrow"
          label={t('tts.play')}
          onClick={play}
          disabled={isPlaying && !isPaused}
          className="hover:bg-surface-alt disabled:opacity-40"
        />
        <IconButton
          icon="pause"
          label={t('tts.pause')}
          onClick={pause}
          disabled={!isPlaying || isPaused}
          className="hover:bg-surface-alt disabled:opacity-40"
        />
        <IconButton
          icon="stop"
          label={t('tts.stop')}
          onClick={stop}
          disabled={!isPlaying && !isPaused}
          className="hover:bg-surface-alt disabled:opacity-40"
        />
      </div>

      <div
        className="h-1.5 w-full rounded-full bg-surface-alt overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${progress}%`}
        aria-label={t('tts.player')}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
