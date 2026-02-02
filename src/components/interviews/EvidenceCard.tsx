import { SectionCard } from './ui';
import AudioPlayer from '@/components/interviews/AudioPlayer';

interface EvidenceCardProps {
  photoFile: string;
  audioFile: string;
  interviewId: string;
}

export default function EvidenceCard({ photoFile, audioFile, interviewId }: EvidenceCardProps) {
  return (
    <SectionCard title="Evidence">
      <div className="space-y-6">
        {/* Photo Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
              Photo
            </span>
            {photoFile && (
              <a
                href={photoFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Open
              </a>
            )}
          </div>
          {photoFile ? (
            <img
              src={photoFile}
              alt={`Evidence photo for interview ${interviewId}`}
              className="w-full object-contain max-h-80 rounded-lg border hover:scale-[1.02] transition"
              style={{ borderColor: 'var(--border-light)' }}
            />
          ) : (
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              No photo.
            </p>
          )}
        </div>

        {/* Audio Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
              Audio
            </span>
            {audioFile && (
              <a
                href={audioFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Open
              </a>
            )}
          </div>
          {audioFile ? (
            <AudioPlayer src={audioFile} />
          ) : (
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              No audio.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
