"use client";

import React, { useEffect, useState } from 'react';

const WomensDay: React.FC = () => {
    // Các hook luôn được gọi bất kể mounted hay không
    const [mounted, setMounted] = useState(false);
    const confettiPieces = Array.from({ length: 50 });

    const getRandomColor = () => {
        const colors = ['#FFC0CB', '#FFD700', '#ADFF2F', '#FF69B4', '#87CEFA', '#FF4500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Mảng chứa các dòng nội dung cần hiển thị theo hiệu ứng gõ chữ.
    const textLines = [
        "Today is...",
        "as beautiful as other days",
        "but you realize",
        "another year has gone",
        "in a blink of the eyes",
        "<strong>however</strong>",
        "Do you know..?",
        "today is just special",
        "so special to you",
        "that's why",
        "Let's make it...",
        "the best celebration ever",
        "and let me share...",
        "a piece of happiness to you",
        "I made all this...",
        "as a birthday present to you",
        "thanks for being there",
        "thanks for the friendship we made",
        "thanks for everything",
        "I wish you all the best",
        "May your life be at ease",
        "May all your wishes come true",
        "Remember",
        "your ambitions",
        "you live as a free bird...",
        "flying in the blue sky",
        "Now things are different...",
        "real story of your life",
        "is just about to begin",
        "indeed..",
        "but...",
        "don't worry",
        "because...",
        "God has your back",
        "and",
        "this year will be better",
        "and I hope",
        "you'll find...",
        "happiness along the way",
        "keep your spirit up",
        "enjoy every single moment...",
        "that you experience today",
        "fill it with your most beautiful smile",
        "and make it the best memory..",
        "lastly...",
        "I'd like to wish you one more time",
        "a very happy birthday Xola Mathembisa"
    ];
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState<string>('');
    const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
    const [charIndex, setCharIndex] = useState<number>(0);

    // Đánh dấu khi component được mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Hiệu ứng gõ chữ chỉ chạy sau khi đã mount
    useEffect(() => {
        if (!mounted) return;

        if (currentLineIndex < textLines.length) {
            if (charIndex < textLines[currentLineIndex].length) {
                const timeout = setTimeout(() => {
                    setCurrentLine(textLines[currentLineIndex].substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                }, 100); // tốc độ gõ chữ (ms)
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setDisplayedLines(prev => [...prev, textLines[currentLineIndex]]);
                    setCurrentLineIndex(currentLineIndex + 1);
                    setCurrentLine('');
                    setCharIndex(0);
                }, 1000); // thời gian chờ giữa các dòng (ms)
                return () => clearTimeout(timeout);
            }
        }
    }, [mounted, charIndex, currentLineIndex, textLines]);

    return (
        <div className="container">
            {/* Nếu chưa mounted, có thể hiển thị một container rỗng hoặc loader */}
            {!mounted ? null : (
                <>
                    <h1 className="animated-text">Chúc mừng ngày 8/3!</h1>
                    <p className="subtext">Chúc tất cả những người phụ nữ luôn tươi cười và hạnh phúc!</p>

                    <div className="typing-container">
                        {displayedLines.map((line, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                        {currentLineIndex < textLines.length && (
                            <p>
                                <span dangerouslySetInnerHTML={{ __html: currentLine }} />
                                <span className="cursor">|</span>
                            </p>
                        )}
                    </div>

                    <div className="confetti-container">
                        {confettiPieces.map((_, i) => (
                            <div
                                key={i}
                                className="confetti-piece"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    backgroundColor: getRandomColor(),
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            <style>{`
        .container {
          position: relative;
          text-align: center;
          padding: 50px;
          background: linear-gradient(to right, #ff9a9e, #fad0c4);
          overflow: hidden;
          min-height: 100vh;
        }
        .animated-text {
          font-size: 3rem;
          color: #fff;
          animation: bounce 2s infinite;
          margin-bottom: 20px;
        }
        .subtext {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 40px;
        }
        .typing-container {
          font-family: 'Courier New', Courier, monospace;
          font-size: 1.2rem;
          line-height: 1.8;
          color: #fff;
          margin-bottom: 40px;
        }
        .cursor {
          display: inline-block;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 0; }
          50% { opacity: 1; }
        }
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.7;
          animation: fall 5s linear infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-10%);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default WomensDay;
