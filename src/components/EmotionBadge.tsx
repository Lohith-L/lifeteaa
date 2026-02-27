import { getEmotionConfig } from '@/lib/emotions';

interface EmotionBadgeProps {
  emotion: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function EmotionBadge({ emotion, size = 'md' }: EmotionBadgeProps) {
  const config = getEmotionConfig(emotion);
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-semibold bg-muted text-muted-foreground ${sizeClasses[size]}`}>
      <span>{config.emoji}</span>
      <span>{emotion}</span>
    </span>
  );
}
