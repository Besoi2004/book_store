import React from "react";

const Loading = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1.5rem', background: 'transparent' }}>
      <div className="book">
        <div className="book__pg-shadow" />
        <div className="book__pg" />
        <div className="book__pg book__pg--2" />
        <div className="book__pg book__pg--3" />
        <div className="book__pg book__pg--4" />
        <div className="book__pg book__pg--5" />
      </div>
      <p style={{ color: '#6b7280', fontWeight: 500, fontSize: '0.95rem', letterSpacing: '0.02em' }}>Đang tải...</p>
      <style>{`
        .book,
        .book__pg-shadow,
        .book__pg {
          animation: book-cover 3s ease-in-out infinite;
        }
        .book {
          background-color: hsl(268, 90%, 65%);
          border-radius: 0.25em;
          box-shadow: 0 0.25em 0.5em hsla(0,0%,0%,0.3), 0 0 0 0.25em hsl(278,100%,57%) inset;
          padding: 0.25em;
          perspective: 37.5em;
          position: relative;
          width: 8em;
          height: 6em;
          transform: translate3d(0,0,0);
          transform-style: preserve-3d;
        }
        .book__pg-shadow,
        .book__pg {
          position: absolute;
          left: 0.25em;
          width: calc(50% - 0.25em);
        }
        .book__pg-shadow {
          animation-name: book-shadow;
          background-image: linear-gradient(-45deg, hsla(0,0%,0%,0) 50%, hsla(0,0%,0%,0.3) 50%);
          filter: blur(0.25em);
          top: calc(100% - 0.25em);
          height: 3.75em;
          transform: scaleY(0);
          transform-origin: 100% 0%;
        }
        .book__pg {
          animation-name: book-pg1;
          background-color: hsl(223,10%,100%);
          background-image: linear-gradient(90deg, hsla(223,10%,90%,0) 87.5%, hsl(223,10%,90%));
          height: calc(100% - 0.5em);
          transform-origin: 100% 50%;
        }
        .book__pg--2,
        .book__pg--3,
        .book__pg--4 {
          background-image: repeating-linear-gradient(hsl(223,10%,10%) 0 0.125em, hsla(223,10%,10%,0) 0.125em 0.5em),
            linear-gradient(90deg, hsla(223,10%,90%,0) 87.5%, hsl(223,10%,90%));
          background-repeat: no-repeat;
          background-position: center;
          background-size: 2.5em 4.125em, 100% 100%;
        }
        .book__pg--2 { animation-name: book-pg2; }
        .book__pg--3 { animation-name: book-pg3; }
        .book__pg--4 { animation-name: book-pg4; }
        .book__pg--5 { animation-name: book-pg5; }

        @keyframes book-cover {
          from, 5%, 45%, 55%, 95%, to { animation-timing-function: ease-out; background-color: hsl(278,84%,67%); }
          10%, 40%, 60%, 90% { animation-timing-function: ease-in; background-color: hsl(271,90%,45%); }
        }
        @keyframes book-shadow {
          from, 10.01%, 20.01%, 30.01%, 40.01% { animation-timing-function: ease-in; transform: translate3d(0,0,1px) scaleY(0) rotateY(0); }
          5%, 15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95% { animation-timing-function: ease-out; transform: translate3d(0,0,1px) scaleY(0.2) rotateY(90deg); }
          10%, 20%, 30%, 40%, 50%, to { animation-timing-function: ease-out; transform: translate3d(0,0,1px) scaleY(0) rotateY(180deg); }
          50.01%, 60.01%, 70.01%, 80.01%, 90.01% { animation-timing-function: ease-in; transform: translate3d(0,0,1px) scaleY(0) rotateY(180deg); }
          60%, 70%, 80%, 90%, to { animation-timing-function: ease-out; transform: translate3d(0,0,1px) scaleY(0) rotateY(0); }
        }
        @keyframes book-pg1 {
          from, to { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0.4deg); }
          10%, 15% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(180deg); }
          20%, 80% { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(180deg); }
          85%, 90% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(180deg); }
        }
        @keyframes book-pg2 {
          from, to { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(0.3deg); }
          5%, 10% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0.3deg); }
          20%, 25% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(179.9deg); }
          30%, 70% { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(179.9deg); }
          75%, 80% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(179.9deg); }
          90%, 95% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0.3deg); }
        }
        @keyframes book-pg3 {
          from, 10%, 90%, to { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(0.2deg); }
          15%, 20% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0.2deg); }
          30%, 35% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(179.8deg); }
          40%, 60% { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(179.8deg); }
          65%, 70% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(179.8deg); }
          80%, 85% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0.2deg); }
        }
        @keyframes book-pg4 {
          from, 20%, 80%, to { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(0.1deg); }
          25%, 30% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0.1deg); }
          40%, 45% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(179.7deg); }
          50% { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(179.7deg); }
          55%, 60% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(179.7deg); }
          70%, 75% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0.1deg); }
        }
        @keyframes book-pg5 {
          from, 30%, 70%, to { animation-timing-function: ease-in; background-color: hsl(223,10%,45%); transform: translate3d(0,0,1px) rotateY(0); }
          35%, 40% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0deg); }
          50% { animation-timing-function: ease-in-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(179.6deg); }
          60%, 65% { animation-timing-function: ease-out; background-color: hsl(223,10%,100%); transform: translate3d(0,0,1px) rotateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Loading;