import { useRef, useState, useEffect, useCallback, useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface ResponsiveValue {
  mobile: number;
  desktop: number;
}

interface CarouselProps {
  children: ReactNode;
  slidesPerView?: number | ResponsiveValue;
  gap?: number;
  autoPlay?: number; // interval in ms, 0 = off
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Carousel({
  children,
  slidesPerView = 1,
  gap = 16,
  autoPlay = 0,
  showArrows = true,
  showDots = false,
  className,
}: CarouselProps) {
  const uid = useId().replace(/:/g, '');
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  // Mouse drag-to-scroll support
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: track.scrollLeft };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.current.x;
    track.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const onMouseUp = () => setIsDragging(false);

  const getPerView = useCallback(() => {
    if (typeof slidesPerView === 'number') return slidesPerView;
    return window.innerWidth >= 768 ? slidesPerView.desktop : slidesPerView.mobile;
  }, [slidesPerView]);

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    const absScroll = Math.abs(scrollLeft);
    setCanScrollPrev(absScroll > 2);
    setCanScrollNext(absScroll + clientWidth < scrollWidth - 2);

    const perView = getPerView();
    const slideWidth = (clientWidth + gap) / perView;
    if (slideWidth > 0) {
      setActiveIndex(Math.round(absScroll / slideWidth));
      setTotalSlides(Math.round(scrollWidth / slideWidth));
    }
  }, [gap, getPerView]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateState();
    track.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    return () => {
      track.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, [updateState]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || autoPlay <= 0) return;
    const track = trackRef.current;
    if (!track) return;

    let paused = false;
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);

    const interval = setInterval(() => {
      if (paused) return;
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const absScroll = Math.abs(scrollLeft);
      const isRtl = getComputedStyle(track).direction === 'rtl';

      if (absScroll + clientWidth >= scrollWidth - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const delta = clientWidth;
        track.scrollBy({ left: isRtl ? -delta : delta, behavior: 'smooth' });
      }
    }, autoPlay);

    return () => {
      clearInterval(interval);
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
    };
  }, [autoPlay]);

  const scroll = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    const absScroll = Math.abs(scrollLeft);
    const isRtl = getComputedStyle(track).direction === 'rtl';
    const delta = clientWidth;

    if (direction === 'next') {
      // At the end → wrap to start
      if (absScroll + clientWidth >= scrollWidth - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: isRtl ? -delta : delta, behavior: 'smooth' });
      }
    } else {
      // At the start → wrap to end
      if (absScroll <= 2) {
        const endPos = scrollWidth - clientWidth;
        track.scrollTo({ left: isRtl ? -endPos : endPos, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: isRtl ? delta : -delta, behavior: 'smooth' });
      }
    }
  };

  // Build scoped CSS for slide widths
  const cls = `crsl-${uid}`;
  const perView = typeof slidesPerView === 'number' ? slidesPerView : null;
  const perViewMobile = typeof slidesPerView === 'object' ? slidesPerView.mobile : null;
  const perViewDesktop = typeof slidesPerView === 'object' ? slidesPerView.desktop : null;

  let sizeCSS = '';
  if (perView) {
    sizeCSS = `.${cls} > * { width: calc((100% - ${gap * (perView - 1)}px) / ${perView}); }`;
  } else if (perViewMobile != null && perViewDesktop != null) {
    sizeCSS =
      `.${cls} > * { width: calc((100% - ${gap * (perViewMobile - 1)}px) / ${perViewMobile}); }` +
      `@media (min-width: 768px) { .${cls} > * { width: calc((100% - ${gap * (perViewDesktop - 1)}px) / ${perViewDesktop}); } }`;
  }

  return (
    <div className={cn('relative group/carousel', className)}>
      <style>{`.${cls} > * { flex-shrink: 0; scroll-snap-align: start; } ${sizeCSS}`}</style>
      <div
        ref={trackRef}
        className={cn('flex flex-nowrap overflow-x-auto no-scrollbar', cls)}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          gap,
          scrollSnapType: isDragging ? 'none' : 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {children}
      </div>

      {showArrows && (
        <>
          <button
            onClick={() => scroll('prev')}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 end-2 z-10',
              'w-10 h-10 rounded-full bg-card-bg shadow-md border border-border-light',
              'flex items-center justify-center',
              'opacity-0 group-hover/carousel:opacity-100 transition-opacity',
              !canScrollPrev && !canScrollNext && 'hidden',
            )}
            aria-label="Previous"
          >
            <Icon name="chevron_right" className="text-xl text-text-main" />
          </button>
          <button
            onClick={() => scroll('next')}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 start-2 z-10',
              'w-10 h-10 rounded-full bg-card-bg shadow-md border border-border-light',
              'flex items-center justify-center',
              'opacity-0 group-hover/carousel:opacity-100 transition-opacity',
              !canScrollPrev && !canScrollNext && 'hidden',
            )}
            aria-label="Next"
          >
            <Icon name="chevron_left" className="text-xl text-text-main" />
          </button>
        </>
      )}

      {showDots && totalSlides > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                const track = trackRef.current;
                if (!track) return;
                const perV = getPerView();
                const slideWidth = (track.clientWidth + gap) / perV;
                const isRtl = getComputedStyle(track).direction === 'rtl';
                track.scrollTo({
                  left: isRtl ? -(i * slideWidth) : i * slideWidth,
                  behavior: 'smooth',
                });
              }}
              /* 44×44 tap target (WCAG 2.5.5) — visual dot is an inner span */
              className="w-11 h-11 flex items-center justify-center rounded-full"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            >
              <span className={cn(
                'block w-2.5 h-2.5 rounded-full transition-colors',
                i === activeIndex ? 'bg-primary' : 'bg-border-accent',
              )} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
