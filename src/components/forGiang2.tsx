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
        "Không biết có được là người chúc em sớm nhất hông ...",
        "Nhưng mà bây giờ, 1h sáng rùiiii",
        "Chúc em có một ngày thật vui vẻ, hạnh phúc và ấm áp nè",
        "Dù có gặp khó khăn, thất bại hay gì chăng nữa, hãy nhớ rằng:",
        "Anh vẫn ở đây, đợi em nha 🥺🥺🥺",
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
                    <p className="subtext">Muốn gửi một bông hoa đến bông hoa đẹp nhất đang đọc cơ 🥺🥺🥺</p>

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
