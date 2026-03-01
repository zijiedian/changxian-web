import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_TRACK_CLASS =
  'scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 select-none cursor-grab active:cursor-grabbing';

export default function BlogPosterDeck({
  cards,
  renderCard,
  controls = null,
  showMobileHint = false,
  trackClassName = DEFAULT_TRACK_CLASS,
  gap = 24,
  minScale = 0.55,
}) {
  const trackRef = useRef(null);
  const dotRefs = useRef([]);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [scale, setScale] = useState(1);

  const cardWidth = useMemo(() => 600 * scale, [scale]);
  const cardHeight = useMemo(() => 800 * scale, [scale]);

  useEffect(() => {
    const updateScale = () => {
      const maxWidth = window.innerWidth - 48;
      const widthScale = maxWidth / 600;
      const heightScale = (window.innerHeight * 0.6) / 800;
      const nextScale = Math.min(1, widthScale, heightScale);
      setScale(Math.max(minScale, nextScale));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [minScale]);

  useEffect(() => {
    const updateDots = () => {
      const track = trackRef.current;
      if (!track) return;
      const step = cardWidth + gap;
      const index = Math.round(track.scrollLeft / step);
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        dot.classList.toggle('bg-brand', i === Math.min(index, cards.length - 1));
        dot.classList.toggle('bg-black/20', i !== Math.min(index, cards.length - 1));
      });
    };

    updateDots();
    const track = trackRef.current;
    if (!track) return undefined;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        updateDots();
        ticking = false;
      });
      ticking = true;
    };

    track.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateDots);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateDots);
    };
  }, [cardWidth, cards.length, gap]);

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture?.(event.pointerId);
    dragState.current.isDown = true;
    dragState.current.startX = event.clientX;
    dragState.current.scrollLeft = track.scrollLeft;
  };

  const handlePointerMove = (event) => {
    if (!dragState.current.isDown) return;
    const track = trackRef.current;
    if (!track) return;
    const walk = event.clientX - dragState.current.startX;
    track.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const handlePointerUp = (event) => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    const track = trackRef.current;
    track?.releasePointerCapture?.(event.pointerId);
  };

  return (
    <>
      <div
        ref={trackRef}
        className={trackClassName}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="snap-start"
            style={{ width: `${cardWidth}px`, height: `${cardHeight}px`, flex: `0 0 ${cardWidth}px` }}
          >
            {renderCard(card, { scale, cardWidth, cardHeight })}
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-center">
        <div className="glass-card flex items-center gap-2 rounded-full px-3 py-2">
          {cards.map((card, index) => (
            <span
              key={card.id}
              ref={(el) => {
                dotRefs.current[index] = el;
              }}
              className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-brand' : 'bg-black/20'}`}
            />
          ))}
        </div>
      </div>

      {showMobileHint ? <p className="mt-2 text-center text-xs text-muted sm:hidden">左右滑动查看卡片</p> : null}

      {controls}
    </>
  );
}
