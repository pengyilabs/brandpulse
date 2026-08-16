import imgSmartVideo from "figma:asset/29468c4202ac56da70312fdaa7ff7844b56cec5f.png";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface DashboardOverviewProps {
  onCreateContent: () => void;
}

interface TemplateCardProps {
  title: string;
  subtitle: string;
  image: string;
  borderColor: string;
  onClick?: () => void;
}

function TemplateCard({ title, subtitle, image, borderColor, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-card relative rounded-xl h-[90px] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
    >
      <div className="content-stretch flex items-center overflow-clip p-4 relative rounded-inherit size-full">
        <div className="flex-1 min-w-px relative">
          <div className="flex flex-col gap-1 items-start justify-center relative h-full">
            <div className="relative shrink-0 w-full">
              <p className="font-semibold leading-tight text-base text-foreground whitespace-nowrap text-left">
                {title}
              </p>
            </div>
            <div className="flex items-start relative shrink-0 w-full">
              <p className="font-medium leading-tight text-muted-foreground text-xs text-left">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="relative rounded-lg shrink-0 size-16 overflow-hidden">
          <img
            alt={title}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            src={image}
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-solid inset-0 pointer-events-none rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ borderColor }}
      />
    </button>
  );
}

export function DashboardOverview({ onCreateContent }: DashboardOverviewProps) {
  const categories = [
    {
      title: 'Smart Video',
      subtitle: 'Transform videos into content',
      image: imgSmartVideo,
      borderColor: '#4B56F2',
      featured: true,
    },
    {
      title: 'Media Gen',
      subtitle: 'Generate visual content',
      image: '/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwd3JpdGluZyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzczOTM0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      borderColor: '#34D399',
      featured: false,
    },
    {
      title: 'Smart Shot',
      subtitle: 'AI photo generation',
      image: '/brand-tile-violet.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      borderColor: '#6EE7B7',
      featured: false,
    },
    {
      title: 'Edit Crew',
      subtitle: 'Collaborative editing tools',
      image: '/brand-tile-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHRlbXBsYXRlcyUyMGRlc2lnbnxlbnwxfHx8fDE3NzczOTM0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      borderColor: '#A7F3D0',
      featured: false,
    },
  ];

  const videoPlaceholders = [
    '/brand-tile-amber.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-coral.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-navy-cyan.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-amber-rose.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '/brand-tile-navy.svg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx2ZXJ0aWNhbCUyMHZpZGVvJTIwY29udGVudCUyMHNvY2lhbCUyMG1lZGlhJTIwcGhvbmV8ZW58MXx8fHwxNzc3Mzk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const aspectRatios = ['16/9', '9/16', '16/9', '1/1', '9/16', '16/9', '16/9', '9/16', '1/1', '16/9', '9/16', '16/9', '1/1', '16/9', '9/16'];

  const createdVideos = Array.from({ length: 40 }).map((_, index) => ({
    id: index,
    title: `Video ${index + 1}`,
    thumbnail: videoPlaceholders[index % videoPlaceholders.length],
    duration: '30s',
    aspectRatio: aspectRatios[index % aspectRatios.length],
  }));

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-foreground font-bold leading-tight" style={{ fontSize: '50px' }}>
            What would you like to
            <br />
            <span className="text-primary">create</span> today?
          </h1>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => (
              <TemplateCard
                key={category.title}
                title={category.title}
                subtitle={category.subtitle}
                image={category.image}
                borderColor={category.borderColor}
                onClick={category.featured ? onCreateContent : undefined}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground text-xl">Your Content</h2>
            <button className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              View All
            </button>
          </div>
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 4, 900: 6 }}>
            <Masonry gutter="16px">
              {createdVideos.map((video) => {
                const isPortrait = video.aspectRatio === '9/16';
                const isSquare = video.aspectRatio === '1/1';

                return (
                  <div key={video.id} className="group cursor-pointer">
                    <div
                      className="bg-card rounded-xl overflow-hidden relative border border-border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                      style={{
                        aspectRatio: video.aspectRatio,
                      }}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-sm text-white font-medium truncate mb-1">{video.title}</p>
                        <div className="inline-block px-2 py-1 bg-black/80 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                          {video.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    </div>
  );
}
